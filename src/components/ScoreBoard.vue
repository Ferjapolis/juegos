<template>
    <div v-if="gameState.gameStarted && gameState.players.length && !gameState.gameOver" class="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
      <h2 class="text-2xl font-bold mb-4">Marcador</h2>
      
      <div class="overflow-hidden rounded-lg border border-gray-200">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Jugador
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Puntos
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="player in gameState.players" :key="player.name" 
                :class="{'bg-blue-50': player.name === gameState.currentPlayer.name}">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">
                  {{ player.name }}
                  <span v-if="player.name === gameState.currentPlayer.name" class="ml-2 text-xs text-blue-600">
                    (Turno actual)
                  </span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-semibold text-gray-900">{{ player.score }}</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
  
  <script>
  import { gameState } from '../utils/gameLogic';
  
  export default {
    name: 'ScoreBoard',
    setup() {
      return {
        gameState
      };
    }
  };
  </script>