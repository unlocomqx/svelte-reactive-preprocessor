<script>
  export let name;
  export let half;
  export let quarter = 0;

  let count = 1;

  function increment() {
    count++;
  }

  $: double = count * 2;

  let triple;
  $: triple = count * 3;

  $: half = count / 2;

  $: quarter = count / 4;
</script>

<main>
  <h1>Hello {name}!</h1>
  <div>
    <button id="add" on:click={increment}>Add</button>
    <div id="result">
      <div>
        Count: {count}
      </div>
      <div>
        Double: {double}
      </div>
      <div>
        Triple: {triple}
      </div>
      <div>
        Half: {half}
      </div>
      <div>
        Quarter: {quarter}
      </div>
    </div>
  </div>
</main>

<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }

  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>
