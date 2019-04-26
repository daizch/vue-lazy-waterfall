<template>
  <div class="vue-lazy-waterfall-wrap"
       :style="{width: `${width}px`}">
    <ul class="vue-lazy-waterfall-list"
        :style="{'padding-top': `${maxHeight}px`}"
        ref="listRef">
      <li class="vue-lazy-waterfall-item"
          v-for="(item, index) in showItems"
          :key="index"
          :style="item._style"
          :ref="`$el_${index}`"
          @click="clickItemHandler(item, index, $event)">
        <slot :item="item"></slot>
      </li>
      <li class="loading-placeholder" ref="loadRef" v-show="isFinished===false">
        <slot name="loading"></slot>
      </li>
    </ul>

    <div class="vue-lazy-waterfall-end" v-show="isFinished">
      <slot name="endToBottom"></slot>
    </div>
  </div>
</template>


<script>
  import isInViewport from '../helpers/isInViewport'
  import throttle from '../helpers/throttle'

  export default {
    name: 'vue-lazy-waterfall',

    data() {
      return {
        maxHeight: 0,
        isFinished: false,
        beginIndex: 0,
        showItems: [],
        loadings: 0,
        isEnd: false,
        lazyRenderItems: []
      }
    },

    props: {
      items: {
        type: Array,
        required: true
      },

      colNum: {
        type: Number,
        default: 5
      },

      width: {
        type: Number,
        default() {
          return window.innerWidth
        }
      },

      itemWidth: {
        type: Number,
        default() {
          return parseInt(this.width / this.colNum)   //px
        }
      },

      load: Function,

      createLazyLoader: Function,

      diff: {
        type: Object,
        default() {
          return {
            bottom: (window.innerHeight || document.documentElement.clientHeight)
          }
        }
      },

      /**
       * render the item immediately when its image is loaded
       * attention: it will not keep the render order of the items
       */
      autoMode: {
        type: Boolean,
        default: true
      },

      //the number of loading data at the same time
      maxLoading: {
        type: Number,
        default: 2
      },

      imageFilter: Function
    },

    watch: {
      items() {
        this.renderView()
      },
      colNum() {
        this.maxHeight = 0
        this.reflow(this.showItems)
      }
    },

    mounted() {
      this.renderView()
      this.bindEvents()
      this.createLazyloadCallback()
    },

    beforeDestroy() {
      this.unbindEvents()
    },

    methods: {
      bindEvents() {

      },
      renderView() {
        if (this.isEnd && this.isFinished) {
          return
        }
        this.calcItemsStyle()
      },
      scrollHandler() {
        if (!this.isEnd && this.canLoadData() && isInViewport(this.$refs.loadRef, this.diff)) {
          this.$emit('load')
        }
      },
      reflow(items) {
        items.forEach(item => {
          this.calcItemStyle(item)
        })

        var maxHeight = 0
        items.forEach((item) => {
          var index = item._index
          var $els = this.$refs[`$el_${index}`]
          var $el = $els[0]
          $el.style.cssText += `left:${item._style.left};top:${item._style.top};`
          maxHeight = Math.max(maxHeight, parseInt(item._style.top) + $el.offsetHeight)
        })
        this.maxHeight = Math.max(this.maxHeight, maxHeight)
      },
      createLazyloadCallback() {
        if (this.createLazyLoader) {
          this.createLazyLoader(this.$refs.loadRef)
        } else {
          //self lazy loader
          this.lazyScrollHandler = throttle(this.scrollHandler, 50)
          window.addEventListener('scroll', this.lazyScrollHandler.bind(this))
        }
      },
      preloadedHandler(items) {
        this.reflow(items)

        //check weather it should to load next page immediately
        if (this.lazyScrollHandler) {
          this.lazyScrollHandler()
        }
      },
      unbindEvents() {
        //lazy loader
        if (this.lazyScrollHandler) {
          window.removeEventListener('scroll', this.lazyScrollHandler)
        }
        this.$off('preloaded', this.preloadedHandler)
      },
      canLoadData() {
        return this.loadings < this.maxLoading
      },
      calcItemStyle(item) {
        const colNum = this.colNum
        var index = item._index
        var left = index % colNum * this.itemWidth
        var top = 0
        var prev = index - colNum

        if (prev >= 0) {
          let $prevItem = this.$refs[`$el_${prev}`]
          $prevItem = $prevItem && $prevItem[0]
          let prevItem = this.showItems[prev]
          if ($prevItem && prevItem) {
            top = parseInt(prevItem._style.top) + $prevItem.offsetHeight
          }
        }

        item._style = {
          width: `${this.itemWidth}px`,
          left: `${left}px`,
          top: `${top}px`
        }
      },
      lazyRenderItemsHandler() {
        var curRenderItems = this.lazyRenderItems[0]
        if (curRenderItems && curRenderItems.len === curRenderItems.count) {
          this.showItems = this.showItems.concat(curRenderItems.items)
          this.lazyRenderItems.shift()
          this.$nextTick(() => {
            this.preloadedHandler(curRenderItems.items)
            this.$emit('preloaded', curRenderItems.items)
            this.lazyRenderItemsHandler()
          })
        }
      },
      calcItemsStyle() {
        const self = this
        const beginIndex = this.beginIndex
        var items = this.items
        const itemsLength = items.length
        const autoMode = this.autoMode
        var currentRenderItems = {
          count: 0,
          len: itemsLength - beginIndex,
          items: items.slice(beginIndex, itemsLength)
        }

        const hasImageFilter = (typeof this.imageFilter === 'function')
        if (!currentRenderItems.len) return

        if (!autoMode) {
          this.lazyRenderItems.push(currentRenderItems)
        }

        this.loadings++
        const done = (item) => {
          return (ev) => {
            if (ev) {
              item.$event = ev
              item._isLoadImageError = ev.type === 'error'
              self.$emit(`image-${ev.type}`, item)
            }

            currentRenderItems.count += 1

            if (autoMode) {
              item._index = self.showItems.length
              self.calcItemStyle(item)
              self.showItems.push(item)
              self.$nextTick(() => {
                self.resetMaxHeight(item)
              })
            } else {
              self.calcItemStyle(item)
            }

            if (currentRenderItems.count === currentRenderItems.len) {
              if (!autoMode) {
                self.lazyRenderItemsHandler()
              }

              self.loadings--
              if (self.loadings === 0) {
                self.isFinished = true
                self.$emit('finished') //all loadings are finished
              }
              self.$emit('done', currentRenderItems.items)
            }
          }
        }

        currentRenderItems.items.forEach((item, index) => {
          let img = new Image()

          item._index = index + beginIndex
          if (item.src) {
            //preload image
            img.onload = done(item)
            img.onerror = done(item)
            img.src = hasImageFilter ? this.imageFilter(item.src, item) : item.src
          } else {
            done(item)
          }
        })

        self.beginIndex = itemsLength
      },
      resetMaxHeight(item) {
        var index = item._index
        var $els = this.$refs[`$el_${index}`]
        var $el = $els[0]
        this.maxHeight = Math.max(this.maxHeight, parseInt(item._style.top) + $el.offsetHeight)
      },
      end() {
        if (this.loadings) {
          this.$once('finished', () => {
            this.isFinished = true
          })
        } else {
          this.isFinished = true
        }
        this.isEnd = true
        this.unbindEvents()
      },
      clickItemHandler(value, index, $event) {
        this.$emit('click', {value, index, $event})
      }
    }
  }
</script>


<style lang="less" scoped>
  .vue-lazy-waterfall-wrap {
    .vue-lazy-waterfall-list {
      position: relative;
    }
    .loading-placeholder {
      min-height: 1px;
      width: 100%;
      background-color: transparent;
    }
    .vue-lazy-waterfall-item {
      position: absolute;
      box-sizing: border-box;
      overflow: hidden;
      img {
        width: 100%;
      }
    }
  }
</style>
