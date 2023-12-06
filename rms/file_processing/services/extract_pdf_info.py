import re
from io import BytesIO
from typing import BinaryIO

import numpy as np
from pypdf import PdfReader

from rms.file_processing.clients import MinioClient
from rms.file_processing.models import FileOrm
from rms.file_processing.services.models import PdfArticleData, FirstPagePdfData, Author

from rms.file_processing.services.models import PdfArticleData, FirstPagePdfData
from rms.file_processing.services.utils import on_error
from rms.settings import Settings
from rms.utils.list import find_index_containing


settings = Settings()


async def download_and_process_file(file: FileOrm) -> PdfArticleData:
    client = MinioClient()
    pdf_data = await client.download(file.path)

    return process_file(BytesIO(pdf_data))


def process_file(stream: BinaryIO) -> PdfArticleData:
    file = PdfReader(stream)

    first_page_text = PageFilterer(file.pages[0].extract_text()).filter()
    second_page_text = PageFilterer(file.pages[1].extract_text()).filter()
    third_page_text = PageFilterer(file.pages[2].extract_text()).filter()

    data = PageDataExtractor(first_page_text, second_page_text).extract()

    if settings.use_keyword_extraction_model:
        from rms.file_processing.services.keyword_extractor import keyword_extractor

        text_keywords = keyword_extractor(second_page_text + "\n" + third_page_text)
    else:
        text_keywords = np.array([])

    return PdfArticleData(
        name=data.name,
        keywords=data.keywords + text_keywords.tolist(),
        authors=data.authors,
    )


class PageFilterer:
    NUMBERS_RE = re.compile(r"^\s*\d*\s*$")

    def __init__(self, page: str):
        self.page = page
        self.page_lines = page.split("\n")

    def filter(self) -> str:
        lines = filter(self._filter_line_numbers, self.page_lines)

        return "\n".join(lines)

    def _filter_line_numbers(self, line: str) -> bool:
        return self.NUMBERS_RE.match(line) is None


class PageDataExtractor:
    def __init__(self, first_page_content: str, second_page_content: str):
        self.first_page_content = first_page_content
        self.second_page_content = second_page_content
        self.first_page_content_lines = first_page_content.split("\n")

    def extract(self) -> FirstPagePdfData:
        authors = self._extract_authors()
        emails = self.extract_emails()

        for author, email in zip(authors, emails, strict=False):
            author.email = email

        return FirstPagePdfData(
            name=self._extract_name(),
            keywords=self._extract_keywords(),
            authors=authors,
        )

    @on_error(return_value="Error during name extraction")
    def _extract_name(self) -> str:
        return self.first_page_content_lines[1]

    @on_error(return_value=[])
    def _extract_authors(self) -> list[Author]:
        author_idx = find_index_containing(self.first_page_content_lines, "List of Authors")
        keywords_idx = find_index_containing(self.first_page_content_lines, "Keywords")

        authors_section = self.first_page_content_lines[author_idx:keywords_idx]

        if authors_section and "Complete List of Authors:" in authors_section[0]:
            authors_section[0] = authors_section[0].replace("Complete List of Authors:", "").strip()

        formatted_authors = []
        current_author = ""

        for line in authors_section:
            if ';' in line or ',' in line and line.count(',') == 1 and ';' not in current_author:
                if current_author:
                    formatted_authors.append(current_author.strip().split(";")[0])
                current_author = line
            else:
                current_author += " " + line

        if current_author:
            formatted_authors.append(current_author.strip().split(";")[0])

        return [self._parse_singular_author(author) for author in formatted_authors]

    @on_error(return_value=[])
    def _extract_keywords(self) -> list[str]:
        keywords_idx = find_index_containing(self.first_page_content_lines, "Keywords:")

        keywords_raw = "".join(self.first_page_content_lines[keywords_idx:-1])
        keywords_raw = keywords_raw.replace("Keywords:", "")

        keywords = keywords_raw.split(",")
        keywords = [word.strip() for word in keywords]

        return keywords

    @on_error(return_value=Author(first_name="error", last_name="processing"))
    def _parse_singular_author(self, author: str) -> Author:
        author_parts = author.split(",")
        return Author(
            first_name=author_parts[1],
            last_name=author_parts[0]
        )

    @on_error(return_value=[])
    def extract_emails(self) -> list[str]:
        email_regex = re.compile(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b')
        return email_regex.findall(self.second_page_content)
