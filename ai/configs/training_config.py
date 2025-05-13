from transformers import TrainingArguments

def get_training_arguments():
    return TrainingArguments(
        output_dir="ai/output",
        max_steps=1500,
        per_device_train_batch_size=1,
        gradient_accumulation_steps=16,
        learning_rate=2e-4,
        logging_steps=50,
        save_strategy="steps",
        save_steps=500,
        save_total_limit=2,
        fp16=True,
        optim="paged_adamw_8bit",
        warmup_ratio=0.03,
        report_to="none",
    )   
