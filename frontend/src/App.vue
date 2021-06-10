<template>
  <div id="app">
    <header class="header">
      <img class="header__logo" alt="Vue logo" src="./assets/logo.png">
      <button class="header__btn" @click.prevent="deconnect">Déconnexion</button>
    </header>
    <router-view></router-view>
  </div>
  
</template>

<script>
export default {
  name: 'App',
  methods:{
    async deconnect(){
      localStorage.clear();
      this.$router.push({name: "login"});
    }
  }
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

.header{
  display:flex;
  justify-content: space-between;
  &__logo{
    width: 40%;
    height: 10vw;
    object-fit: cover;
    @media screen and (min-width: 700px){
      width: 20%;
      height: 5vw;
    }
    @media screen and (min-width: 1000px){
      width: 10%;
      height: 5vw;
    }
  }
  &__btn{
    background-color:transparent;
    border:none;
    cursor:pointer;
    @media screen and (min-width: 1800px){
      font-size:1.4em;
    }
    &:hover{
      opacity:40%;
    }
  }
}
</style>
