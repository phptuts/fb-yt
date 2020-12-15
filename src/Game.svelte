<script lang="ts">
  import { GameController } from "./game";
  import Pipe from './Pipe.svelte';
  import Bird from './Bird.svelte';
  const game = new GameController();

  let frame = game.newGame();

  function jump() {
      game.jump();
  }

  function startGame() {
    frame = game.start();
  }


  setInterval(() => {
      frame = game.nextFrame();
  }, 1000 / 90);
</script>

<style>
  main {
    position: relative;
    border: solid black 1px;
    overflow: hidden;
    background-color: lightblue;
  }
  #ground {
        background-color: brown;
        width: 100%;
        position: absolute;
        bottom: 0;
        left: 0;
    }

    #init-screen {
    user-select: none;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    font-family: monospace;
  }
  #init-screen h2 {
    text-align: center;
  }
  #init-screen button {
    font-family: monospace;
    font-size: 16px;
    border: none;
    border-radius: none;
    background-color: ghostwhite;
    padding: 10px;
    cursor: pointer;
    outline: none;
    transition: ease-in-out 0.2s font-size;
    display: block;
    margin: 0 auto;
  }

  #init-screen button:active,
  #init-screen button:focus {
    outline: none;
    font-size: 15px;
  }

  #score {
    position: absolute;
    right: 10px;
    top: 10px;
    font-size: 20px;
    z-index: 10;
    padding: 5px;
    font-family: cursive;
    background-color: white;
    user-select: none;
  }
</style>

<main
  style="width: {frame.width}px; height: {frame.height}px;"
  class="game"
>
  <section id="score">{frame.score}</section>

<Bird bird={frame.bird} />
  <Pipe pipe="{frame.firstPipe}" />
  <Pipe pipe="{frame.secondPipe}" />
  {#if frame.gameOver || !frame.gameStarted}
  <section id="init-screen">
    {#if frame.gameOver}
      <h2>Game Over</h2>
      <h2>Score {frame.score}</h2>
    {/if}
    <button on:click="{startGame}">Start Game</button>
  </section>
  {/if}
<section style="height: {frame.ground.height}px;" id="ground" ></section>

</main>

<svelte:window on:click="{jump}" />
