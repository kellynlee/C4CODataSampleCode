<template>
  <div class="app">
    <!-- <div class="content"> -->
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive"></router-view>
      </keep-alive>
      <router-view v-if="!$route.meta.keepAlive"></router-view>
    <!-- </div> -->
  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  }
}
</script>

<style>
@import 'https://cdn.bootcss.com/material-design-icons/3.0.1/iconfont/material-icons.css';

html {
  height: 100%;
}

body {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
.app,.content {
  height: 100%;
  width: 100%;
}

</style>
