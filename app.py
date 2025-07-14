from flask import Flask
from flask_socketio import SocketIO

import routes, sockets, bdd


app = Flask(__name__)
socketio = SocketIO(app)

bdd.reloadPlayers()
bdd.reloadBingo()
sockets.init_sockets(socketio)
routes.init_routes(app)

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5000)