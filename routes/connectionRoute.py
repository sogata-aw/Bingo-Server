from flask import render_template, Flask, request, abort, Response

from utilitaire import *

def init_routes(app: Flask):
    @app.errorhandler(401)
    def custom_401(error):
        return Response('Accès au compte principal', 401,
                        {'WWW-Authenticate': 'Basic realm="Mot de passe requis"'})

    @app.route('/login/<name>')
    def login(name: str):
        if not request.authorization :
            player_data = load_players_data()
            if not in_players_data(name):
                return "INVALID"
            elif name == "Soga":
                abort(401)
            else:
                return "OK"
        else:
            if request.authorization.username == "Soga" and request.authorization.password == "bingo!":
                return "OK"
            abort(401)

    @app.route('/login/create/<name>')
    def create(name: str):
        player_data = load_players_data()
        player_data.append({"name":name, "team" : ""})
        save_players_data(player_data)
        return "OK"