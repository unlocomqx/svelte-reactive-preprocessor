# Svelte Reactive Preprocessor
Wrap svelte reactive statements with custom events to allow devtools to detect them

## How to install
Install the package with your preferred package manager
Package name
```text
svelte-rxd-preprocessor
```

Installation example
````shell
npm i -D svelte-rxd-preprocessor
````

## How to use
First import the package like this
```javascript
const { rxdPreprocess } = require("svelte-rxd-preprocessor");
```
or
```javascript
import { rxdPreprocess } from "svelte-rxd-preprocessor";
```

Then in the svelte loader options, add the rxd preprocessor like this
```javascript
// Import
const { rxdPreprocess } = require("svelte-rxd-preprocessor");

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
      preprocess: rxdPreprocess()
    }
  }
},
```

If you are already using another preprocessor, add the rxd preprocessor like this
```javascript
preprocess: [
  sveltePreprocess(),
  rxdPreprocess(),
],
```

Make sure to add the rxd preprocessor after any script preprocessor as it only supports javascript  
The same goes for rollup
```javascript
plugins: [
  svelte({
    preprocess: rxdPreprocess(),
  }
],
```
or
```javascript
plugins: [
  svelte({
    preprocess: [
      sveltePreprocess(),
      rxdPreprocess(),
    ],
  }
],
```

## Options (optional)
The preprocessor options are listed below with their default values

```javascript
rxdPreprocess({
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