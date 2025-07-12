import json

from flask import render_template, Flask, send_file, send_from_directory

from utilitaire import load_data


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
        return render_template('bingo.html', bingo=load_data("bingo.json"))

    @app.route('/requests.html')
    def request():
        return render_template('requests.html')
