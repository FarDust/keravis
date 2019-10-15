import os
from io import BytesIO
from flask import Flask, render_template, send_file, request, send_from_directory, make_response
from process_arrays import array_to_image
import numpy as np

os.environ["FLASK_DEBUG"] = "1"


app = Flask(__name__)


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


if __name__ == "__main__":
    app.run()
