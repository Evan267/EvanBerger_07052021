<template>
  <div class="userPage"> 
    <form class="formProfil" @submit.prevent="verif">
        <div class="formProfil__header">
            <h1>Profil</h1>
            <button class="formProfil__header__btn" type="button" @click="activate()"><i class="fas fa-pencil-alt"></i></button>
            <button class="formProfil__header__deleteUser" type="button" @click="deleteUser()">Supprimer le compte</button>
        </div>
        <div class="formProfil__user-image">
            <button class="btn-upload" for="image" :style="{'background-image': 'url(' + imageData + ')'}"></button>
            <input type="file" id="image" name="new_user_image" @change="previewImage" accept="image/*" disabled>
        </div>
        <div class="formProfil__input">
            <label for="firstname">Prénom</label>
            <input type="text" id="firstname" name="user_firstname" v-model="userPut.user.firstname" readonly>
        </div>
        <div class="formProfil__input">
            <label for="lastname">Nom</label>
            <input type="text" id="lastname" name="user_lastname" v-model="userPut.user.lastname" readonly>
        </div>
        <div class="formProfil__input">
            <label for="birthdate">Date de naissance</label>
            <input type="date" id="birthdate" name="user_birthdate" v-model="userPut.user.birthdate" readonly>
        </div>
        <div class="formProfil__input">
            <label for="email">Email</label>
            <input type="text" id="email" name="new_user_email" v-model="userPut.user.email" readonly>
        </div>
        <div class="formProfil__input">
            <label for="password">Mot de passe</label>
            <input type="password" id="passwordCreation" name="new_user_password" v-model="userPut.user.password" placeholder="********" readonly>
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
          userPut: {},
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
      async verif(){
          const verifPassword = document.getElementById('passwordConfirmation').value;
          if( verifPassword === this.userPut.user.password){
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
          console.log(image);
          const url = "http://localhost:3000/api/auth/" + localStorage.userId;
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
          console.log(this.messageModif);
          this.$router.go();
      },
      async getUserData() {
          const url = "http://localhost:3000/api/auth/" + localStorage.userId;
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
            const url = "http://localhost:3000/api/auth/" + localStorage.userId;
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
              console.log('rien')
          }
      }
  }
}

</script>

<style scoped lang="scss">

button{
    cursor:pointer;
}

.formProfil{
    margin: 0 7vw;
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
            justify-self: end;
            margin-left: 17vw;
            background-color: red;
            color:white;
            border:none;
            border-radius: 2vw;
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
            width: 15vw;
            height: 15vw;
            cursor:pointer;
        }
        .btn-upload{
            background-position: center;
            border-radius:50%;
            width: 15vw;
            height: 15vw;
            background-size: cover;
            margin:0 31%;
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
