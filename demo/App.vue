<template>
  <div>
    <router-view></router-view>
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
      }
    },
    components: {
      vueLazyWaterfall
    },
    methods: {
      backToTopHandler(){
        window.scrollTo(0,0)
      }
    }
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
</style>
