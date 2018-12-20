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
      <div class="loading-spinner" slot="loading"></div>
      <div slot="endToBottom" class="end-tip">end...</div>
    </vueLazyWaterfall>


  </div>
</template>

<script>
  import vueLazyWaterfall from '../../src/vue-lazy-waterfall/index.vue'
  import axios from 'axios'

  export default {
    name: 'app',
    data() {
      return {
        items: [],
        group: 0,
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
            if (this.group > 20) {
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
      }
    },
    created() {
      this.loadData()
    },
  }
</script>

<style lang="less">
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
