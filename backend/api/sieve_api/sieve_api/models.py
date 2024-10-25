from dataclasses import dataclass
from typing import List

@dataclass
class Message:
    role: str
    content: str

@dataclass
class Choice:
    index: int
    message: Message

@dataclass
class ChatCompletionResponse:
    id: str
    object: str
    created: int
    model: str
    choices: List[Choice]