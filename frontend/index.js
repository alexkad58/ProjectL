const BG_COLOUR = 'white';

const socket = io('ws://localhost:3000');

socket.on('init', handleInit);
socket.on('gameState', handleGameState);
socket.on('gameOver', handleGameOver);
socket.on('gameCode', handleGameCode);
socket.on('unknownCode', handleUnknownCode);
socket.on('tooManyPlayers', handleTooManyPlayers);

const gameScreen = document.getElementById('gameScreen');
const initialScreen = document.getElementById('initialScreen');
const bodyPartDisplay = document.getElementById('bodyPartDisplay');
const doneButton = document.getElementById('doneButton')
const canvas = document.getElementById('canvas');
  ctx = canvas.getContext('2d');

let queuePos
let images = {}

var flag = false,
        prevX = 0,
        currX = 0,
        prevY = 0,
        currY = 0,
        dot_flag = false;

    var x = "black",
        y = 2;
    
    function initDraw() {
        w = canvas.width;
        h = canvas.height;
    
        canvas.addEventListener("mousemove", function (e) {
            findxy('move', e)
        }, false);
        canvas.addEventListener("mousedown", function (e) {
            findxy('down', e)
        }, false);
        canvas.addEventListener("mouseup", function (e) {
            findxy('up', e)
        }, false);
        canvas.addEventListener("mouseout", function (e) {
            findxy('out', e)
        }, false);
    }
    
    function color(obj) {
        switch (obj.id) {
            case "green":
                x = "green";
                break;
            case "blue":
                x = "blue";
                break;
            case "red":
                x = "red";
                break;
            case "yellow":
                x = "yellow";
                break;
            case "orange":
                x = "orange";
                break;
            case "black":
                x = "black";
                break;
            case "white":
                x = "white";
                break;
        }
        if (x == "white") y = 14;
        else y = 2;
    
    }
    
    function draw() {
        ctx.beginPath();
        ctx.moveTo(prevX, prevY);
        ctx.lineTo(currX, currY);
        ctx.strokeStyle = x;
        ctx.lineWidth = y;
        ctx.stroke();
        ctx.closePath();
    }
    
    function erase() {
        var m = confirm("Want to clear");
        if (m) {
            ctx.clearRect(0, 0, w, h);
            document.getElementById("canvasimg").style.display = "none";
        }
    }
    
    function save() {
        document.getElementById("canvasimg").style.border = "2px solid";
        var dataURL = canvas.toDataURL();
        document.getElementById("canvasimg").src = dataURL;
        document.getElementById("canvasimg").style.display = "inline";
    }
    
    function findxy(res, e) {
        if (res == 'down') {
            prevX = currX;
            prevY = currY;
            currX = e.clientX - canvas.offsetLeft;
            currY = e.clientY - canvas.offsetTop;
    
            flag = true;
            dot_flag = true;
            if (dot_flag) {
                ctx.beginPath();
                ctx.fillStyle = x;
                ctx.fillRect(currX, currY, 2, 2);
                ctx.closePath();
                dot_flag = false;
            }
        }
        if (res == 'up' || res == "out") {
            flag = false;
        }
        if (res == 'move') {
            if (flag) {
                prevX = currX;
                prevY = currY;
                currX = e.clientX - canvas.offsetLeft;
                currY = e.clientY - canvas.offsetTop;
                draw();
            }
        }
    }

function getParameterByName(name, url = window.location.href) {
  name = name.replace(/[\[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

let roomName = getParameterByName("roomName")
let ishost = getParameterByName("ishost")

function newGame(roomName) {
  socket.emit('newGame', roomName);
  init();
}

function joinGame(roomName) {
  socket.emit('joinGame', roomName);
  init();
}

if (roomName) {
  setTimeout(() => {
    if (ishost == 'true') { newGame(roomName) } else
    joinGame(roomName)
  }, 300);
  
}


let playerNumber;
let gameActive = false;

function init() {
  initialScreen.style.display = "none";
  gameScreen.style.display = "block";

  

  gameActive = true;
}

function paintGame(state) {

  if (state.players[queuePos].isDrawing) {
    canvas.style.display = 'block'
    canvas.width = canvas.height = 600;

    ctx.fillStyle = BG_COLOUR;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = BG_COLOUR;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    doneButton.style.display = 'block'
    doneButton.addEventListener('click', done);
    initDraw()
  } else {
    doneButton.style.display = 'none'
    canvas.style.display = 'none'
  }
}

function handleInit(roomName, queue, gameState) {
  queuePos = queue[roomName].indexOf(socket.id)
  bodyPart = gameState.players[queuePos].bodyPart
  bodyPartDisplay.innerText = `Ты рисуешь: ${bodyPart}`
}

function handleGameState(gameState) {
  if (!gameActive) {
    return;
  }
  gameState = JSON.parse(gameState);
  requestAnimationFrame(() => paintGame(gameState));
}

function handleGameOver(roomName, images) {
  console.log(images)
}

function handleGameCode(roomName) {
  
}

function done() {
  console.log(1)
  image = canvas.toDataURL()
  socket.emit('done', socket.id, image) 
}

function handleUnknownCode() {
  reset();
  alert('Неизвестный код!')
}

function handleTooManyPlayers() {
  reset();
  alert('Эта игра уже идет!');
}

function reset() {
  playerNumber = null;
  initialScreen.style.display = "block";
  gameScreen.style.display = "none";
}
