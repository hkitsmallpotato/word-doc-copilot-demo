import requests
import os

url = os.environ['LLM_URL_BASE'] # example "https://api.llmos.dev/v1/chat/completions"

headers = {
    "Authorization": f"Bearer {os.environ['LLM_API_KEY']}",
    "Content-Type": "application/json"
}

def gen_payload(max_token, msg):
    payload = {
        "model": "mistral-7b-instruct",
        "max_tokens": max_token,
        "stream": False,
        "temperture": 0.9,
        "messages": msg
    }
    return payload

def call_LLM(payload):
    response = requests.request("POST", url, json=payload, headers=headers)
    #print(response.text)
    data = response.json()
    return data['choices'][0]['message']['content']
