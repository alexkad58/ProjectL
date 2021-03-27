const path = require('path')
const http = require('http')
const express = require('express')
const app = express()
const server = http.createServer(app)
const io = require('socket.io')(server)
const { EventEmitter } = require("events");

const GameOverEmitter = new EventEmitter();

app.use(express.static(path.join(__dirname, '../frontend')))

const { shuffleArray } = require('./utils')
const { initGame, gameLoop } = require('./game');
const { FRAME_RATE } = require('./constants');

const images = {};
const state = {};
const clientRooms = {};
const queue = {};

io.on('connection', ioClient => {
  ioClient.on('newGame', handleNewGame);
  ioClient.on('joinGame', handleJoinGame);
  ioClient.on('done', handleDone);

  function handleJoinGame(roomName) {
    const roomSet = io.sockets.adapter.rooms.get(roomName)
    let allUsers;
    if (roomSet) {
      allUsers = Object.assign({}, ...Array.from(roomSet, value => ({ [value]: 'not assigned' })));
    }

    let numClients = 0;
    if (allUsers) {
      numClients = Object.keys(allUsers).length;
    }

    if (numClients === 0) {
      ioClient.emit('unknownCode');
      return;
    } else if (numClients > 2) {
      ioClient.emit('tooManyPlayers');
      return;
    } 
    
    clientRooms[ioClient.id] = roomName;

    ioClient.join(roomName);
    ioClient.number = numClients + 1;
    numClients = numClients + 1

    if (numClients === 3) {
      
      queue[roomName] = getRandomQueue(Object.assign({}, ...Array.from(io.sockets.adapter.rooms.get(roomName), value => ({ [value]: 'not assigned' }))))
      state[roomName] = initGame()
      io.to(roomName).emit('init', roomName, queue, state[roomName]);
      
      
      startGameInterval(roomName);

    }
    
  }

  function handleNewGame(roomName) {
    clientRooms[ioClient.id] = roomName;
    ioClient.emit('gameCode', roomName);
    ioClient.join(roomName);
    numClients = 1
    ioClient.number = 1;
  }

  function handleDone(id, image) {
    
    roomName = clientRooms[id]
    
    queuePos = queue[roomName].indexOf(id)
    if (images[roomName]) { images[roomName].push(image) } else {
      images[roomName] = []
      images[roomName][0] = image
    }
    
    
    state[roomName].players[queuePos].isDrawing = false
    if (state[roomName].players[queuePos + 1]) {
      state[roomName].players[queuePos + 1].isDrawing = true
      emitGameState(roomName, state[roomName])
    } else {
      emitGameOver(roomName, images)
    }
       
  }
});

function startGameInterval(roomName) {
  state[roomName].players[0].isDrawing = true
  
    const winner = gameLoop(state[roomName]);
    
    if (!winner) {
      emitGameState(roomName, state[roomName])
    } else {
      emitGameOver(roomName, winner);
      state[roomName] = null;
      
    }

}

function emitGameState(room, gameState) {
  // Send this event to everyone in the room.
  io.sockets.in(room)
    .emit('gameState', JSON.stringify(gameState));
}

function emitGameOver(room, images) {
  io.sockets.in(room)
    .emit('gameOver');
  GameOverEmitter.emit('gayOver', images)
  console.log('over')
}

function getRandomQueue(allUsers) {
  return shuffleArray(Object.keys(allUsers))
}

server.listen(3000);

module.exports = {
  GameOverEmitter
}