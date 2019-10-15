import os
from io import BytesIO
from flask import Flask, render_template, send_file, request, url_for, json, Response
from process_arrays import array_to_image

os.environ["FLASK_DEBUG"] = "1"


app = Flask(__name__)


@app.route("/")
def hello():
    return render_template("index.html")


@app.route("/image", methods=["POST"])
def image():
    with BytesIO() as output:
        matrix = request.get_json()
        array_to_image(matrix, output)
        output.seek(0)
        return send_file(
            output, attachment_filename="tooltip.png", mimetype="image/png"
        )


@app.route("/network/<json_file>", methods=["GET"])
def network(json_file):
    SITE_ROOT = os.path.realpath(os.path.dirname(__file__))
    json_url = os.path.join(SITE_ROOT, "logs/history", json_file)
    data = json.load(open(json_url))
    return Response(json.dumps(data))


@app.route("/game_data/<json_file>", methods=["GET"])
def game_data(json_file):
    SITE_ROOT = os.path.realpath(os.path.dirname(__file__))
    json_url = os.path.join(SITE_ROOT, "game_data", json_file)
    data = json.load(open(json_url))
    return Response(json.dumps(data))


@app.route("/data/<json_file>", methods=["GET"])
def data(json_file):
    SITE_ROOT = os.path.realpath(os.path.dirname(__file__))
    json_url = os.path.join(SITE_ROOT, "", json_file)
    data = json.load(open(json_url))
    return Response(json.dumps(data))

if __name__ == "__main__":
    app.run()
