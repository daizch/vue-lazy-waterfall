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
      <slot name="endToBottom">{{isFinished}}</slot>
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
        showItems: []
      }
    },

    props: {
      items: Array,

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
        this.render()
      }
    },

    mounted() {
      this.render()
      this.$on('preloaded', this.preloadedHandler)

      this.createLazyloadCallback()
    },

    beforeDestroy() {
      this.unbindEvents()
    },

    methods: {
      render() {
        if (this.isFinished) {
          return
        }
        this.calcItemsStyle()
      },
      scrollHandler() {
        if (!this.isFinished && isInViewport(this.$refs.loadRef, this.diff)) {
          this.$emit('load')
        }
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
        const colNum = this.colNum

        for (let index = 0; index < items.length; ++index) {
          let item = items[index]
          if (item._index >= colNum) {
            this.updateItemStyle(item)
          }
        }

        if (!this.isFinished && this.lazyScrollHandler) {
          this.lazyScrollHandler()
        }
      },
      unbindEvents() {
        //self lazy loader
        if (this.lazyScrollHandler) {
          window.removeEventListener('scroll', this.lazyScrollHandler)
        }
      },
      end() {
        this.isFinished = true
        this.unbindEvents()
      },
      calcItemsStyle() {
        const self = this
        const beginIndex = self.beginIndex
        var items = self.items
        var len = items.length - beginIndex
        var lazyList = []

        const done = (item) => {
          return (ev) => {
            if (ev) {
              item.$event = ev
              self.$emit(`image-${ev.type}`, item)
            }

            len -= 1
            if (0 === len) {
              self.showItems = self.showItems.concat(lazyList)
              self.$nextTick(() => {
                self.$emit('preloaded', lazyList)
              })
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

          self.calcItemStyle(item, index)
          lazyList.push(item)
        }

        self.beginIndex = self.items.length
      },
      updateItemStyle(item, index) {
        index = (index === undefined) ? item._index : index

        const colNum = this.colNum
        var prev = index - colNum
        if (prev >= 0) {
          var $prevItem = this.$refs[`$el_${prev}`][0]
          var $cur = this.$refs[`$el_${index}`][0]
          var top = parseInt($prevItem.style.top) + $prevItem.offsetHeight
          item._style.top = `${top}px`
          $cur.style.top = `${top}px`
          this.maxHeight = Math.max(this.maxHeight, top + $cur.offsetHeight)
        }
      },
      calcItemStyle(item, index) {
        const colNum = this.colNum
        var left = index % colNum * this.itemWidth
        var top = 0

        item._style = {
          width: this.itemWidth + 'px',
          left: `${left}px`,
          top: `${top}px`
        }
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
