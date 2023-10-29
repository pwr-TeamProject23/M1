from pypdf import PdfReader

from rms.file_processing.services import process_file, PageFilterer
from rms.file_processing.services.extract_pdf_info import FirstPageDataExtractor
from rms.file_processing.services.models import PdfArticleData


def test_pdf_processing_happy_path(test_file_one):
    output = process_file(test_file_one)

    assert isinstance(output, PdfArticleData)

    assert output.name == "Navigating the Web: Understanding the Mechanics of"
    assert len(output.keywords) == 6
    assert len(output.authors) == 3


def test_pdf_first_page_processor(test_file_one):
    file = PdfReader(test_file_one)
    page = file.pages[0]

    text = PageFilterer(page.extract_text()).filter()

    output = FirstPageDataExtractor(text).extract()

    assert output.name == "Navigating the Web: Understanding the Mechanics of"
    assert len(output.keywords) == 6
    assert len(output.authors) == 3
