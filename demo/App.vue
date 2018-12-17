<template>
  <div>
    <vueLazyWaterfall :items="items"
                      :width="width"
                      class="waterfall-wrap"
                      @load="loadData"
                      @image-load="imageLoad"
                      @image-error="imageLoad"
                      ref="waterfall"
                      :diff = "{bottom: 2000}"
                      @click="clickFn">
      <div class="pin-item" slot-scope="{item}">
        <img :src="item.src" alt="">
        {{item.textContent}}
      </div>

      <div slot="endToBottom" class="end-tip">end...</div>
    </vueLazyWaterfall>

    <div class="back-top" @click="backToTopHandler">back to top</div>
    <div style="height: 3000px; background-color: #00C075"></div>
  </div>
</template>

<script>
  import vueLazyWaterfall from '../src/vue-lazy-waterfall/index.vue'
  import axios from 'axios'

  export default {
    name: 'app',
    data() {
      return {
        items: [],
        group: 0, // 当前加载的加载图片的次数
        pullDownDistance: 0,
        width: 990
      }
    },
    components: {
      vueLazyWaterfall
    },
    methods: {
      loadData() {
        axios.get('./static/mock/data.json?group=' + this.group)
          .then(res => {
            this.group++
            if (this.group === 33) {
              this.$refs.waterfall.end()
              return
            }

            res.data.sort(() => Math.random() - 0.5)
            this.items = this.items.concat(res.data)
          })
      },
      clickFn({value, index, $event}) {
        // console.log({value, index, $event})
      },
      imageLoad({$event}) {
        // console.log($event)
      },
      changeImgArr() {
        axios.get('./static/mock/data-change.json')
          .then(res => {
            this.items = res.data
          })
      },
      backToTopHandler(){
        window.scrollTo(0,0)
      }
    },
    created() {
      this.loadData()
    },
  }
</script>

<style lang="scss">
  @import "static/css/reset.css";
  .back-top {
    position: fixed;
    right: 100px;
    bottom: 100px;
    background-color: black;
    border-radius: 50%;
    color: white;
    padding: 20px 10px;
    cursor: pointer;
  }

  .end-tip {
    text-align: center;
    font-size: 30px;
    color: #999;
  }

  .waterfall-wrap {
    margin: 10px auto;

    .pin-item {
      padding: 5px;
      border-radius: 3px;
      box-shadow:  0 1px 3px rgba(0,0,0,.02), 0 4px 8px rgba(0,0,0,.02);
      transition: transform;
      &:hover {
        box-shadow: 0 1px 3px rgba(0,0,0,.02), 0 16px 32px -4px rgba(0,0,0,.17);
        transform: translateY(-1px);
      }
    }
  }
</style>
