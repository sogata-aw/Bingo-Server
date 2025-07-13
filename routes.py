from flask import render_template, Flask, send_file, send_from_directory, Response, abort, request

import bdd


def init_routes(app: Flask):

    @app.route('/')
    @app.route('/www/<path:filename>')
    def www(filename: str = ""):
        print("filename: ", filename)
        if not filename:
            return send_file('static/index.html')
        return send_from_directory("static", filename)

    @app.route('/bingo.html')
    def bingo():
        return render_template('bingo.html', bingo=bdd.bingo)

    @app.route('/requests.html')
    def reqq():
        return render_template('requests.html', requests=bdd.challengesRequests, bingo=bdd.bingo)

    @app.errorhandler(401)
    def custom_401(_):
        return Response('Accès au compte principal', 401, {'WWW-Authenticate': 'Basic realm="Mot de passe requis"'})

    @app.route('/login/<name>')
    def login(name: str):
        if not request.authorization :
            if not bdd.players.get(name):
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
        bdd.players[name] = ""
        bdd.savePlayers()
        return "OK"
