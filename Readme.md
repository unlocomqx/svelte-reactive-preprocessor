[<img src="https://img.shields.io/npm/v/svelte-reactive-preprocessor">](https://www.npmjs.com/package/svelte-reactive-preprocessor)

# Svelte Reactive Preprocessor
Wrap svelte reactive statements with custom events to allow devtools to detect them

## How to install
````shell
npm i -D svelte-reactive-preprocessor
````

## How to use
First import the package like this
```javascript
const { reactivePreprocess } = require("svelte-reactive-preprocessor");
```

Then in the svelte loader options, add the reactive preprocessor like this
```javascript
plugins: [
  svelte({
    preprocess: reactivePreprocess(),
  }
],
```

If you are already using another preprocessor, add the reactive preprocessor like this
```javascript
preprocess: [
  sveltePreprocess(),
  reactivePreprocess(),
],
```

## Options
The preprocessor options are listed below with their default values

```javascript
reactivePreprocess({
  enabled: true,
  state: true,
})
```

### enabled: boolean
Enable or disable the preprocessor

### state: boolean
Whether to send the state to devtools. Set to false if you encounter performance issues.
