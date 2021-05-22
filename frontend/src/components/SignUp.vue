<template>
  <div class="signUp">
    <form @submit.prevent="verif">
        <h1>S'inscrire</h1>
        <div class="user-image">
            <button class="btn-upload" for="image" :style="{'background-image': 'url(' + imageData + ')'}"></button>
            <input type="file" id="image" name="new_user_image" @change="previewImage" accept="image/*">
        </div>
        <div>
            <label for="firstname">Prénom</label>
            <input type="text" id="firstname" name="new_user_firstname" v-model="post.firstname">
        </div>
        <div>
            <label for="lastname">Nom</label>
            <input type="text" id="lastname" name="new_user_lastname" v-model="post.lastname">
        </div>
        <div>
            <label for="birthdate">Date de naissance</label>
            <input type="date" id="birthdate" name="new_user_birthdate" v-model="post.birthdate">
        </div>
        <div>
            <label for="email">Email</label>
            <input type="text" id="email" name="new_user_email" v-model="post.email">
        </div>
        <div>
            <label for="password">Mot de passe</label>
            <input type="password" id="passwordCreation" name="new_user_password" v-model="post.password">
            <p v-if="data.status === 403">{{ errorPassword }}</p>
        </div>
        <div>
            <label for="passwordConfirmation">Confirmer le mot de passe</label>
            <input type="password" id="passwordConfirmation" name="new_user_password_confirmation">
            <p v-show="error.passwordNotDiff">Les mots de passes sont différents</p>
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
  data() {
      return {
          post: {},
          data: {
              status:'',
              message:''
          },
          error: {
              passwordNotDiff: false,
          },
          imageData: "http://localhost:3000/images/users/default.jpg"
      };
  },
  computed: {
      errorPassword: function(){
          return this.data.message.replace('"', '').replace('"', '');
      }
  },
  methods: {
      async previewImage() {
        var input = event.target;
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = (e) => {
                this.imageData = e.target.result;
            }
            reader.readAsDataURL(input.files[0]);
        }
      },
      async verif(){
          const verifPassword = document.getElementById('passwordConfirmation').value;
          if( verifPassword === this.post.password){
              this.createUser();
          } else {
              this.error.passwordNotDiff = true;
          }
      },
      async createUser() {
          const formData = new FormData();
          const image = document.getElementById('image').files[0];
          formData.append("user", JSON.stringify(this.post));
          formData.append("image", image);
          const request = new Request(
              "http://localhost:3000/api/auth/signup",
              {
                  method:  "POST",
                  mode: "cors",
                  body: formData
              }
          );
          fetch(request)
            .then(res => {
                this.data.status = res.status;
                return res.text()
            })
            .then(res => this.data.message = res)
            .then(() => this.connectUser())
            .catch(error => this.data = error)
      },
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
              this.$router.push({name: "homePage"})
          }
      }
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

.btn-upload{
    background-position: center;
    border-radius:50%;
    width: 15vw;
    height: 15vw;
    background-size: cover;
    margin:0 31%;
}

.user-image{
    display:inline-block;
    position: relative;
    overflow: hidden;
    width: 100%;
    margin:0;
}

.user-image input[type=file]{
    left:31%;
    top: 0;
    bottom: 0;
    right: 0;
    opacity:0;
    position: absolute;
    width: 15vw;
    height: 15vw;
}

</style>