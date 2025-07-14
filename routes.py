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
        if not bdd.players.get(name):
            return "INVALID"
        return 'OK'

    @app.route('/admin')
    def admin():
        if not request.authorization :
            abort(401)
        elif request.authorization.username == "Soga" and request.authorization.password == "bingo!":
            return render_template('admin.html')
        else:
            abort(403)
