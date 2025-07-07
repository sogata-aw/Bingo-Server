import json

def load_players_data():
    with open("./data/players.json", 'r') as json_file:
        data = json.load(json_file)
        return data

def save_players_data(data : dict):
    with open("./data/players.json", 'w', encoding="utf-8") as json_file:
        json.dump(data, json_file, indent=4)

def in_players_data(name : str):
    players_data = load_players_data()
    for player in players_data:
        if player["name"] == name:
            return True
    return False

def get_player_data(name : str):
    players_data = load_players_data()
    for player in players_data:
        if player["name"] == name:
            return player

def load_bingo_data():
    with open("./data/bingo.json", 'r') as json_file:
        data = json.load(json_file)
        return data

def save_bingo_data(data):
    with open("./data/bingo.json", 'w', encoding="utf-8") as json_file:
        json.dump(data, json_file, indent=4)