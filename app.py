from flask import Flask, render_template, request, jsonify
import numpy as np
import json

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('canvas.html', title='flask test')

@app.route('/mousePoints', methods=['POST'])
def mouse_point():
    points = json.loads(request.data)
    return jsonify(result_set=points)

if __name__ == '__main__':
    app.run(host='0.0.0.0')
