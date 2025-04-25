<template>
    <div v-if="gameState.gameOver" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
        <h2 class="text-2xl font-bold text-center mb-4">¡Juego Terminado!</h2>
        
        <div class="text-center mb-6">
          <div class="text-lg mb-2">Ganador:</div>
          <div class="text-2xl font-bold text-blue-600">{{ gameState.winner.name }}</div>
          <div class="text-xl mt-1">con {{ gameState.winner.score }} puntos</div>
        </div>
        
        <div class="mb-6">
          <h3 class="text-lg font-medium mb-2">Clasificación final:</h3>
          <ul class="space-y-2">
            <li v-for="(player, index) in gameState.playersSorted" :key="player.name" 
                class="flex justify-between items-center p-2 rounded-md"
                :class="{'bg-amber-100': index === 0, 'bg-gray-100': index !== 0}">
              <span>{{ index + 1 }}. {{ player.name }}</span>
              <span class="font-semibold">{{ player.score }} pts</span>
            </li>
          </ul>
        </div>
        
        <div class="flex justify-center">
          <button
            @click="resetGame"
            class="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Jugar de nuevo
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { gameState, resetGame } from '../utils/gameLogic';
  
  export default {
    name: 'GameOver',
    setup() {
      return {
        gameState,
        resetGame
      };
    }
  };
  </script>