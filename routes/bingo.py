from flask import render_template

def init_routes(app, json_data):
    @app.route('/')
    def index():
        return render_template('index.html')

    @app.route('/bingo')
    def bingo():
        return render_template('bingo.html', bingo=json_data["bingo"])

    @app.route('/passwd')
    def get_passwd():
        return "bingo!"

    @app.route('/playerexist/<name>')
    def playerexist(name):
        team = None
        for player in json_data["players"]:
            if player["name"] == name:
                team = player["team"]
        if not team:
            return ""

        return team