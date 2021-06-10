<template>
  <div class="signUp">
    <form @submit.prevent="verif" name="signUpForm">
        <h1>S'inscrire</h1>
        <div><label for="image">Photo de profil</label></div>
        <div class="user-image">
            <button class="btn-upload" for="image" :style="{'background-image': 'url(' + imageData + ')'}">Image</button>
            <input type="file" id="image" name="new_user_image" @change="previewImage" accept="image/*">
        </div>
        <div>
            <label for="firstname">Prénom</label>
            <input type="text" id="firstname" name="new_user_firstname" v-model="post.firstname" required aria-required="true" pattern="[A-Z,a-z,-]{1,}">
            <span class="text-danger"></span>
        </div>
        <div>
            <label for="lastname">Nom</label>
            <input type="text" id="lastname" name="new_user_lastname" v-model="post.lastname" required aria-required="true" pattern="[A-Z,a-z,-]{1,}">
            <span class="text-danger"></span>
        </div>
        <div>
            <label for="birthdate">Date de naissance</label>
            <input type="date" id="birthdate" name="new_user_birthdate" v-model="post.birthdate" required aria-required="true">
            <span class="text-danger"></span>
        </div>
        <div>
            <label for="email">Email</label>
            <input type="text" id="email" name="new_user_email" v-model="post.email" required aria-required="true"  pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$">
            <span class="text-danger"></span>
        </div>
        <div>
            <label for="password">Mot de passe</label>
            <input type="password" id="password" name="new_user_password" required aria-required="true" v-model="post.password" pattern="(?=.*\d)(?=.*[!@#$&*])(?=.*[a-z])(?=.*[A-Z]).{6,}">
            <span class="text-danger"></span>
        </div>
        <div>
            <label for="passwordConfirmation">Confirmer le mot de passe</label>
            <input type="password" id="passwordConfirmation" name="new_user_password_confirmation" aria-required="true">
            <p v-show="error.passwordNotDiff" class="text-danger">Les mots de passes sont différents</p>
        </div>
        <div id="logInOrSignUp">
            <button type="submit" id="submit">Créer son compte</button>
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
  mounted() {
      this.verifInput();
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
      async verifInput(){
        let form = document.forms['signUpForm'];
        let formLength = form.elements.length - 1;
        let errorMessage = [
            "Ce champ ne doit comporter que des lettres ou des tirets. Ex: Eric, Adeline...",
            "Ce champ ne doit comporter que des lettres. Ex: Griezmann, Pogba...",
            "Ce champ doit respecter le fomat suivant: JJ/MM/AAAA.",
            "Ce champ doit respecter le format des adresses mails. Ex: exemple@gmail.com...",
            "Le mot de passe doit contenir au moins 1 majuscule, 1 minuscule, 1 chiffre, 1 caractère spécial et au moins 6 caractères."
        ];

        for(let i = 0; i < formLength - 3; i++){
            let element = form.elements[i+2];
            let missValue = element.parentNode.querySelector("span");
            element.onchange = function(e) {
                e.preventDefault();
                missValue.textContent = '';
                if (!e.target.validity.valid) {
                    if (e.target.value.length == 0) {
                        missValue.textContent = "Veuillez renseigner le champ"
                    } else {
                        missValue.textContent = errorMessage[i];
                    }
                }
            };
            element.oninvalid = function(e) {
                e.preventDefault();
                missValue.textContent = '';
                if (!e.target.validity.valid) {
                    if (e.target.value.length == 0) {
                        missValue.textContent = "Veuillez renseigner le champ"
                    } else {
                        missValue.textContent = errorMessage[i];
                    }
                }
            }
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
          if(localStorage.token !== "undefined"){
              this.$router.push({name: "homePage"})
          }
      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.signUp{
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    margin:0;
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

div{
    display: flex;
    flex-direction: column;
    margin: 2vw 10%;
    @media screen and (min-width: 1900px){
        margin: 1vw 10%;
    }
}

input{
    @media screen and (min-width: 1900px){
        font-size:0.8em;
    }
}

.text-danger{
    color: #9E0000;
    font-size: 0.8em;
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

#imageLabel{
    display:block;
    padding: 0 10%;
}

.btn-upload{
    background-position: center;
    border-radius:50%;
    width: 35vw;
    height: 35vw;
    background-size: cover;
    margin:0 31%;
    @media screen and (min-width: 700px){
        width: 25vw;
        height: 25vw;
    }
    @media screen and (min-width: 1000px){
        width: 20vw;
        height: 20vw;
    }
    @media screen and (min-width: 1900px){
        width: 14vw;
        height: 14vw;
    }
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
    width: 35vw;
    height: 35vw;
    cursor:pointer;
    @media screen and (min-width: 700px){
        width: 25vw;
        height: 25vw;
    }
    @media screen and (min-width: 1000px){
        width: 20vw;
        height: 20vw;
    }
    @media screen and (min-width: 1900px){
        width: 14vw;
        height: 14vw;
    }
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

#submit{
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

</style>