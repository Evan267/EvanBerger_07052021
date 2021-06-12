<template>
  <div class="userPage"> 
    <form @submit.prevent="verif" name="profilForm">
        <div class="formProfil__header">
            <h1>Profil</h1>
            <button class="formProfil__header__btn" type="button" @click="activate()">Modifier<i class="fas fa-pencil-alt"></i></button>
            <button class="formProfil__header__deleteUser" type="button" @click="deleteUser()">Supprimer le compte</button>
        </div>
        <div class="formProfil__input"><label for="image">Photo de profil</label></div>
        <div class="formProfil__user-image">
            <button class="btn-upload" for="image" :style="{'background-image': 'url(' + imageData + ')'}">Ajouter image</button>
            <input type="file" id="image" name="new_user_image" @change="previewImage" accept="image/*" disabled>
        </div>
        <div class="formProfil__input">
            <label for="firstname">Prénom</label>
            <input type="text" id="firstname" name="user_firstname" v-model="userPut.user.firstname" readonly required aria-required="true" pattern="[A-Z,a-z,-]{1,}" maxlength='25'>
            <span class="text-danger"></span>
        </div>
        <div class="formProfil__input">
            <label for="lastname">Nom</label>
            <input type="text" id="lastname" name="user_lastname" v-model="userPut.user.lastname" readonly required aria-required="true" pattern="[A-Z,a-z,-]{1,}" maxlength='25'>
            <span class="text-danger"></span>
        </div>
        <div class="formProfil__input">
            <label for="birthdate">Date de naissance</label>
            <input type="date" id="birthdate" name="user_birthdate" v-model="userPut.user.birthdate" readonly required aria-required="true">
            <span class="text-danger"></span>
        </div>
        <div class="formProfil__input">
            <label for="email">Email</label>
            <input type="text" id="email" name="new_user_email" v-model="userPut.user.email" readonly required aria-required="true" pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$">
            <span class="text-danger"></span>
        </div>
        <div class="formProfil__input">
            <label for="passwordCreation">Mot de passe</label>
            <input type="password" id="passwordCreation" name="new_user_password" v-model="userPut.user.password" placeholder="********" readonly pattern="(?=.*\d)(?=.*[!@#$&*])(?=.*[a-z])(?=.*[A-Z]).{6,}">
            <span class="text-danger"></span>
        </div>
        <div class="formProfil__input">
            <label for="passwordConfirmation">Confirmer le mot de passe</label>
            <input type="password" id="passwordConfirmation" name="new_user_password_confirmation" placeholder="********" readonly>
            <p v-show="error.passwordNotDiff">Les mots de passes sont différents</p>
        </div>
        <div class="formProfil__valid">
            <button id="reinit" type="button" @click="reinit()" disabled>Réinitialiser</button>
            <button id="valid" type="submit" disabled>Valider</button>
        </div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'UserProfil',
  data() {
      return {
          userId: localStorage.userId,
          userPut: {
              user: {
                  firstname: '',
              }
          },
          userDelete:{},
          messageModif:{},
          imageData: '',
          error: {
              passwordNotDiff: false
          }
      };
  },
  beforeMount (){
      this.getUserData();
  },
  methods: {
      async activate(){
          const input = document.getElementsByTagName('input');
          const button = document.getElementsByTagName('button');
          for (let i=0; i < input.length; i++){
              input[i].readOnly = false;
              input[i].disabled = false;
          }
          for (let i=0; i < button.length; i++){
              button[i].disabled = false;
          }
          await this.verifInput();
      },
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
      async reinit() {
          this.$router.go();
      },
      async verifInput(){
        let form = document.forms['profilForm'];
        let formLength = form.elements.length - 1;
        let errorMessage = [
            "Ce champ ne doit comporter que des lettres ou des tirets. Ex: Eric, Adeline...",
            "Ce champ ne doit comporter que des lettres. Ex: Griezmann, Pogba...",
            "Ce champ doit respecter le fomat suivant: JJ/MM/AAAA.",
            "Ce champ doit respecter le format des adresses mails. Ex: exemple@gmail.com...",
            "Le mot de passe doit contenir au moins 1 majuscule, 1 minuscule, 1 chiffre, 1 caractère spécial et au moins 6 caractères."
        ];

        for(let i = 0; i < formLength - 6; i++){
            let element = form.elements[i+4];
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
          if(this.userPut.user.password == undefined || verifPassword === this.userPut.user.password){
            await this.putUserData();
          } else {
              this.error.passwordNotDiff = true;
          }
      },
      async putUserData() {
          if(this.userPut.user.password == undefined){
              delete this.userPut.user.password;
          }
          delete this.userPut.user.image;
          const formData = new FormData();
          const image = document.getElementById('image').files[0];
          formData.append("user", JSON.stringify(this.userPut));
          formData.append("image", image);
          const url = "http://localhost:3000/api/auth/";
          const myHeader = new Headers({"Authorization": "Basic " + localStorage.getItem("token")});
          const request = new Request(
              url,
              {
                  method:  "PUT",
                  headers: myHeader,
                  mode: "cors",
                  body: formData
              }
          );
          const res  = await fetch(request);
          const data = await res.text();
          this.messageModif = data;
          this.$router.go();
      },
      async getUserData() {
          const url = "http://localhost:3000/api/auth/";
          const myHeader = new Headers({'Content-Type': 'application/json',"Authorization": "Basic " + localStorage.getItem("token")});
          const request = new Request(
              url,
              {
                  method:  "GET",
                  headers: myHeader,
                  mode: "cors",
                  cache: "default",
              }
          );
          const res  = await fetch(request);
          const data = await res.json();
          this.userPut = data;
          this.imageData = this.userPut.user.image;
      },
      async deleteUser(){
          let r = confirm("Voulez-vous vraiment supprimer votre profil ?")
          if(r == true){
            console.log('suppression du compte');
            const url = "http://localhost:3000/api/auth/";
            const myHeader = new Headers({'Content-Type': 'application/json',"Authorization": "Basic " + localStorage.getItem("token")});
            const request = new Request(
                url,
                {
                    method:  "DELETE",
                    headers: myHeader,
                    mode: "cors",
                    cache: "default",
                }
            );
            const res  = await fetch(request);
            const data = await res.json();
            this.userDelete = data;
            this.$router.push({name: "login"})
          } else {
              console.log('rien');
          }
      }
  }
}

</script>

<style scoped lang="scss">

button{
    cursor:pointer;
}

.text-danger{
    color: #9E0000;
    font-size: 0.8em;
}

.formProfil{
    margin: 0 2vw;
    @media screen and (min-width: 700px){
        margin: 0 7vw;
    }
    &__header{
        display:flex;
        flex-direction: row;
        margin:0;
        align-items: center;
        &__btn{
            background-color:transparent;
            border:none;
            height:min-content;
            width:min-content;
            font-weight:1.2em;
            margin:0 1vw;
            color: #2C3F51;
            &:hover{
                color: #2C3F5133;
            }
        }
        &__deleteUser{
            box-shadow: 0 0 2px black;
            margin-left: 25vw;
            background-color: #9E0000;
            color:white;
            border:none;
            border-radius: 2vw;
            @media screen and (min-width: 700px){
                margin-left: 27vw;
            }
            @media screen and (min-width: 1000px){
                margin-left: 21vw;
            }
            @media screen and (min-width: 1350px){
                margin-left: 27vw;
            }
            @media screen and (min-width: 1800px){
                margin-left: 35vw;
            }
            &:hover{
                box-shadow: 0 0 4px black;
            }
        }
    }
    &__user-image{
        width: 100%;
        display:inline-block;
        position: relative;
        overflow: hidden;
        margin:0 auto;
        input[type=file]{
            left:31%;
            top: 0;
            bottom: 0;
            right: 0;
            opacity:0;
            position: absolute;
            width: 33vw;
            height: 33vw;
            cursor:pointer;
            @media screen and (min-width: 700px){
                width: 20vw;
                height: 20vw;
            }
            @media screen and (min-width: 1000px){
                width: 15vw;
                height: 15vw;
            }
        }
        .btn-upload{
            background-position: center;
            border-radius:50%;
            background-size: cover;
            margin:0 31%;
            width: 33vw;
            height: 33vw;
            cursor:pointer;
            @media screen and (min-width: 700px){
                width: 20vw;
                height: 20vw;
            }
            @media screen and (min-width: 1000px){
                width: 15vw;
                height: 15vw;
            }
        }
    }
    &__input{
        display: flex;
        flex-direction: column;
        margin: 2vw 10%;
        input:read-only{
            border: none
        }
    }
    &__valid{
        margin:0 0 0 22vw;
        display:flex;
        justify-content: center;
        #reinit{
            background-color: transparent;
            color: #2C3F51;
            border:none;
            &:hover{
                color: #2C3F5133;
            }
        }
        #valid{
            background-color: #2C3F51;
            color:white;
            border:none;
            padding:0.5vw 1vw;
            border-radius:1.5vw;
            font-size:1.2em;
            &:hover{
                box-shadow: 0 0 4px gray;
            }
        }
    }
}

</style>
