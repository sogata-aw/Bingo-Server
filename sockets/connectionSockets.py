from flask import Flask, render_template, request, json
from flask_socketio import SocketIO, emit

from utilitaire import *

connected_users : list[dict[str, str]] = []

def init_sockets(socketio):

    @socketio.on('connect')
    def connect():
        socketio.emit("")
