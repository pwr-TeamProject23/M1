from typing import Any


def find_index_containing(data: list[Any], predicate: Any) -> int | None:
    contains_map = [predicate in line for line in data]

    return contains_map.index(True)
