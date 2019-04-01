from flask import Flask, render_template, request, jsonify
import numpy as np
import json

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('canvas.html', title='flask test')

@app.route('/mousePoints', methods=['POST'])
def mouse_point():
    data = json.loads(request.data)
    points = data['points']
    params = data['params']

    res=np.polyfit(points['x'], points['y'], 2)

    x= np.linspace(points['x'][0],points['x'][len(points['x']) - 1],100)

    y = np.poly1d(res)(x)

    #print(res)
    res_list = res.tolist()

    fuc = ''
    for i in range(len(res_list)):
        fuc = fuc + '+' + str(res_list[i]) + '*(A4^' + str(len(res_list) - i - 1) + ')'

    print(fuc)
    
    return jsonify(raw_data=points, result={'x':x.tolist(), 'y':y.tolist()})

if __name__ == '__main__':
    app.run(host='0.0.0.0')
