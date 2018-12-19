<template>
  <div class="freelog-alpha-images-list">
    <VueLazyWaterfall :items="imgsArr"
                      ref="waterfall"
                      :width="1190" @load="getData">
      <div slot-scope="{item}" class="pin-image-item">
        <img :src="item.src" alt="">
      </div>
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
      return {
        imgsArr: [],
        group: 0,// request param
      }
    },

    components: {VueLazyWaterfall},

    mounted() {
      // this.$waterfall = this.$refs.waterfall.$el.querySelector('.vue-waterfall-easy')
    },

    methods: {
      getData() {
        // In the real environment,the backend will return a new image array based on the parameter group.
        // Here I simulate it with a stunned json file.
        this.mockPageData()
          .then(items => {
            this.imgsArr = this.imgsArr.concat(items)
            this.group++
            if (this.group === 5) {
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
      padding: 5px;
    }
  }
</style>
