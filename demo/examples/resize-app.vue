<template>
  <div class="freelog-alpha-images-list">
    <VueLazyWaterfall :items="items"
                      ref="waterfall"
                      :colNum="colNum"
                      :itemWidth="itemWidth"
                      @click="clickImgHandler"
                      :width="width" @load="getData">
      <div slot-scope="{item}" class="pin-image-item"><img :src="item.src" alt=""></div>
      <div class="loading-spinner" slot="loading"></div>
      <div slot="endToBottom" class="end-tip">END</div>
    </VueLazyWaterfall>
  </div>
</template>

<script>
  import VueLazyWaterfall from '../../src/vue-lazy-waterfall'

  export default {
    name: 'image-list-page',

    data() {
      var width = window.innerWidth * .85
      var itemWidth = 200
      var colNum = parseInt(width / itemWidth)
      return {
        items: [],
        group: 0,
        width: itemWidth * colNum,
        colNum: colNum,
        itemWidth: itemWidth
      }
    },

    components: {VueLazyWaterfall},

    mounted() {
      this.bindEvents()
    },

    beforeDestroy() {
      window.removeEventListener('resize', this.resizeHandler)
    },

    methods: {
      bindEvents() {
        window.addEventListener('resize', this.resizeHandler)
      },
      resizeHandler() {
        var width = parseInt(window.innerWidth * .8)
        this.colNum = parseInt(width / this.itemWidth)
        this.width = this.itemWidth * this.colNum
      },
      getData() {
        this.mockPageData()
          .then(items => {
            this.items = this.items.concat(items)
            this.group++
            if (this.group === 20) {
              this.$refs.waterfall.end()
            }
          })
      },
      mockPageData() {
        var items = []
        for (var i = 0; i < 20; i++) {
          // let width = parseInt(Math.random() * 100) + 300
          // let height = parseInt(Math.random() * 100) + 300
          let index = Math.min(parseInt(Math.random() * 15) + 1, 15)
          items.push({
            src: `./static/images/${index}.png`, //`https://picsum.photos/${width}/${height}/?random`,
            info: +new Date()
          })
        }

        return Promise.resolve(items)
      },
      clickImgHandler() {
        console.log(arguments)
      }
    },
    created() {
      this.getData()
    }
  }
</script>


<style lang="less">
  .freelog-alpha-images-list {
    display: flex;
    justify-content: center;
    .pin-image-item {
      line-height: 0;
      /*padding: 5px;*/
    }
  }
</style>
