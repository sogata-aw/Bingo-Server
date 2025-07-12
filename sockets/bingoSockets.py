from flask import Flask, render_template, request, json
from flask_socketio import SocketIO, emit

from utilitaire import *

from validation import send

def init_sockets(socketio):

    socketio.on("case_click")
    def update_case(data):
        bingo_data = load_data("bingo.json")

        for case in bingo_data:
            if data.get("name") in case["challengers"]:
                case["challengers"].remove(data["name"])
            else:
                case["challengers"].append(data["name"])

        # send(socketio, data["team"], data["challenge"])

        save_data("bingo.json", bingo_data)
        socketio.emit("update_bingo", data, broadcast=True)
