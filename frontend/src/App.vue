<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <router-view><LogIn/></router-view>
  </div>
</template>

<script>
import LogIn from './components/LogIn';


export default {
  name: 'App',
  components: {
    LogIn
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
img{
  width: 10%;
  height: 4vw;
  object-fit: cover;
}
</style>
