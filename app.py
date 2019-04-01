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

    A = np.array(
        [
            [-780/(20 ** 2 - 780 ** 2), -780/(20 ** 2 - 780 ** 2)],
            [-20/(- 20 ** 2 + 780 ** 2),-20/(- 20 ** 2 + 780 ** 2)]
        ]
    )

    #print(res)
    res_list = res.tolist()
    after_parse = {'x':[], 'y':[]}
    for i in range(len(x.tolist())):
        arr_xy = np.reshape(np.array([x.tolist()[i], y.tolist()[i]]), (1, 2))
        print(arr_xy)
        print()
        print(np.multiply(arr_xy, A))
        print()
        after_parse['x'].append(np.multiply(arr_xy, A)[0])
        after_parse['y'].append(np.multiply(arr_xy, A)[1])
    
    #after_parse = np.array([after_parse])
    #after_parse = np.multiply(np.array([points['x'], points['y']]), A).tolist()
    #print(after_parse['x'], after_parse['y'])

    fuc = ''
    for i in range(len(res_list)):
        fuc = fuc + '+' + str(res_list[i]) + '*(A4^' + str(len(res_list) - i - 1) + ')'

    print(fuc)
    
    return jsonify(raw_data=points, result={'x':x.tolist(), 'y':y.tolist()})

if __name__ == '__main__':
    app.run(host='0.0.0.0')
