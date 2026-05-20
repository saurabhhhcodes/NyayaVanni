"""
Streaming integration tests.
"""

import pytest

from synthesizer import stream_synthesize_answers
from research import stream_groq_chat

pytestmark = pytest.mark.asyncio


async def test_stream_groq_chat():
    """Test that stream_groq_chat yields tokens incrementally."""

    messages = [
        {
            "role": "user",
            "content": (
                "What is IPC Section 304A? "
                "Answer in one short sentence."
            ),
        }
    ]

    token_count = 0
    full_response = ""

    async for token in stream_groq_chat(
        messages,
        model="mixtral-8x7b-32768",
        max_tokens=100,
    ):
        token_count += 1
        full_response += token

    assert token_count > 0
    assert len(full_response.strip()) > 0


async def test_stream_synthesize():
    """Test that stream_synthesize_answers streams tokens."""

    research_results = [
        {
            "question": "What is IPC 304A?",
            "answer": (
                "Section 304A of the Indian Penal Code "
                "deals with causing death by negligence."
            ),
            "source": "groq",
        },
        {
            "question": "What are the penalties?",
            "answer": (
                "Imprisonment up to 2 years "
                "or fine or both."
            ),
            "source": "groq",
        },
    ]

    token_count = 0
    full_response = ""

    async for token in stream_synthesize_answers(
        "Tell me about IPC 304A",
        research_results,
    ):
        token_count += 1
        full_response += token

    assert token_count > 0
    assert len(full_response.strip()) > 0