from flask import render_template

def init_routes(app, json_data):
    @app.route('/test')
    def test():
        return render_template('test.html')

    @app.route('/debug')
    def debug():
        return json_data