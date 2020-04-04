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

    kansu = 20

    res = np.polyfit(points['x'], points['y'], kansu)

    x = np.linspace(points['x'][0],points['x'][len(points['x']) - 1],100)
    y = np.poly1d(res)(x)

    res_list = res.tolist()
    after_parse = {'x':[], 'y':[]}
    for i in range(len(x.tolist())):
        _x = -(x.tolist()[i] - 20)/760.0 + 1.0
        _y = (y.tolist()[i] - 20)/760.0
        after_parse['x'].append(_x)
        after_parse['y'].append(_y)
    
    res_after = np.polyfit(after_parse['x'], after_parse['y'], kansu)
    # print(after_parse)
    # print(res)
    # print(res_after)
    res_after_list = res_after.tolist()

    fuc = ''
    for i in range(len(res_after_list)):
        fuc = fuc + '+' + str(res_after_list[i]) + '*(A4^' + str(len(res_after_list) - i - 1) + ')'

    print()
    print(fuc)
    print()
    
    return jsonify(raw_data=points, result={'x':x.tolist(), 'y':y.tolist()})

if __name__ == '__main__':
    app.run(host='0.0.0.0')
