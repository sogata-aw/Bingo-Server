from flask import Flask, render_template, request, json
from flask_socketio import SocketIO, emit

from utilitaire import *

connected_users : list[dict] = []

def init_sockets(socketio):

    @socketio.on('join')
    def connect(data):
        connected_users.append(get_player_data(data['name']))
        emit('update_connected_users', connected_users, broadcast=True)

    @socketio.on('leave')
    def disconnect(data):
        connected_users.remove(get_player_data(data['name']))
        emit('update_connected_users', connected_users, broadcast=True)

    socketio.on("update_team")
    def update_team(data):
        players_data = load_data("players.json")
        for player in players_data:
            if player['name'] == data['name']:
                player['team'] = data['team']

        for connected_user in connected_users:
            if connected_user['name'] == data['name']:
                connected_user['team'] = data['team']

        save_data("players.json", players_data)
        socketio.emit('update_connected_users', connected_users, broadcast=True)
