from transformers import (
    TokenClassificationPipeline,
    AutoModelForTokenClassification,
    AutoTokenizer,
)
from transformers.pipelines import AggregationStrategy
import numpy as np
from numpy.typing import NDArray
from keybert import KeyBERT


# class ML16Model(TokenClassificationPipeline):
#     def __init__(self, model, *args, **kwargs):
#         super().__init__(
#             model=AutoModelForTokenClassification.from_pretrained(model),
#             tokenizer=AutoTokenizer.from_pretrained(model),
#             *args,
#             **kwargs
#         )
#
#     def postprocess(self, all_outputs: NDArray) -> NDArray:
#         results = super().postprocess(
#             all_outputs=all_outputs,
#             aggregation_strategy=AggregationStrategy.SIMPLE,
#         )
#         return np.unique([result.get("word").strip().lower() for result in results])
#
#
# model_name = "ml6team/keyphrase-extraction-kbir-inspec"
# model = ML16Model(model=model_name)

model = KeyBERT()


def extract_keywords(text: str) -> list[str]:
    data = model.extract_keywords(text, keyphrase_ngram_range=(1, 2))

    print(data)

    return [kw[0] for kw in data]
