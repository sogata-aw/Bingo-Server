from flask import Flask, render_template, request, json
from flask_socketio import SocketIO, emit

from utilitaire import *
from routes import bingo, debug
from sockets import connection, bingoSockets

app = Flask(__name__)
socketio = SocketIO(app)
disconnect_timers = {}

json_data = load_data()

connection.init_sockets(socketio, json_data)
bingoSockets.init_sockets(socketio, json_data)
bingo.init_routes(app, json_data)
debug.init_routes(app, json_data)

if __name__ == '__main__':
    app.run()