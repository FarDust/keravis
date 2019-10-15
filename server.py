import os
from io import BytesIO
os.environ["FLASK_DEBUG"] = "1"
from flask import Flask, render_template, send_file, request, send_from_directory, make_response, url_for, json, Response
from process_arrays import array_to_image
import numpy as np



app = Flask(__name__)

@app.after_request
def add_header(r):
    """
    Add headers to both force latest IE rendering engine or Chrome Frame,
    and also to cache the rendered page for 10 minutes.
    """
    r.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    r.headers["Pragma"] = "no-cache"
    r.headers["Expires"] = "0"
    r.headers['Cache-Control'] = 'public, max-age=0'
    return r

@app.route("/")
def hello():
    return render_template("index.html")


@app.route("/assets/<path:path>")
def send_assets(path):
    return send_from_directory("assets", path)


@app.route("/logs/<path:path>")
def send_logs(path):
    return send_from_directory("logs", path)


@app.route("/img/<path:path>")
def send_img(path):
    return send_from_directory("img", path)


@app.route("/image", methods=["POST"])
def image():
    output = BytesIO()
    matrix = request.get_json()
    matrix = np.array(matrix).reshape(len(matrix[0]), -1)
    array_to_image(matrix, output)
    output.seek(0)
    response = make_response(output.read())
    response.headers.set('Content-Type', 'image/png')
    response.headers.set(
        'Content-Disposition', 'attachment', filename='tooltip.png')
    return response


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
