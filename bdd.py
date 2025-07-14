import json
from typing import Literal
from pydantic import BaseModel

TeamNames = Literal["", "red", "blu"]

class BingoChallenge(BaseModel):
    text: str
    challengers: list[str] = []
    checkedBy: TeamNames = ""

class ChallengeRequest(BaseModel):
    team: str
    index: int

players: dict[str, str] = {}
bingo: list[BingoChallenge] = []
challengesRequests: list[ChallengeRequest] = []


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
        json.dump(serializeBingo(), json_file, indent=4)

def serializeBingo() -> list[dict]:
    return [ b.model_dump() for b in bingo ]

def serializeChallengeRequests() -> list[dict]:
    result = [c.model_dump() for c in challengesRequests ]

    for r in result:
        r["text"] = bingo[r["index"]].text

    return result

def findRequest(index : int, team : str) -> ChallengeRequest | None:
    for request in challengesRequests:
        if request.index == index and request.team == team:
            return request
    return None

def removeRequest(index : int, team : str) -> None:
    for request in challengesRequests:
        if request.index == index and request.team == team:
            challengesRequests.remove(request)