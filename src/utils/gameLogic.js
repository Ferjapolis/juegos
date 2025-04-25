import { reactive } from 'vue';

// Valores y frecuencias según español
export const VALORES_LETRAS = { 
  A:1, B:3, C:3, D:2, E:1, F:4, G:2, H:4, I:1, J:8, 
  K:5, L:1, M:3, N:1, 'Ñ':8, O:1, P:3, Q:5, R:1, S:1, 
  T:1, U:1, V:4, W:10, X:8, Y:4, Z:10 
};

export const FRECUENCIA_LETRAS = { 
  A:12, B:2, C:4, D:5, E:12, F:1, G:2, H:2, I:6, J:1, 
  K:1, L:4, M:2, N:5, 'Ñ':1, O:9, P:2, Q:1, R:5, S:6, 
  T:4, U:5, V:1, W:1, X:1, Y:1, Z:1 
};

// Estado global del juego
export const gameState = reactive({
  gameStarted: false,
  numPlayers: 1,
  playersInput: ['', '', '', ''],
  players: [],
  round: 1,
  deck: [],
  lettersOnTable: [],
  currentPlayerIndex: 0,
  gameOver: false,
  
  get currentPlayer() { 
    return this.players[this.currentPlayerIndex] || { name: '' }; 
  },
  
  get minLetters() { 
    return Math.ceil(this.lettersOnTable.length / 2); 
  },
  
  get playersSorted() { 
    return [...this.players].sort((a,b) => b.score - a.score); 
  },
  
  get winner() { 
    return this.playersSorted[0] || { name: '', score: 0 }; 
  }
});

// Métodos del juego
export const initGame = () => {
  if (gameState.numPlayers < 1 || gameState.numPlayers > 4) return;
  
  gameState.players = [];
  for (let i = 0; i < gameState.numPlayers; i++) {
    const name = gameState.playersInput[i] || `Jugador ${i+1}`;
    gameState.players.push({ name, score: 0 });
  }
  
  gameState.deck = createDeck();
  gameState.lettersOnTable = [];
  for (let i = 0; i < 6; i++) {
    gameState.lettersOnTable.push(gameState.deck.pop());
  }
  
  gameState.gameStarted = true;
};

export const createDeck = () => {
  let deck = [];
  for (const l in FRECUENCIA_LETRAS) {
    for (let i = 0; i < FRECUENCIA_LETRAS[l]; i++) {
      deck.push(l);
    }
  }
  return shuffle(deck);
};

export const shuffle = (arr) => {
  let a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

export const calcScore = (word) => {
  return [...word].reduce((sum, l) => sum + (VALORES_LETRAS[l] || 0), 0);
};

// Reponer letras después de usar una palabra
export const replenishLetters = (count) => {
  // Solo reponer la misma cantidad de letras que se usaron
  for (let i = 0; i < count; i++) {
    if (gameState.deck.length) {
      gameState.lettersOnTable.push(gameState.deck.pop());
    }
  }
};

// Función para añadir letras extra al cambiar de ronda
export const addRoundLetters = () => {
  // Añadir 2 letras adicionales al pasar de ronda
  for (let i = 0; i < 2; i++) {
    if (gameState.deck.length) {
      gameState.lettersOnTable.push(gameState.deck.pop());
    }
  }
};

export const nextTurn = () => {
  if (gameState.currentPlayerIndex < gameState.players.length - 1) {
    // Si solo cambiamos de jugador en la misma ronda, no añadimos letras extra
    gameState.currentPlayerIndex++;
  } else {
    // Si cambiamos de ronda
    if (gameState.round < 4) {
      gameState.round++;
      // Añadir letras extra al cambiar de ronda
      addRoundLetters();
      // Reiniciar al primer jugador
      gameState.currentPlayerIndex = 0;
    } else {
      // Fin del juego
      gameState.gameOver = true;
    }
  }
};

export const skipTurn = () => {
  nextTurn();
};

export const resetGame = () => {
  gameState.gameStarted = false;
  gameState.round = 1;
  gameState.deck = [];
  gameState.lettersOnTable = [];
  gameState.currentPlayerIndex = 0;
  gameState.gameOver = false;
  gameState.players = [];
};