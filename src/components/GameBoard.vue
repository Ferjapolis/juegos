<template>
    <div v-if="gameState.gameStarted && gameState.players.length && !gameState.gameOver" class="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto mb-6">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-2xl font-bold">Ronda {{ gameState.round }}</h2>
        <div class="text-lg font-medium text-blue-600">
          Turno de: {{ gameState.currentPlayer.name }}
        </div>
      </div>
      
      <!-- Letras disponibles - área fuente para drag and drop -->
      <div class="mb-6">
        <h3 class="text-lg font-medium mb-2">Letras disponibles:</h3>
        <div 
          class="flex flex-wrap gap-2 min-h-16 p-2 bg-amber-50 rounded-md border-2 border-dashed border-amber-200 drag-source"
          :class="{ 'bg-amber-100': isDragging }"
          @dragover.prevent
          @drop="dropInAvailable"
        >
          <div 
            v-for="(letter, index) in availableLetters" 
            :key="`available-${letter}-${index}`"
            class="letter-tile inline-flex items-center justify-center w-10 h-10 bg-amber-100 text-amber-800 font-bold rounded-md shadow cursor-grab"
            draggable="true"
            @dragstart="dragStart(letter, index, 'available')"
            @dragend="dragEnd"
            :data-points="VALORES_LETRAS[letter] || 0"
          >
            {{ letter }}
            <span class="absolute bottom-0 right-1 text-xs opacity-60">{{ VALORES_LETRAS[letter] }}</span>
          </div>
        </div>
      </div>
      
      <!-- Área para formar la palabra - destino del drag and drop -->
      <div class="mb-6">
        <h3 class="text-lg font-medium mb-2">Tu palabra:</h3>
        <div 
          class="flex flex-wrap gap-2 min-h-16 p-2 bg-blue-50 rounded-md border-2 border-dashed border-blue-200 drag-target"
          :class="{ 'dragover': isDraggingOver }"
          @dragover.prevent="dragOver"
          @dragleave="dragLeave"
          @drop="dropInWord"
        >
          <div 
            v-for="(letter, index) in currentWordArray" 
            :key="`word-${letter}-${index}`"
            class="word-letter inline-flex items-center justify-center w-10 h-10 bg-blue-100 text-blue-800 font-bold rounded-md shadow cursor-pointer"
            :class="{ 'word-letter-new': index === currentWordArray.length - 1 && justAddedLetter }"
            draggable="true"
            @dragstart="dragStart(letter, index, 'word')"
            @click="returnLetterToAvailable(index)"
          >
            {{ letter }}
            <span class="absolute bottom-0 right-1 text-xs opacity-60">{{ VALORES_LETRAS[letter] }}</span>
          </div>
        </div>
        
        <!-- Palabra actual -->
        <div v-if="currentWordArray.length > 0" class="mt-2 text-center text-lg font-medium">
          {{ currentWordArray.join('') }}
          <span v-if="calculatedScore > 0" class="ml-2 text-sm text-gray-600">({{ calculatedScore }} puntos)</span>
        </div>
      </div>
      
      <div class="mb-4">
        <div class="text-sm text-gray-600 mb-1">
          Mínimo de letras requeridas: {{ gameState.minLetters }}
        </div>
        <div class="flex justify-between mt-4">
          <button
            @click="clearCurrentWord"
            class="px-4 py-2 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            :disabled="currentWordArray.length === 0"
          >
            Limpiar
          </button>
          <div class="flex gap-2">
            <button
              @click="submitWord"
              class="px-4 py-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              :disabled="!isWordValid"
            >
              Enviar
            </button>
            <button
              @click="skipTurn"
              class="px-4 py-2 bg-gray-200 text-gray-800 font-medium rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Saltar
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, computed, reactive, onMounted, watch } from 'vue';
  import { 
    gameState, 
    skipTurn, 
    calcScore, 
    nextTurn, 
    replenishLetters,
    VALORES_LETRAS 
  } from '../utils/gameLogic';
  
  export default {
    name: 'GameBoard',
    setup() {
      // Estado de letras
      const letterState = reactive({
        // Letras disponibles para arrastrar
        availableLetters: [],
        // Letras que forman la palabra actual
        currentWordArray: [],
        // Info sobre la letra que está siendo arrastrada
        dragInfo: {
          letter: null,
          index: null,
          source: null // 'available' o 'word'
        },
        // Bandera que indica si estamos arrastrando
        isDragging: false,
        // Bandera que indica si estamos sobre la zona de destino
        isDraggingOver: false,
        // Bandera para la animación de nueva letra
        justAddedLetter: false
      });
  
      // Sincronizar letras del juego con las letras disponibles
      const syncGameLetters = () => {
        // Tomar las letras del estado del juego
        const lettersInGame = [...gameState.lettersOnTable];
        // Actualizar nuestro estado local
        letterState.availableLetters = lettersInGame;
      };
      
      // Al montar el componente, inicializar las letras disponibles
      onMounted(() => {
        syncGameLetters();
      });
      
      // Vigilar cambios en las letras de la mesa
      watch(() => gameState.lettersOnTable, (newLetters) => {
        // Actualizar cuando las letras en el juego cambien
        if (letterState.currentWordArray.length === 0) {
          syncGameLetters();
        }
      }, { deep: true });
  
      // Computed properties
      const isWordValid = computed(() => {
        return letterState.currentWordArray.length >= gameState.minLetters;
      });
  
      const calculatedScore = computed(() => {
        if (letterState.currentWordArray.length === 0) return 0;
        return letterState.currentWordArray.reduce((sum, letter) => sum + (VALORES_LETRAS[letter] || 0), 0);
      });
  
      // Accesores para simplificar la referencia en el template
      const availableLetters = computed(() => letterState.availableLetters);
      const currentWordArray = computed(() => letterState.currentWordArray);
      const isDragging = computed(() => letterState.isDragging);
      const isDraggingOver = computed(() => letterState.isDraggingOver);
      const justAddedLetter = computed(() => letterState.justAddedLetter);
  
      // Manejo de eventos de arrastrar y soltar
      const dragStart = (letter, index, source) => {
        letterState.dragInfo = { letter, index, source };
        letterState.isDragging = true;
      };
  
      const dragEnd = () => {
        letterState.dragInfo = { letter: null, index: null, source: null };
        letterState.isDragging = false;
      };
  
      const dragOver = (event) => {
        event.preventDefault();
        letterState.isDraggingOver = true;
      };
  
      const dragLeave = () => {
        letterState.isDraggingOver = false;
      };
  
      // Soltar en el área de palabra
      const dropInWord = () => {
        const { letter, index, source } = letterState.dragInfo;
        
        if (!letter) return;
        
        if (source === 'available') {
          // Si viene del área de disponibles
          letterState.currentWordArray.push(letter);
          letterState.availableLetters.splice(index, 1);
          
          // Efecto visual
          letterState.justAddedLetter = true;
          setTimeout(() => {
            letterState.justAddedLetter = false;
          }, 300);
        } else if (source === 'word') {
          // Si viene de la misma área de palabra (reordenamiento)
          // Implementación simplificada de reordenamiento
          const tempLetter = letterState.currentWordArray[index];
          letterState.currentWordArray.splice(index, 1);
          letterState.currentWordArray.push(tempLetter);
        }
        
        // Resetear estado de arrastre
        letterState.isDraggingOver = false;
        letterState.dragInfo = { letter: null, index: null, source: null };
      };
      
      // Soltar en el área de letras disponibles
      const dropInAvailable = () => {
        const { letter, index, source } = letterState.dragInfo;
        
        if (!letter || source !== 'word') return;
        
        // Si viene del área de palabra, devolverla a disponibles
        letterState.availableLetters.push(letter);
        letterState.currentWordArray.splice(index, 1);
        
        // Resetear estado de arrastre
        letterState.dragInfo = { letter: null, index: null, source: null };
      };
  
      // Devolver una letra de la palabra actual a las disponibles
      const returnLetterToAvailable = (index) => {
        // Obtener la letra
        const letter = letterState.currentWordArray[index];
        // Devolverla a disponibles
        letterState.availableLetters.push(letter);
        // Eliminarla de la palabra
        letterState.currentWordArray.splice(index, 1);
      };
  
      // Limpiar la palabra actual y devolver todas las letras
      const clearCurrentWord = () => {
        if (letterState.currentWordArray.length === 0) return;
        
        // Devolver todas las letras a disponibles
        letterState.availableLetters = [...letterState.availableLetters, ...letterState.currentWordArray];
        // Vaciar la palabra
        letterState.currentWordArray = [];
      };
  
      // Método que sincroniza el estado de juego con nuestro estado local
      const updateGameStateLetters = () => {
        // Actualizar las letras en el tablero del juego para que coincidan con nuestras disponibles
        gameState.lettersOnTable = [...letterState.availableLetters];
      };
  
      // Enviar la palabra formada
      const submitWord = () => {
        if (!isWordValid.value) return;
        
        // Formar la palabra final
        const word = letterState.currentWordArray.join('');
        // Calcular puntos
        const pts = calcScore(word);
        // Sumar al jugador actual
        gameState.currentPlayer.score += pts;
        
        // Guardar el número de letras usadas para reponerlas
        const usedLettersCount = letterState.currentWordArray.length;
        
        // Reiniciar palabra actual
        letterState.currentWordArray = [];
        
        // Sincronizar nuestro estado con el del juego ANTES de reponer letras
        updateGameStateLetters();
        
        // Reponer letras en el juego - exactamente la misma cantidad que se usó
        replenishLetters(usedLettersCount);
        
        // Pasar al siguiente turno - esta función ya se encarga de añadir 
        // las 2 letras adicionales cuando cambia de ronda
        nextTurn();
        
        // Volver a sincronizar después del cambio de turno
        syncGameLetters();
      };
  
      // Saltar turno con sincronización adecuada
      const handleSkipTurn = () => {
        // Sincronizar antes de saltar
        updateGameStateLetters();
        // Saltar turno
        skipTurn();
        // Sincronizar después de saltar
        syncGameLetters();
      };
  
      return {
        gameState,
        availableLetters,
        currentWordArray,
        isWordValid,
        calculatedScore,
        isDragging,
        isDraggingOver,
        justAddedLetter,
        VALORES_LETRAS,
        dragStart,
        dragEnd,
        dragOver,
        dragLeave,
        dropInWord,
        dropInAvailable,
        returnLetterToAvailable,
        clearCurrentWord,
        submitWord,
        skipTurn: handleSkipTurn
      };
    }
  };
  </script>
  
  <style scoped>
  /* Estilo para indicar visualmente que un elemento es reordenable */
  .word-letter {
    position: relative;
  }
  
  .word-letter::before {
    content: '';
    position: absolute;
    top: -4px;
    left: 50%;
    transform: translateX(-50%);
    width: 8px;
    height: 4px;
    background-color: rgba(59, 130, 246, 0.5);
    border-radius: 2px 2px 0 0;
    opacity: 0;
    transition: opacity 0.2s;
  }
  
  .word-letter:hover::before {
    opacity: 1;
  }
  
  /* Estilo para la letra siendo arrastrada */
  .word-letter:active {
    cursor: grabbing;
    transform: scale(1.05);
    z-index: 10;
  }
  </style>