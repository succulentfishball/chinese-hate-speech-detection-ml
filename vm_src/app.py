from flask import Flask, request, jsonify
from transformers import BertTokenizer, BertForSequenceClassification
import torch
import numpy as np
from flask_cors import CORS

app = Flask(__name__)
model_path = "./results/checkpoint-6430"
CORS(app)

# Load the tokenizer and model (from pre-trained model ~30MB)
tokenizer = BertTokenizer.from_pretrained('thu-coai/roberta-base-cold')
model = BertForSequenceClassification.from_pretrained(model_path)
model.eval() # Set model to evaluate mode.

# Inference function
def classify_text(text):
    model_input = tokenizer(text, return_tensors='pt', truncation=True, padding=True)
    model_output = model(**model_input, return_dict=False)
    prediction = torch.argmax(model_output[0].cpu(), dim=-1)
    prediction = [p.item() for p in prediction]
    
    return prediction  # Modify based on your hate speech label index

# API endpoint for classification
@app.route('/classify', methods=['GET', 'POST'])
def classify():
    if request.method == "GET":
        print("get")
        import json
        return json.dumps({'response': 200})
    else:
        data = request.json
        text_list = data.get('texts', [])
        text_list = np.array(text_list)
        print(text_list)
        results = np.array([classify_text(text) for text in text_list]).reshape(-1)
        text_list = text_list[results == 1]
        print(text_list)
        return jsonify(results=results.tolist())

@app.route('/gettertest')
def gettertest():
    print("get")
    import json
    return json.dumps({"response": 200})
    

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=80)
