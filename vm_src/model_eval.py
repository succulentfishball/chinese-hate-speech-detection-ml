from transformers import BertTokenizer, BertForSequenceClassification
import pandas as pd
import torch
import numpy as np

model_path = "./results/checkpoint-6430"

tokenizer = BertTokenizer.from_pretrained('thu-coai/roberta-base-cold')
model = BertForSequenceClassification.from_pretrained('thu-coai/roberta-base-cold')

def has_english_chars(text):
    for x in text:
        if 65 <= ord(x) <= 90 or 97 <= ord(x) <= 122:
            return True
    return False

df = pd.read_csv("hf://datasets/Paul/hatecheck-mandarin/test.csv")
filtered_df = df.iloc[:, [2, 3]]
filtered_df['label_gold'] = filtered_df['label_gold'].map({"hateful": 1, "non-hateful": 0})
filtered_df = filtered_df[~filtered_df['test_case'].apply(has_english_chars)].rename(columns={"test_case": "text", "label_gold": "labels"})
filtered_df.reset_index(drop=True, inplace=True)



# Tokenize the inputs
inputs = tokenizer(
    list(filtered_df['text']),
    padding=True,
    truncation=True,
    return_tensors="pt",  # Return PyTorch tensors
    max_length=20
)

# Make sure to put the model in evaluation mode
model.eval()

# Disable gradient calculation for evaluation
with torch.no_grad():
    # Move inputs to the same device as the model (CPU or GPU)
    outputs = model(**inputs)

# Get the logits (raw predictions)
logits = outputs.logits

# Get predicted labels
predictions = torch.argmax(logits, dim=1).numpy()

# Calculate accuracy
accuracy = np.sum(predictions == filtered_df['labels'].to_numpy()) / len(filtered_df)
print(f"Accuracy: {accuracy:.4f}")
