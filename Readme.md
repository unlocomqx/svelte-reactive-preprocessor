[<img src="https://img.shields.io/npm/v/svelte-reactive-preprocessor">](https://www.npmjs.com/package/svelte-reactive-preprocessor)

# Svelte Reactive Preprocessor
Wrap svelte reactive statements with custom events to allow devtools to detect them

## How to install
Install the package with your preferred package manager
Package name
```text
svelte-reactive-preprocessor
```

Installation example
````shell
npm i -D svelte-reactive-preprocessor
````

## How to use
First import the package like this
```javascript
const { reactivePreprocess } = require("svelte-reactive-preprocessor");
```
or
```javascript
import { reactivePreprocess } from "svelte-reactive-preprocessor";
```

Then in the svelte loader options, add the reactive preprocessor like this
```javascript
// Import
const { reactivePreprocess } = require("svelte-reactive-preprocessor");

// config
{
  test: /\.svelte$/,
  use: {
    loader: "svelte-loader",
    options: {
      dev: !prod,
      emitCss: true,
      hotReload: true,
      // add this line
      preprocess: reactivePreprocess()
    }
  }
},
```

If you are already using another preprocessor, add the reactive preprocessor like this
```javascript
preprocess: [
  sveltePreprocess(),
  reactivePreprocess(),
],
```

Make sure to add the reactive preprocessor after any script preprocessor as it only supports javascript  
The same goes for rollup
```javascript
plugins: [
  svelte({
    preprocess: reactivePreprocess(),
  }
],
```
or
```javascript
plugins: [
  svelte({
    preprocess: [
      sveltePreprocess(),
      reactivePreprocess(),
    ],
  }
],
```

## Options (optional)
The preprocessor options are listed below with their default values

```javascript
reactivePreprocess({
  enabled: true
})
```

### enabled: boolean
Allows to conditionally enable/disable the preprocessor  
Example
```javascript
{
  enabled: !prod
}
```
