from flask import Flask, render_template
import numpy as np

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('canvas.html', title='flask test')

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000)