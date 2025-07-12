from flask_socketio import SocketIO, emit
from pydantic import BaseModel

import bdd


class ClickRequest(BaseModel):
    name: str
    index: int

class UserRequest(BaseModel):
    name: str

class TeamRequest(BaseModel):
    name: str
    team: bdd.TeamNames

connected_users : list[str] = []

def emitConnectedUsers():
    emit(
        'update_connected_users',
        [{ "name": cu, "team": bdd.players[cu] } for cu in connected_users],
        broadcast=True
    )

def init_sockets(socketio: SocketIO):

    @socketio.on("case_click")
    def challengeClicked(data):
        data = ClickRequest.model_validate(data)
        challenge = bdd.bingo[data.index]

        if data.name in challenge.challengers:
            challenge.challengers.remove(data.name)
        else:
            challenge.challengers.append(data.name)

        bdd.saveBingo
        emit("update_bingo", bdd.serializeBingo(), broadcast=True)

    @socketio.on('join')
    def connect(data):
        data = UserRequest.model_validate(data)
        playerData = bdd.players.get(data.name)
        if playerData is None:
            return
        connected_users.append(data.name)
        emitConnectedUsers()

    @socketio.on('leave')
    def disconnect(data):
        data = UserRequest.model_validate(data)
        playerData = bdd.players.get(data.name)
        if playerData is None:
            return
        connected_users.remove(data.name)
        emitConnectedUsers()

    socketio.on("update_team")
    def update_team(data):
        data = TeamRequest.model_validate(data)
        playerData = bdd.players.get(data.name)
        if playerData is None:
            return

        bdd.players[data.name] = data.team

        bdd.savePlayers()
        emitConnectedUsers()
