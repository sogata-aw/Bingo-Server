from flask import Flask
from flask_socketio import SocketIO, emit

from routes import bingo, debug, connectionRoute
from sockets import connectionSockets, bingoSockets

app = Flask(__name__)
socketio = SocketIO(app)

# connection.init_sockets(socketio, json_data)
# bingoSockets.init_sockets(socketio, json_data)
bingo.init_routes(app)
connectionRoute.init_routes(app)
# debug.init_routes(app, json_data)

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5000, allow_unsafe_werkzeug=True)