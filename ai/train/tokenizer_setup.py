from transformers import AutoTokenizer

BASE_MODEL = "heegyu/polyglot-ko-1.3b-chat"

def get_tokenizer():
    tokenizer = AutoTokenizer.from_pretrained(BASE_MODEL)
    tokenizer.pad_token = tokenizer.eos_token
    tokenizer.padding_side = "right"
    return tokenizer
