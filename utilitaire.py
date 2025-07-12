import json

def in_players_data(name : str):
    players_data = load_data("players.json")
    for player in players_data:
        if player["name"] == name:
            return True
    return False

def get_player_data(name : str):
    players_data = load_data("players.json")
    for player in players_data:
        if player["name"] == name:
            return player

def load_data(filename : str):
    with open("./data/" + filename, 'r', encoding="utf-8") as json_file:
        data = json.load(json_file)
        return data

def save_data(filename : str, data : dict):
    with open("./data/" + filename, 'w', encoding="utf-8") as json_file:
        json.dump(data, json_file, indent=4)