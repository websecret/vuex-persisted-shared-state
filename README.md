# vuex-persisted-shared-state
Persist [Vuex](http://vuex.vuejs.org/) state with [localStorage](https://developer.mozilla.org/nl/docs/Web/API/Window/localStorage) and share between tabs.

## Requirements

* [Vue.js](https://vuejs.org) (v2.0.0+)
* [Vuex](http://vuex.vuejs.org) (v2.0.0+)

## Installation

```bash
$ npm install vuex-persisted-shared-state
```
or
```bash
$ yarn add vuex-persisted-shared-state
```


## Usage

```js
import persistedSharedState from "vuex-persisted-shared-state";

const store = new Vuex.Store({
    // ...
    plugins: [
        persistedSharedState({
            'cart': 'SET_CART',
        }),
    ]
});
```

## API

### `persistedSharedState(mutations, options = {})`

Creates a new instance of the plugin with the given mutations object and options.

Mutations can be provided like strings

```js
{
    'cart': 'SET_CART',
}
```

or like an objects

```js
{
    'cart': {
        mutation: 'SET_CART',
        share: false,
        defaultValue: null,
    },
}
```

The following options can be provided to configure the plugin for your specific needs:

* `share`: Should state change be shared between browser tabs. (default: **true**)
* `prefix`: Prefix of the localStorage keys. (default: **'vuex-persisted-shared-state'**)