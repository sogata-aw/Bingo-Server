from flask import request
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

class CheckChallenge(BaseModel):
    index: int
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

        bdd.saveBingo()

        emit("update_bingo", bdd.serializeBingo(), broadcast=True)

    @socketio.on("reload_players")
    def reloadPlayers(_):
        bdd.reloadPlayers()
        print("Players reloaded")

    @socketio.on("reload_bingo")
    def reloadBingo(_):
        bdd.reloadBingo()
        print("Bingo reloaded")

    @socketio.on('join')
    def connect(data):
        data = UserRequest.model_validate(data)
        if not data.name in bdd.players.keys():
            return

        if not data.name in connected_users:
            connected_users.append(data.name)
        emitConnectedUsers()
        emit("update_bingo", bdd.serializeBingo())

    @socketio.on('leave')
    def disconnect(data):
        data = UserRequest.model_validate(data)
        print(data)
        playerData = bdd.players.get(data.name)
        if playerData is None:
            return
        connected_users.remove(data.name)
        emitConnectedUsers()

    @socketio.on("update_team")
    def update_team(data):
        data = TeamRequest.model_validate(data)
        playerData = bdd.players.get(data.name)
        if playerData is None:
            return

        bdd.players[data.name] = data.team

        bdd.savePlayers()
        emitConnectedUsers()

    @socketio.on('add_request')
    def add_requests(data):
        data = ClickRequest.model_validate(data)

        team = bdd.players.get(data.name)
        if not team:
            return

        if not bdd.findRequest(data.index, team):
            bdd.challengesRequests.append(bdd.ChallengeRequest(index=data.index, team=team))
            emit("update_requests", bdd.serializeChallengeRequests(), broadcast=True)

    @socketio.on('check_challenge')
    def check_challengeee(data):
        data = CheckChallenge.model_validate(data)
        bdd.bingo[data.index].checkedBy = data.team

        bdd.saveBingo()

        bdd.removeRequest(data.index, data.team)
        emit('update_requests', bdd.serializeChallengeRequests(), broadcast=True)
        emit("update_bingo", bdd.serializeBingo(), broadcast=True)
        emit("notification", {"index" : data.index, "team" : data.team} ,broadcast=True)

    @socketio.on('refuse_challenge')
    def check_challenge(data):
        data = CheckChallenge.model_validate(data)
        bdd.removeRequest(data.index, data.team)
        emit('update_requests', bdd.serializeChallengeRequests(), broadcast=True)