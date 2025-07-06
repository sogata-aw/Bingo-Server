from flask import render_template, Flask, request

from utilitaire import *

def init_routes(app: Flask):
    @app.route('/login/<name>')
    def login(name: str):
        player_data = load_players_data()
        if not in_players_data(name):
            return "INVALID"
        elif name == "Soga":
            return "PASSWORD"
        else:
            return "OK"

    @app.route('/login/create/<name>')
    def create(name: str):
        player_data = load_players_data()
        player_data.append({"name":name, "team" : ""})
        save_players_data(player_data)
        return "OK"

    @app.route('/checkpasswd', methods=['POST'])
    def checkpasswd():
        passwd = request.get_json().get("password")
        if passwd == "bingo!":
            return "OK"
        return "INVALID"