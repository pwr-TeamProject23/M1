import re
from io import BytesIO
from typing import BinaryIO

import numpy as np
from pypdf import PdfReader

from rms.file_processing.clients import MinioClient
from rms.file_processing.models import FileOrm

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

    first_page_data = FirstPageDataExtractor(first_page_text).extract()

    if settings.use_keyword_extraction_model:
        from rms.file_processing.services.keyword_extractor import keyword_extractor

        text_keywords = keyword_extractor(second_page_text + "\n" + third_page_text)
    else:
        text_keywords = np.array([])

    return PdfArticleData(
        name=first_page_data.name,
        keywords=first_page_data.keywords + text_keywords.tolist(),
        authors=first_page_data.authors,
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


class FirstPageDataExtractor:
    def __init__(self, content: str):
        self.content = content
        self.content_lines = content.split("\n")

    def extract(self) -> FirstPagePdfData:
        return FirstPagePdfData(
            name=self._extract_name(),
            keywords=self._extract_keywords(),
            authors=self._extract_authors(),
        )

    @on_error(return_value="Error during name extraction")
    def _extract_name(self) -> str:
        return self.content_lines[1]

    @on_error(return_value=[])
    def _extract_authors(self) -> list[str]:
        author_idx = find_index_containing(self.content_lines, "List of Authors")
        keywords_idx = find_index_containing(self.content_lines, "Keywords")

        authors = self.content_lines[author_idx:keywords_idx]
        authors[0] = authors[0].replace("Complete List of Authors:", "").strip()

        return authors

    @on_error(return_value=[])
    def _extract_keywords(self) -> list[str]:
        keywords_idx = find_index_containing(self.content_lines, "Keywords:")

        keywords_raw = "".join(self.content_lines[keywords_idx:-1])
        keywords_raw = keywords_raw.replace("Keywords:", "")

        keywords = keywords_raw.split(",")
        keywords = [word.strip() for word in keywords]

        return keywords
