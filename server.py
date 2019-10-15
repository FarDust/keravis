import os
from io import BytesIO
from flask import Flask, render_template, send_file, request
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


if __name__ == "__main__":
    app.run()
