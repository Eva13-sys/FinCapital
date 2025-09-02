import requests

url = "http://127.0.0.1:5000/api/ai"
payload = {"message": "hello"}
response = requests.post(url, json=payload)

print(response.status_code)
try:
    print(response.json())
except Exception as e:
    print("Response text:", response.text)
