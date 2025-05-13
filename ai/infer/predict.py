import torch
from transformers import AutoTokenizer, AutoModelForCausalLM
from prompt_template import apply_prompt_template

# 경로 설정
MERGED_MODEL_PATH = "ai/output/merged_model-1000"

# 토크나이저 로드
tokenizer = AutoTokenizer.from_pretrained(MERGED_MODEL_PATH)
tokenizer.pad_token = tokenizer.eos_token
tokenizer.padding_side = "right"

# LoRA merged model 로드
model = AutoModelForCausalLM.from_pretrained(MERGED_MODEL_PATH, torch_dtype=torch.float16).to("cuda")
model.eval()

def generate_response(prompt: str):
    formatted = apply_prompt_template(prompt)
    inputs = tokenizer(formatted, return_tensors="pt").to("cuda")
    inputs.pop("token_type_ids", None)

    with torch.no_grad():
        outputs = model.generate(
            **inputs,
            max_new_tokens=768,
            temperature=0.5,
            top_p=0.9,
            do_sample=True,
            pad_token_id=tokenizer.eos_token_id,
            repetition_penalty=1.5
        )

    output_text = tokenizer.decode(outputs[0], skip_special_tokens=True).strip()

    if formatted in output_text:
        generated = output_text.split(formatted)[-1].strip()
    else:
        generated = output_text.strip()

    return generated if generated else "[출력이 비어 있습니다]"

if __name__ == "__main__":
    print("입력을 해보세요:")
    user_input = input("> ")
    response = generate_response(user_input)
    print("\n응답:\n", response)
