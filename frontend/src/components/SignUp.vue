<template>
  <div class="signUp">
    <form action="">
        <h1>S'inscrire</h1>
        <div>
            <label for="image">Photo de profil:</label>
            <input type="button" id="image" name="new_user_image" value="ajouter une image">
        </div>
        <div>
            <label for="firstname">Prénom:</label>
            <input type="text" id="firstname" name="new_user_firstname">
        </div>
        <div>
            <label for="lastname">Nom:</label>
            <input type="text" id="lastname" name="new_user_lastname">
        </div>
        <div>
            <label for="birthdate">Date de naissance:</label>
            <input type="text" id="birthdate" name="new_user_birthdate">
        </div>
        <div>
            <label for="email">Email:</label>
            <input type="text" id="emailCreation" name="new_user_email">
        </div>
        <div>
            <label for="password">Mot de passe:</label>
            <input type="text" id="passwordCreation" name="new_user_password">
        </div>
        <div>
            <label for="passwordConfirmation">Confirmer le mot de passe:</label>
            <input type="text" id="passwordConfirmation" name="new_user_password_confirmation">
        </div>
        <div id="logInOrSignUp">
            <button type="submit">Créer son compte</button>
            <router-link to="/login">Déjà inscrit</router-link>
        </div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'LogIn',
  props: {
    msg: String
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.signUp{
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