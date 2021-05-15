<template>
  <div class="logIn">
    <form action="">
        <h1>Se connecter</h1>
        <div>
            <label for="email">Email:</label>
            <input type="text" id="email" name="user_email">
        </div>
        <div>
            <label for="password">Mot de passe:</label>
            <input type="text" id="password" name="user_password">
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