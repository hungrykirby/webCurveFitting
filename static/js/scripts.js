window.onload = function() {
  const c = 0;
  draw_rect();
  draw_canvas(c);
}

function draw_rect() {
  const x_rect = 20;
  const y_rect = 20;
  var canvas = document.getElementById('grapharea');
  if ( ! canvas || ! canvas.getContext ) { return false; }
  const w_canvas = canvas.width;
  const h_canvas = canvas.height;
  var ctx = canvas.getContext('2d');
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.strokeRect(x_rect, y_rect, w_canvas - x_rect*2, h_canvas - y_rect*2);
}

function draw_canvas(c){
  if(c === 0){
    c++;
  }else{
    return false;
  }
  var canvas = document.getElementById('grapharea');
  var ctx = canvas.getContext('2d');
  //ctx.beginPath();
  //ctx.fillStyle = "#f5f5f5";
  //ctx.fillRect(0, 0, 700, 400);

  let mouseX = "";
  let mouseY = "";
  //初期値（サイズ、色、アルファ値）の決定
  var defosize = 7;
  var defocolor = "#555555";
  var defoalpha = 1.0;

  const w_canvas = canvas.width;
  const h_canvas = canvas.height;
  const x_rect = 20;
  const y_rect = 20;

  let mouse_arr = {
    'x':[], 'y':[],
  }
  let results_arr = {
    'x':[], 'y':[]
  }
  let = approximate_curve = {'x':[], 'y':[]}

  canvas.addEventListener('mousemove', onMove, false);
  canvas.addEventListener('mousedown', onClick, false);
  canvas.addEventListener('mouseup', drawEnd, false);
  canvas.addEventListener('mouseout', function(){
    _mouse_arr = drawEnd();
    console.log('End', _mouse_arr);
    axios.post('/mousePoints', _mouse_arr)
      .then(response => {
        const x_and_y = response.data.result_set
        ctx.clearRect(0, 0, w_canvas, h_canvas);
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.strokeRect(x_rect, y_rect, w_canvas - x_rect*2, h_canvas - y_rect*2);
        drawRawLine(x_and_y['x'], x_and_y['y'])
      })
      .catch(error => {
        console.log(error);
      })
  }, false);


  //マウス動いていて、かつ左クリック時に発火。
    function onMove(e) {
      if (e.buttons === 1 || e.witch === 1) {
        var rect = e.target.getBoundingClientRect();
        var X = ~~(e.clientX - rect.left + 20);
        var Y = ~~(e.clientY - rect.top);
        //draw 関数にマウスの位置を渡す
        draw(X, Y);
      };
    };

    //マウスが左クリックされると発火。
    function onClick(e) {
      if (e.button === 0) {
        var rect = e.target.getBoundingClientRect();
        var X = ~~(e.clientX - rect.left);
        var Y = ~~(e.clientY - rect.top);
        //draw 関数にマウスの位置を渡す
        draw(X, Y);
        }
    };

    //渡されたマウス位置を元に直線を描く関数
    function draw(X, Y) {
        ctx.beginPath();
        ctx.globalAlpha = defoalpha;
        //マウス継続値によって場合分け、直線の moveTo（スタート地点）を決定
        if (mouseX === "") {
            //継続値が初期値の場合は、現在のマウス位置をスタート位置とする
            ctx.moveTo(X, Y);
        } else {
            //継続値が初期値ではない場合は、前回のゴール位置を次のスタート位置とする
            ctx.moveTo(mouseX, mouseY);
        }
        //lineTo（ゴール地点）の決定、現在のマウス位置をゴール地点とする
        ctx.lineTo(X, Y);
        //直線の角を「丸」、サイズと色を決める
        ctx.lineCap = "round";
        ctx.lineWidth = defosize * 2;
        ctx.strokeStyle = defocolor;
        ctx.stroke();
        //マウス継続値に現在のマウス位置、つまりゴール位置を代入
        mouseX = X;
        mouseY = Y;

        mouse_arr['x'].push(X);
        mouse_arr['y'].push(Y);
    };

    //左クリック終了、またはマウスが領域から外れた際、継続値を初期値に戻す
    function drawEnd() {
        mouseX = "";
        mouseY = "";

        return mouse_arr;
    }

    //x座標とy座標の配列を受け取り、その線を描画する
    function drawRawLine(X, Y){
      console.log(X.length);
      for(var i = 0; i < X.length - 1; i++){
        ctx.beginPath();
        if(typeof X[i] === "undefined") break;
        ctx.moveTo(X[i], Y[i]);
        ctx.lineTo(X[i], Y[i]);
        ctx.lineCap = "round";
        ctx.lineWidth = defosize * 2;
        ctx.strokeStyle = defocolor;
        ctx.stroke();
        //console.log(X[i], Y[i]);
      }
    }

}
