from peft import LoraConfig

def get_lora_config():
    return LoraConfig(
        r=8,
        lora_alpha=32,
        lora_dropout=0.1,
        target_modules=[
            "query_key_value",
            "dense",
            "dense_h_to_4h",
            "dense_4h_to_h",
            "mlp.dense_h_to_4h",
            "mlp.dense_4h_to_h"
        ],
        bias="none",
        task_type="CAUSAL_LM"
    )
