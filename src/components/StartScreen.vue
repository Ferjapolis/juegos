<template>
    <div v-if="!gameState.gameStarted" class="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
      <h2 class="text-2xl font-bold mb-4">Bienvenido al Juego de Palabras</h2>
      
      <div class="mb-6">
        <h3 class="text-lg font-semibold mb-2">Reglas:</h3>
        <ul class="list-disc pl-6 space-y-1">
          <li>Se jugarán 4 rondas.</li>
          <li>Cada ronda aumenta el número de letras disponibles.</li>
          <li>Debes formar palabras con al menos la mitad de las letras disponibles.</li>
          <li>Cada letra tiene un valor que suma a tu puntaje total.</li>
        </ul>
      </div>
      
      <div class="mb-6">
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Número de jugadores (1-4)
        </label>
        <input 
          v-model.number="gameState.numPlayers" 
          type="number" 
          min="1" 
          max="4"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <div class="space-y-4 mb-6">
        <div v-for="i in gameState.numPlayers" :key="i" class="mb-2">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Nombre del jugador {{ i }}
          </label>
          <input 
            v-model="gameState.playersInput[i-1]" 
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      
      <div class="flex justify-end">
        <button 
          @click="initGame" 
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Iniciar Juego
        </button>
      </div>
    </div>
  </template>
  
  <script>
  import { gameState, initGame } from '../utils/gameLogic';
  
  export default {
    name: 'StartScreen',
    setup() {
      return {
        gameState,
        initGame
      };
    }
  };
  </script>