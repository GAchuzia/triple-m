import requests
import json

# Post request, initializes a question
query = {"type": "addition", "content": '{"1": "14", "2": "27"}', "answer": "test", "attempts": "0", "correct": "0", "rating": "0"}
response = requests.post('http://localhost:3001/api/insert/', json=query, timeout=1)
print(json.dumps(json.loads(response.text), indent=4))

# Get recent id
json_data = json.loads(response.text)
location = json_data['insertId']

# Get Request, gets data from database
response = requests.get('http://localhost:3001/api/get/', timeout=1)
print(json.dumps(json.loads(response.text), indent=4))

# Put request, changes the data on a question matching id
query = {"id": location, "type": "subtraction", "content": '{"1": "21", "2": "21", "2": "104"}', "answer": "hmm", "attempts": "12", "correct": "14", "rating": "0.3"}
print(query)
response = requests.put('http://localhost:3001/api/update/', json=query, timeout=1)
print(json.dumps(json.loads(response.text), indent=4))

# Delete request, deletes a question based on id
query = {"id": location}
print(query)
response = requests.delete('http://localhost:3001/api/delete/', json=query, timeout=1)
print(json.dumps(json.loads(response.text), indent=4))