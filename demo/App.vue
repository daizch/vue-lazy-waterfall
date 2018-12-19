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
      return {}
    },
    components: {
      vueLazyWaterfall
    },
    methods: {
      backToTopHandler() {
        window.scrollTo(0, 0)
      }
    }
  }
</script>

<style lang="less">
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

  .loading-spinner {
    height: 120px;
    &:before {
      content: ' ';
      position: absolute;
      z-index: 1000;
      display: block;
      width: 100px;
      height: 100px;
      background: url("./static/images/loading-spinner.png") no-repeat;
      animation: rotateAnim 1.5s linear infinite;
      background-size: 100%;
      margin-left: 49%;
      margin-top: 20px;
    }
  }

  @keyframes rotateAnim {
    0% {
      transform: rotate(0)
    }
    50% {
      transform: rotate(-180deg)
    }
    100% {
      transform: rotate(-360deg)
    }
  }
</style>
