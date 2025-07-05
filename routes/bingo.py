from flask import render_template, Flask, send_file, send_from_directory

def init_routes(app: Flask):
    #
    # @app.route('/bingo.html')
    # def _():
    #     return render_template('bingo.html', bingo=json_data["bingo"])

    @app.route('/<path:filename>')
    def _(filename: str):
        if not filename:
            return send_file('static/index.html')
        return send_from_directory("static", filename)

    # @app.route('/passwd')
    # def get_passwd():
    #     return "bingo!"
    #
    # @app.route('/playerexist/<name>')
    # def playerexist(name):
    #     team = None
    #     for player in json_data["players"]:
    #         if player["name"] == name:
    #             team = player["team"]
    #     if not team:
    #         return ""
    #
    #     return team