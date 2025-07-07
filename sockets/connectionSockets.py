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
