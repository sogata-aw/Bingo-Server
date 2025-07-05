import json

def get_team(json_data, name):
    for user in json_data["players"]:
        if user["name"] == name:
            return user["team"]

def in_logged_users(json_data, name):
    for user in json_data["bingo"]["loggedUsers"]:
        if name==user["name"]:
            return True
    return False

def load_data():
    with open("./static/data.json", 'r') as json_file:
        data = json.load(json_file)
        return data

def save_data(data):
    with open("./static/data.json", 'w', encoding="utf-8") as json_file:
        json.dump(data, json_file, indent=4)