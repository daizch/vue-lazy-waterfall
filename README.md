# vue-lazy-waterfall

![](./config/icon.png)

[![NPM version](https://img.shields.io/npm/v/vue-lazy-waterfall.svg?style=flat)](https://www.npmjs.com/package/vue-lazy-waterfall)

> A [Vue.js](https://github.com/vuejs/vue) component to render waterfall layout for Vue.js v2.x+.

## Documentation
- [中文](./README-CN.md)
- [English](./README.md)

## Features
- No extra dependencies except Vue
- Lazy load
- Automation layout

## Installation
[![vue-lazy-waterfall](https://nodei.co/npm/vue-lazy-waterfall.png)](https://npmjs.org/package/vue-lazy-waterfall)

```sh
npm install vue-lazy-waterfall --save
```

And it's also available on [jsDelivr](https://www.jsdelivr.com/package/npm/vue-lazy-waterfall)

```html
<script src="//cdn.jsdelivr.net/npm/vue-lazy-waterfall"></script>
```

## Examples
- [demo](https://daizch.github.io/vue-lazy-waterfall/dist/demo/index.html#/)
- [custom lazy loader demo](https://daizch.github.io/vue-lazy-waterfall/dist/demo/index.html#/lazy)
- [resize demo](https://daizch.github.io/vue-lazy-waterfall/dist/demo/index.html#/demo)

## Usage

### simple example 

use in html temlate: 

```html
<template>
<div>
  <vueLazyWaterfall :items="items"
                  ref="waterfall"
                  @load="loadData">
                   <div class="pin-item" slot-scope="{item}">
                          <img :src="item.src" alt="">
                        </div>
</vueLazyWaterfall>
</div>
</template>
```

used by es6 import 

```javascript
//es6 import
import vueLazyWaterfall from 'vue-lazy-waterfall';

export default {
  name: 'app',
  data(){
      return {
        items: []
      }
  },
  components: {
    vueLazyWaterfall
  }
}
```

used by script link

```html
<script src="dist/vue-lazy-waterfall/index.js"></script>
```

```javascript
new Vue({
  el: '#app',
  data(){
      return {
        items: []
      }
  },
  components: {
    vueLazyWaterfall
  },
  
  methods: {
    loadData(){
      //load data
      //stop lazy load: this.$refs.waterfall.end()
    }
  }
})
```

### example with more custom configuration  

```html
<template>
<div>
  <vueLazyWaterfall :items="items"
                  ref="waterfall"
                  :width="1100"
                  :colNum="4"
                  @image-load="imageLoadHandler"
                  @image-error="imageLoadHandler"
                  @click="clickItemHandler"
                  @load="loadData">
                   <template slot-scope="{item}">
                      <div class="pin-item">
                         <img :src="item.src" alt="">
                         <p>{{item.info}}</p>
                       </div>
                   </template>
                   <div slot="endToBottom">it is end...</div>
  </vueLazyWaterfall>
</div>
</template>

<script>
import vueLazyWaterfall from 'vue-lazy-waterfall'

export default {
  name: 'waterfall-app',
  data(){
      return {
        items: [],
        page: 0
      }
  },
  components: {
    vueLazyWaterfall
  },
  
  methods: {
    loadData(){
      this.mockPageData()
      .then((arr)=>{
        this.items = this.items.concat(arr)
        this.page++
        if (this.page === 10) {
          this.$refs.waterfall.end()
        }
      })
    },
    mockPageData(){
      var items = []
      for (var i = 0; i < 10; i++) {
        let width = parseInt(Math.random() * 100) + 300
        let height = parseInt(Math.random() * 100) + 300
        items.push({
          src: `https://picsum.photos/${width}/${height}/?random`,
          info: Math.random().toString().substring(3)
        })
      }
      
      return Promise.resolve(items)
    },
    imageLoadHandler(item){
      console.log(item.$event)
    },
    clickItemHandler(item){
      console.log('click ', item)
    }
  }
}
</script>
```

### createLazyLoader example

```html
<template>
  <div class="wrap">
    <vueLazyWaterfall :items="items"
                      ref="waterfall"
                      :width="1190"
                      :createLazyLoader="createLazyLoader"
                      @load="loadData">
      <template slot-scope="{item}">
        <div class="pin-item">
          <img :src="item.src" alt="">
          <p>{{item.info}}</p>
        </div>
      </template>
      <template slot="endToBottom">
        <div>it is end...</div>
      </template>
    </vueLazyWaterfall>
  </div>
</template>

<script>
  import vueLazyWaterfall from '../../src/vue-lazy-waterfall'
  import lozad from 'lozad'

  export default {
    name: 'waterfall-lazy-app',
    data() {
      return {
        items: [],
        page: 0
      }
    },
    components: {
      vueLazyWaterfall
    },

    methods: {
      loadData() {
        return this.mockPageData()
          .then((arr) => {
            this.items = this.items.concat(arr)
            this.page++
            if (this.page === 20) {
              this.$refs.waterfall.end()
            }
          })
      },
      mockPageData() {
        var items = []
        for (var i = 0; i < 20; i++) {
          let width = parseInt(Math.random() * 100) + 300
          let height = parseInt(Math.random() * 100) + 300
          items.push({
            src: `https://picsum.photos/${width}/${height}/?random`,
            info: +new Date()
          })
        }

        return Promise.resolve(items)
      },
      createLazyLoader($loading) {
        const self = this
        const observer = lozad($loading, {
          load: function () {
            self.loadData()
          },
          loaded() {
            setTimeout(() => {
              $loading.dataset.loaded = false
              observer.observe($loading)
            }, 1e3)
          },
          rootMargin: '500px',
          threshold: 0.9
        });
        observer.observe()
      }
    }
  }
</script>
```

## Options

### props
| name | type | default | description |
| --- | --- | --- | --- |
| items | Array | - | array of list items to render |
| colNum | Number | 5 | number of columns to render items |
| width | Number | width of window | define how width to render waterfall layout |
| itemWidth | Number | - | calculate by the colNum and the width|
| diff | Object | {top: 0, right: 0, bottom: window.innerHeight, left: 0} | offset config to determine when to fire load event|
| createLazyLoader | Function | - | create your own lazy loader |
| autoMode| Boolean| true| render the item one by one when the one's image is ready. If it is false, the waterfall view will render the items by loaded order
|imageFilter| Function| - | handle the image's src property whatever you want before load the image
| maxLoading| Boolean | 2 | the max number of loading data at the same time

### events
| name |  default | description |
| --- | --- | --- |
| load| - | triggered to load the data of next page
| click | - | triggered by when the item was clicked 
| image-load | - | triggered by when the image was loaded successfully
| image-error | - | triggered by when the image was loaded error
| finished| - | all images requested by the waterfall are loaded

### slots
| name | default | slot-scope | description|
| --- | --- | --- | --- |
| loading | - | - | loading content placeholder to be showed when the waterfall is not finished |
| endToBottom| - | - | it will show up when the waterfall was scrolled to end
| - | - | item | each item's content to display

## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)
