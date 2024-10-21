from transformers import BertTokenizer, BertForSequenceClassification, Trainer, TrainingArguments
import pandas as pd
import torch
from torch.utils.data import Dataset, DataLoader


tokenizer = BertTokenizer.from_pretrained('thu-coai/roberta-base-cold')
model = BertForSequenceClassification.from_pretrained('thu-coai/roberta-base-cold')

for param in model.base_model.parameters():
    param.requires_grad = False

df = pd.read_csv("hf://datasets/Paul/hatecheck-mandarin/test.csv")
filtered_df = df.iloc[:, [2, 3]]
filtered_df['label_gold'] = filtered_df['label_gold'].map({"hateful": 1, "non-hateful": 0})

def has_english_chars(text):
    for x in text:
        if 65 <= ord(x) <= 90 or 97 <= ord(x) <= 122:
            return True
    return False

filtered_df = filtered_df[~filtered_df['test_case'].apply(has_english_chars)].rename(columns={"test_case": "text", "label_gold": "labels"})
filtered_df.reset_index(drop=True, inplace=True)

# Tokenization function
def tokenize_function(texts):
    return tokenizer(texts, padding='max_length', truncation=True, return_tensors='pt', max_length=20)

# Custom Dataset class
class CustomDataset(Dataset):
    def __init__(self, dataframe):
        self.dataframe = dataframe
        self.labels = dataframe['labels'].tolist()
        self.encodings = tokenize_function(dataframe['text'].tolist())

    def __len__(self):
        return len(self.dataframe)

    def __getitem__(self, idx):
        item = {key: val[idx] for key, val in self.encodings.items()}
        item['labels'] = torch.tensor(self.labels[idx])
        return item

train = filtered_df.sample(frac=0.8)
test = filtered_df[~filtered_df.index.isin(train.index)]

# Create dataset
train_ds = CustomDataset(train)
test_ds = CustomDataset(test)




# Define training arguments
training_args = TrainingArguments(
    output_dir='./results',          # Output directory
    evaluation_strategy="epoch",     # Evaluate at the end of each epoch
    learning_rate=2e-5,              # Learning rate
    per_device_train_batch_size=4,  # Batch size per device during training
    per_device_eval_batch_size=16,   # Batch size for evaluation
    num_train_epochs=10,              # Total number of training epochs
    weight_decay=0.01,               # Strength of weight decay
    save_strategy="epoch"
)

# Initialize the Trainer
trainer = Trainer(
    model=model,                         # The pre-trained BERT model
    args=training_args,                  # Training arguments
    train_dataset=train_ds,   # Training dataset
    eval_dataset=test_ds,     # Evaluation dataset
)

trainer.train()
