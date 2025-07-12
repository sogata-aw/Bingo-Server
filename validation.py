from flask_socketio import SocketIO, emit

from utilitaire import load_data


def send(socketio : SocketIO, team : str, challenge : int):
    requests_data = load_data('requests.json')
    requests_data.append({"team" : team, "challenge" : challenge})
