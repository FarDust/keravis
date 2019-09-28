from flask import Flask, render_template
import json
app = Flask(__name__)


@app.route('/')
def hello():
    return json.dumps('API Iniciada')


@app.route('/index', methods=['GET'])
def index():
    return render_template('index.html')


if __name__ == "__main__":
    app.run()
