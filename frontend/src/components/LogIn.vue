<template>
  <div class="logIn">
    <form @submit.prevent="connectUser">
        <h1>Se connecter</h1>
        <div>
            <p v-show="error">L'adresse mail ou le mot de passe sont invalides.</p>
            <label for="email">Email:</label>
            <input type="text" id="email" name="user_email" v-model="post.email">
        </div>
        <div>
            <label for="passwordConnect">Mot de passe:</label>
            <input type="password" id="passwordConnect" name="user_password" v-model="post.password">
        </div>
        <div id="logInOrSignUp">
            <router-link to="/signup">S'inscrire</router-link>
            <button type="submit">Se connecter</button>
        </div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'LogIn',
  data() {
      return {
          post: {},
          data: {},
          error: false
      };
  },
  methods: {
      async connectUser() {
          const  myHeader = new Headers({'Content-Type': 'application/json'});
          const request = new Request(
              "http://localhost:3000/api/auth/login",
              {
                  method:  "POST",
                  headers: myHeader,
                  mode: "cors",
                  cache: "default",
                  body: JSON.stringify(this.post)
              }
          );
          const res  = await fetch(request);
          const data = await res.json();
          localStorage.setItem('token', data.token);
          localStorage.setItem('userId', data.userId);
          console.log(localStorage);
          if(localStorage.token !== "undefined"){
              this.$router.push({name: "publications"})
          }else{
              this.error = true;
          }
      }
  }
}


</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.logIn{
    display: flex;
    flex-direction: column;
    align-items: center;
}

form{
    width: 50%;
}


div{
    display: flex;
    flex-direction: column;
    margin: 2vw 10%;
}

#logInOrSignUp{
    flex-direction: row;
    justify-content: space-evenly;
}

</style>