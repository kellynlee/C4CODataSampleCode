<template>
  <div class="app">
    <div class="content">
      <router-view></router-view>
    </div>
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
.app {
  height: 100%;
  width: 100%;
}

</style>
