from pydantic import BaseModel
from typing import List, Dict


class Option(BaseModel):
    text: str
    weights: Dict[str, int]


class Question(BaseModel):
    id: int
    text: str
    options: List[Option]


class Personality(BaseModel):
    name: str
    symbol: str
    description: str
    color: str
    comment: str


class TestResponse(BaseModel):
    personality: Personality
    scores: Dict[str, int]


class TestRequest(BaseModel):
    selected_options: List[int]
