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
        isEnd: false
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
      }
    },

    watch: {
      items() {
        this.renderView()
      },
      colNum() {
        this.reflow(this.showItems)
      }
    },

    mounted() {
      this.renderView()
      this.$on('preloaded', this.preloadedHandler)

      this.createLazyloadCallback()
    },

    beforeDestroy() {
      this.unbindEvents()
    },

    methods: {
      renderView() {
        if (this.isEnd) {
          return
        }
        this.calcItemsStyle()
      },
      scrollHandler() {
        if (!this.isEnd && isInViewport(this.$refs.loadRef, this.diff)) {
          this.$emit('load')
        }
      },
      reflow(items) {
        items.forEach(item => {
          this.refreshItemStyle(item)
        })

        var maxHeight = 0
        items.forEach((item) => {
          var index = item._index
          var $el = this.$refs[`$el_${index}`][0]
          $el.style.cssText += `left:${item._style.left};top:${item._style.top};`
          maxHeight = Math.max(maxHeight, parseInt(item._style.top) + $el.offsetHeight)
        })
        this.maxHeight = maxHeight
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

        if (!this.isEnd && this.lazyScrollHandler) {
          this.lazyScrollHandler()
        }
      },
      unbindEvents() {
        //self lazy loader
        if (this.lazyScrollHandler) {
          window.removeEventListener('scroll', this.lazyScrollHandler)
        }
      },
      initItemStyle(item, index) {
        const colNum = this.colNum
        var left = index % colNum * this.itemWidth
        var top = 0

        item._style = {
          width:`${this.itemWidth}px`,
          left: `${left}px`,
          top: `${top}px`
        }
      },
      calcItemsStyle() {
        const self = this
        const beginIndex = self.beginIndex
        var items = self.items
        var len = items.length - beginIndex
        var lazyList = []

        if (!items.length) return

        this.loadings++

        const done = (item) => {
          return (ev) => {
            if (ev) {
              item.$event = ev
              self.$emit(`image-${ev.type}`, item)
            }

            len -= 1
            if (0 === len) {
              self.showItems = self.showItems.concat(lazyList)
              self.loadings--
              self.$nextTick(() => {
                self.$emit('preloaded', lazyList)
              })

              if (self.loadings === 0) {
                self.$emit('finished') //all loadings are finished
              }

              self.$emit('done', lazyList)
            }
          }
        }

        for (let index = beginIndex; index < items.length; index++) {
          let item = items[index]
          let img = new Image()

          item._index = index

          if (item.src) {
            img.onload = done(item)
            img.onerror = done(item)
            img.src = item.src
          } else {
            done(item)
          }

          self.initItemStyle(item, index)
          lazyList.push(item)
        }

        self.beginIndex = self.items.length
      },
      refreshItemStyle(item) {
        const colNum = this.colNum
        const index = item._index
        var left = index % colNum * this.itemWidth
        var prev = index - colNum
        item._style.left = `${left}px`
        item._style.top = 0
        if (prev >= 0) {
          let $prevItem = this.$refs[`$el_${prev}`][0]
          let prevItem = this.showItems[prev]
          var top = parseInt(prevItem._style.top) + $prevItem.offsetHeight
          item._style.top = `${top}px`
        }
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
