from flask import Flask, render_template, request, json
from flask_socketio import SocketIO, emit

from utilitaire import *

def init_sockets(socketio, json_data):

    @socketio.on('join')
    def handle_join(data):
        if not in_logged_users(json_data, data.get("name")):
            json_data["bingo"]["loggedUsers"].append(
                {"sid": request.sid, "name": data.get("name"), "team": get_team(json_data, data.get("name"))})
            save_data(json_data)
        emit("update_users", json_data["bingo"]["loggedUsers"], broadcast=True)

    @socketio.on('logout')
    def handle_logout(data):
        if in_logged_users(json_data, data.get("name")):
            user_to_remove = None
            for user in json_data["bingo"]["loggedUsers"]:
                if user["name"] == data.get("name"):
                    user_to_remove = user
            if user_to_remove:
                json_data["bingo"]["loggedUsers"].remove(user_to_remove)
        save_data(json_data)
        emit("update_users", json_data["bingo"]["loggedUsers"], broadcast=True)

    @socketio.on('add_player')
    def handle_update(data):
        json_data["players"].append({"name": data.get("name"), "team": data.get("team")})
        save_data(json_data)

    @socketio.on('update_user')
    def handle_update(data):
        for user in json_data["players"]:
            if user["name"] == data.get("name"):
                user["team"] = data.get("team")

        for user in json_data["bingo"]["loggedUsers"]:
            if user["name"] == data.get("name"):
                user["team"] = data.get("team")
        save_data(json_data)
        emit("update_users", json_data["bingo"]["loggedUsers"], broadcast=True)
