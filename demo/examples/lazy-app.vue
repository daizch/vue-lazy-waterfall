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
      <div class="loading-spinner" slot="loading"></div>
      <template slot="endToBottom">
        <div class="end-tip">it is end...</div>
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
            self.$refs.waterfall.$on('preloaded', () => {
              console.log('load next')
              $loading.dataset.loaded = false
              observer.observe($loading)
            })
          },
          rootMargin: '500px',
          threshold: 1
        });
        observer.observe()
      }
    }
  }
</script>

<style>
  .wrap {
    margin: auto;
    width: 1190px;
  }
</style>
