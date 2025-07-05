from flask import Flask, render_template, request, json
from flask_socketio import SocketIO, emit

from utilitaire import *

def init_sockets(socketio, json_data):

    @socketio.on('get_bingo')
    def get_bingos(data):
        emit('update_bingo', json_data['bingo']["state"], to=request.sid)

    @socketio.on('update_bingo')
    def update_bingo(data):
        json_data['bingo']["state"] = data['bingo']
        save_data(json_data)
        emit('update_bingo', json_data["bingo"]["state"], broadcast=True)

    @socketio.on('case_click')
    def case_click(data):
        if json_data['bingo']["state"][data["case"]]["state"] == "" and get_team(json_data, data["name"]) != "":
            json_data['bingo']["state"][data["case"]]["state"] = get_team(json_data, data["name"])
            save_data(json_data)
            emit('update_bingo', json_data["bingo"]["state"], broadcast=True)