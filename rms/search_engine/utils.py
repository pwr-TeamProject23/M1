from pathlib import Path


class StopWordsProcessor:
    STOPWORDS_PATH = Path(__file__).parent / 'assets' / 'stopwords.txt'

    def __init__(self, file_path: Path = None):
        if file_path is None:
            file_path = self.STOPWORDS_PATH
        self.stop_words = self._load_stop_words(file_path)

    @staticmethod
    def _load_stop_words(file_path: Path) -> set:
        try:
            stop_words_text = file_path.read_text(encoding='utf-8')
            return {line.strip().lower() for line in stop_words_text.splitlines() if line.strip()}
        except IOError as e:
            raise RuntimeError(f"Error reading stopwords file at {file_path}: {e}")

    def remove_stop_words(self, text: str) -> str:
        words = text.split()
        filtered_words = [word for word in words if word.lower() not in self.stop_words]
        return ' '.join(filtered_words)
