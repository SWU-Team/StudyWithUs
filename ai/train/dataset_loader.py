import os
import json
from datasets import load_dataset, concatenate_datasets, load_from_disk, Dataset

CACHE_PATH = "ai/cached_dataset"

def format_prompt(user, assistant):
    return f"<|user|>\n{user.strip()}\n<|assistant|>\n{assistant.strip()}"

def load_and_format_datasets():
    datasets = []

    # KoAlpaca
    try:
        koalpaca = load_dataset("beomi/KoAlpaca-v1.1a")["train"]
        koalpaca = koalpaca.filter(lambda x: x.get("instruction") and x.get("output"))
        koalpaca = koalpaca.map(lambda x: {"text": format_prompt(f"{x['instruction']} {x.get('input', '')}", x['output'])})
        datasets.append(koalpaca.select(range(5000)))
    except Exception as e:
        print(f"[ERROR] KoAlpaca: {e}")

    # CodeFeedback
    try:
        code = load_dataset("nayohan/CodeFeedback-Filtered-Instruction-ko")["train"]
        code = code.filter(lambda x: x.get("query") and x.get("answer"))
        code = code.filter(lambda x: 20 < len(x["query"]) < 1000 and 20 < len(x["answer"]) < 2000)
        code = code.map(lambda x: {"text": format_prompt(x['query'], x['answer'])})
        datasets.append(code.select(range(5000)))
    except Exception as e:
        print(f"[ERROR] CodeFeedback: {e}")

    # Dolly Korean
    try:
        dolly = load_dataset("nlpai-lab/databricks-dolly-15k-ko")["train"]
        dolly = dolly.filter(lambda x: x.get("instruction") and x.get("response"))
        dolly = dolly.map(lambda x: {"text": format_prompt(x['instruction'], x['response'])})
        datasets.append(dolly.select(range(5000)))
    except Exception as e:
        print(f"[ERROR] Dolly: {e}")

    # Textbooks
    try:
        edu = load_dataset("devngho/korean-textbooks-edu", name="scored_over_3")["train"]
        edu = edu.filter(lambda x: x.get("text") and len(x["text"]) > 20)
        edu = edu.map(lambda x: {"text": format_prompt("이 문장을 읽고 의미를 설명해주세요:\n" + x['text'], "")})
        datasets.append(edu.select(range(30000)))
    except Exception as e:
        print(f"[ERROR] Textbooks Edu: {e}")

    # Custom Mixed
    try:
        with open("ai/data/custom_mixed.json", "r", encoding="utf-8") as f:
            custom = json.load(f)

        custom_dataset = Dataset.from_list([
            {"text": format_prompt(f"{c['instruction']} {c.get('input', '')}", c['output'])}
            for c in custom if c.get("instruction") and c.get("output")
        ])

        # oversampling 5배 → 데이터 수 기반 동적 조정 가능 (현재 고정 유지)
        custom_oversampled = concatenate_datasets([custom_dataset] * 5).select(range(30000))
        datasets.append(custom_oversampled)

    except Exception as e:
        print(f"[ERROR] Custom dataset: {e}")

    return concatenate_datasets(datasets)

def get_tokenized_dataset(tokenizer):
    if os.path.exists(CACHE_PATH):
        print("캐시된 토크나이즈 데이터셋 로딩 중...")
        return load_from_disk(CACHE_PATH)

    dataset = load_and_format_datasets()
    dataset = dataset.shuffle(seed=42).select(range(min(120000, len(dataset))))

    def tokenize_function(batch):
        return tokenizer(batch["text"], padding="max_length", truncation=True, max_length=1024)

    tokenized = dataset.map(tokenize_function, batched=True, remove_columns=dataset.column_names)
    tokenized.save_to_disk(CACHE_PATH)
    return tokenized
