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

class ChallengeRequest(BaseModel):
    index: int
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

    @socketio.on('join')
    def connect(data):
        data = UserRequest.model_validate(data)
        playerData = bdd.players.get(data.name)
        if playerData is None:
            return
        connected_users.append(data.name)
        emitConnectedUsers()
        emit("update_bingo", bdd.bingo, to=request.sid)

    @socketio.on('leave')
    def disconnect(data):
        data = UserRequest.model_validate(data)
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
        data = ChallengeRequest.model_validate(data)
        if not bdd.findRequest(data.index, data.team):
            bdd.challengesRequests.append(bdd.ChallengeRequest(index=data.index, team=data.team))
            emit("update_requests", bdd.serializeChallengeRequests(), broadcast=True)

    @socketio.on('check_challenge')
    def check_challenge(data):
        data = CheckChallenge.model_validate(data)
        bdd.bingo[data.index].checkedBy = data.team

        bdd.saveBingo()

        bdd.removeRequest(data.index, data.team)
        emit('update_requests', bdd.serializeChallengeRequests(), broadcast=True)

    @socketio.on('refuse_challenge')
    def check_challenge(data):
        data = CheckChallenge.model_validate(data)
        bdd.removeRequest(data.index, data.team)
        emit('update_requests', bdd.serializeChallengeRequests(), broadcast=True)