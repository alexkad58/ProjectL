const { GRID_SIZE } = require('./constants');

module.exports = {
  initGame,
  gameLoop,
}

function initGame() {
  const state = createGameState()
  return state;
}

function createGameState() {
  return {
    players: [{
      isDrawing: false,
      bodyPart: 'голова'
    }, {
      isDrawing: false,
      bodyPart: 'торс'
    },{
      isDrawing: false,
      bodyPart: 'ноги'
    }],
    turn: 1
  };
}

function gameLoop(state) {
  if (!state) {
    return;
  }

  return false;
}
