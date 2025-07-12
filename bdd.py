import json
from typing import Literal
from pydantic import BaseModel

TeamNames = Literal["", "red", "blu"]

class BingoChallenge(BaseModel):
    text: str
    challengers: list[str] = []
    checkedBy: TeamNames = ""


players: dict[str, str] = {}
bingo: list[BingoChallenge] = []


def reloadPlayers():
    global players
    with open("./data/players.json", encoding="utf-8") as json_file:
        players = json.load(json_file)

def savePlayers():
    global players
    with open("./data/players.json", 'w', encoding="utf-8") as json_file:
        json.dump(players, json_file, indent=4)

def reloadBingo():
    global bingo
    with open("./data/bingo.json", encoding="utf-8") as json_file:
        data = json.load(json_file)
        bingo = [BingoChallenge.model_validate(b) for b in data]

def saveBingo():
    with open("./data/bingo.json", 'w', encoding="utf-8") as json_file:
        json.dump(bingo, json_file, indent=4)

def serializeBingo() -> list[dict]:
    return [ b.model_dump() for b in bingo ]