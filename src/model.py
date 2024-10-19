import torch
from transformers.models.bert import BertTokenizer, BertForSequenceClassification

tokenizer = BertTokenizer.from_pretrained('thu-coai/roberta-base-cold')
model = BertForSequenceClassification.from_pretrained('thu-coai/roberta-base-cold')
model.eval()

texts = ['你就是个傻逼！','黑人很多都好吃懒做，偷奸耍滑！','男女平等，黑人也很优秀。']

model_input = tokenizer(texts,return_tensors="pt",padding=True)
model_output = model(**model_input, return_dict=False)
prediction = torch.argmax(model_output[0].cpu(), dim=-1)
prediction = [p.item() for p in prediction]
print(prediction) # --> [1, 1, 0] (0 for Non-Offensive, 1 for Offenisve)