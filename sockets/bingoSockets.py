from flask import Flask, render_template, request, json
from flask_socketio import SocketIO, emit

from utilitaire import *

def init_sockets(socketio):

    socketio.on("update_case")
    def update_case(data):
        bingo_data = load_bingo_data()

        save_bingo_data(bingo_data)
        socketio.emit("update_bingo", data, broadcast=True)
