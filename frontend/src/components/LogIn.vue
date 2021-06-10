<template>
  <div class="logIn">
    <form @submit.prevent="connectUser">
        <h1>Se connecter</h1>
        <div>
            <p v-show="error" class="text-danger">L'adresse mail ou le mot de passe sont invalides.</p>
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
          localStorage.setItem('isAdmin', data.isAdmin);
          if(localStorage.token !== "undefined"){
              this.$router.push({name: "homePage"})
          }else{
              this.error = true;
          }
      }
  }
}


</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.logIn{
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    margin:0;
}

.text-danger{
    color: #9E0000;
    font-size: 0.8em;
    text-align: center;
}

a{
    color:#2C3F51;
    text-decoration:none;
    cursor:pointer;
    &:hover{
        opacity:40%;
    }
    @media screen and (min-width: 1900px){
        font-size:0.9em;
    }
}

button{
    background-color:#2C3F51;
    color:white;
    padding:3vw 4vw;
    border-radius:5vw;
    border:none;
    cursor:pointer;
    &:hover{
        opacity:70%;
    }
    @media screen and (min-width: 700px){
        padding:2vw 3vw;
        border-radius:4vw;
    }
    @media screen and (min-width: 1000px){
        padding:1.5vw 2vw;
        border-radius:3vw;
    }
    @media screen and (min-width: 1900px){
        padding:1vw 1.5vw;
        border-radius:2vw;
        font-size:0.9em;
    }
}

form{
    width: 100%;
    @media screen and (min-width: 700px){
        width:70%;
    }
    @media screen and (min-width: 1000px){
        width:50%;
    }
    @media screen and (min-width: 1900px){
        width:35%;
        font-size:2em;
    }
}

input{
    @media screen and (min-width: 1900px){
        font-size:0.8em;
    }
}


div{
    display: flex;
    flex-direction: column;
    margin: 2vw 10%;
    @media screen and (min-width: 1900px){
        margin: 1vw 10%;
    }
}

#logInOrSignUp{
    flex-direction: row;
    justify-content: space-evenly;
    align-items:center;
    margin-top:8vw;
    @media screen and (min-width: 700px){
        margin-top:4vw;
    }
    @media screen and (min-width: 1000px){
        margin-top:3vw;
    }
    @media screen and (min-width: 1900px){
        margin-top:2vw;
    }
}

</style>