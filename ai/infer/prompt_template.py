def apply_prompt_template(user_input: str) -> str:
    """
    사용자의 입력을 LLM 프롬프트 형식에 맞게 변환합니다.
    예시:
    <|user|>
    오늘은 수학에서 인수분해를 공부했어
    <|assistant|>
    """
    return f"<|user|>\n{user_input.strip()}\n<|assistant|>\n"
