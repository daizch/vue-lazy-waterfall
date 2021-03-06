# vue-lazy-waterfall

[![NPM version](https://img.shields.io/npm/v/vue-lazy-waterfall.svg?style=flat)](https://www.npmjs.com/package/vue-lazy-waterfall)

> [Vue.js](https://github.com/vuejs/vue)瀑布流组件，支持Vue.js v2.x+.

## 文档
- [中文](./README-CN.md)
- [English](./README.md)

## 特性
- 除了Vue外，别无依赖
- 懒加载数据
- 自动排版布局

## 范例
- [demo](https://daizch.github.io/vue-lazy-waterfall/dist/demo/index.html#/)
- [custom lazy load demo](https://daizch.github.io/vue-lazy-waterfall/dist/demo/index.html#/lazy)
- [resize demo](https://daizch.github.io/vue-lazy-waterfall/dist/demo/index.html#/demo)

## 安装
[![vue-lazy-waterfall](https://nodei.co/npm/vue-lazy-waterfall.png)](https://npmjs.org/package/vue-lazy-waterfall)

```sh
npm install vue-lazy-waterfall --save
```

## 用法

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

```javascript
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

或者


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
      //在这里加载数据
      //停止加载 this.$refs.waterfall.end()
    }
  }
})
```


## 配置

### 属性
| 名称 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| items | Array | - | 瀑布流渲染的数据 |
| colNum | Number | 5 | 瀑布流展示的列数 |
| width | Number | 默认是窗口(window)宽度 | 确定瀑布流的展示宽度 |
| itemWidth | Number | - | 由宽度和列数计算所得，一般不指定|
| diff | Object | {top: 0, right: 0, bottom: window.innerHeight, left: 0} | 触发懒加载的偏移量|
| createLazyLoader | Function | - | 替换自带的懒加载，实现自定义的懒加载 |
| autoMode| Boolean| true| 当某一项数据的图片加载完成，不保证按照数据的顺序立即渲染，设置为false，会按照每一页的加载顺序渲染
|imageFilter| Function| - | 添加对图片src属性的处理，比如根据浏览器修改图片后缀或者修改加载图片的尺寸
| maxLoading| Boolean | 2 | 允许同时加载的最多请求数

### 事件
| 名称 |  默认值 | 描述 |
| --- | --- | --- |
| load| - | 懒加载触发加载下一页数据
| click | - | 点击某个子项目 
| image-load | - | 图片加载成功
| image-error | - | 图片加载失败


### slots
| name | default | slot-scope | description|
| --- | --- | --- | --- |
| endToBottom| - | - | 瀑布流滚动到底部时展示
| - | - | item | 每一项展示的内容


## todo
- 纵向渲染，无需用absolute和计算left&top
- 横向渲染时，可一行行渲染下来，无需等待每一页数据（图片）加载完成

## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)
