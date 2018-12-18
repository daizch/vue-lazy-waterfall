# vue-lazy-waterfall

[![NPM version](https://img.shields.io/npm/v/vue-lazy-waterfall.svg?style=flat)](https://www.npmjs.com/package/vue-lazy-waterfall)

> A [Vue.js](https://github.com/vuejs/vue) component to render waterfall layout for Vue.js v2.x+.


## Features
- No extra dependencies except Vue
- Lazy load
- Automation layout

## Installation
[![vue-lazy-waterfall](https://nodei.co/npm/vue-lazy-waterfall.png)](https://npmjs.org/package/vue-lazy-waterfall)

```sh
npm install vue-lazy-waterfall --save
```

## Usage


[demo](https://daizch.github.io/vue-lazy-waterfall/dist/demo/index.html#/)

```javascript
import LazyWaterfall from 'vue-lazy-waterfall';

export default {
  name: 'app',
  components: {
    LazyWaterfall
  }
}
```

```javascript
import LazyWaterfall from 'vue-lazy-waterfall';

new Vue({
  el: '#app',
  components: {
    LazyWaterfall
  },
  
  methods: {
    loadData(){
      //load data
      //stop lazy load: this.$refs.waterfall.end()
    }
  }
})
```

use in html temlate: 

```html
<template>
<div>
  <LazyWaterfall :items="items"
                  ref="waterfall"
                  @load="loadData">
                   <div class="pin-item" slot-scope="{item}">
                          <img :src="item.src" alt="">
                        </div>
</LazyWaterfall>
</div>
</template>
```


## Options

### props
| name | type | default | description |
| --- | --- | --- | --- |
| items | Array | - | array of list items to render |
| colNum | Number | 5 | number of columns to render items |
| width | Number | width of window | define how width to render waterfall layout |
| itemWidth | Number | - | calculate by the colNum and the width|
| diff | Object | {bottom: window.innerHeight} | offset config to determine when to fire load event|
| createLazyLoader | Function | - | create your own lazy loader |

### events
| name |  default | description |
| --- | --- | --- |
| load| - | triggered to load the items data
| click | - | triggered by when the item was clicked 
| image-load | - | triggered by when the image was loaded successfully
| image-error | - | triggered by when the image was loaded error


## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)
