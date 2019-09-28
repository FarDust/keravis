import flask
import json
app = flask.Flask(__name__)


@app.route("/")
def index():
    return json.dumps('API Iniciada')


if __name__ == "__main__":
    app.run()
