<template>
  <div class="app">
    <div class="header"></div>
    <div class="content">
      <router-view></router-view>
    </div>
    <div class="footer"></div>
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
  background: #f5f7f9;
}
.header{
  height:30px;
  /* background-color: black; */
  width: 100%
}
.content {
  padding: 0 10px;
}
.footer {
  height: 30px;
  /* background: black; */
  width: 100%
}

</style>
