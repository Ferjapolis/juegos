# Juego de Palabras - Guía de instalación y uso

## Requisitos previos
- Node.js (versión 16 o superior)
- npm o yarn

## Pasos de instalación

1. **Crea un nuevo proyecto Astro con integración de Vue y Tailwind**

```bash
# Usando npm
npm create astro@latest juego-palabras
cd juego-palabras
npm astro add vue
npm astro add tailwind

# O usando yarn
yarn create astro juego-palabras
cd juego-palabras
yarn astro add vue
yarn astro add tailwind
```

2. **Copia los archivos proporcionados en la estructura adecuada**

Copia todos los archivos en la estructura de carpetas como se muestra a continuación:

```
juego-palabras/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── GameBoard.vue
│   │   ├── GameOver.vue
│   │   ├── ScoreBoard.vue
│   │   └── StartScreen.vue
│   ├── layouts/
│   │   └── Layout.astro
│   ├── pages/
│   │   └── index.astro
│   └── utils/
│       └── gameLogic.js
├── astro.config.mjs
├── package.json
├── tailwind.config.cjs
└── tsconfig.json
```

3. **Ejecuta el proyecto**

```bash
# Usando npm
npm run dev

# O usando yarn
yarn dev
```

4. **Abre el navegador**

Abre tu navegador en [http://localhost:4321](http://localhost:4321) para jugar.

## Cómo jugar

1. En la pantalla de inicio, selecciona el número de jugadores (1-4) y escribe sus nombres.
2. Haz clic en "Iniciar Juego" para comenzar.
3. En cada turno, debes formar una palabra utilizando las letras disponibles en el tablero.
4. La palabra debe contener al menos la mitad de las letras mostradas.
5. Después de enviar una palabra válida, las letras usadas se reemplazan y el juego pasa al siguiente jugador.
6. Si no puedes formar una palabra, puedes saltar tu turno.
7. El juego dura 4 rondas, y en cada ronda se añaden más letras al tablero.
8. Gana el jugador que acumule más puntos al final del juego.

¡Diviértete jugando!