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
In the svelte loader options, add the rxd preprocessor like this
```javascript
// Import
const { rxd_preprocess } = require("svelte-rxd-preprocessor");

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
      preprocess: rxd_preprocess()
    }
  }
},
```

If you are already using another preprocessor, add the rxd preprocessor like this
```javascript
preprocess: [
  sveltePreprocess(),
  rxd_preprocess(),
],
```

Make sure to add the rxd preprocessor after any script preprocessor as it only supports javascript