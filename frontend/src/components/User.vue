<template>
    <div class="mainPage">
        <div class="user">
            <img :src="userGet.user.image" alt="Photo de l'utilisateur" class="user__img">
            <p class="user__fullname">{{ fullname }}</p>
            <router-link :to="{ name: 'user-publication', params: { userId: userId }}" class="user__btn" >Vos publications</router-link>
            <router-link :to="{ name: 'user-profil', params: { userId: userId }}" class="user__btn">Votre Profil</router-link>
            <router-link :to="{ name: 'homePage'}" class="user__btn">Fil d'actualités</router-link>
        </div>
        <div class="mainPage__router-view">
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
export default {
  name: 'User',
  data() {
      return {
          userId: localStorage.userId,
          post: {},
          userGet: {},
      };
  },
  computed: {
      fullname: function(){
          return this.userGet.user.firstname  + ' ' +  this.userGet.user.lastname;
      }
  },
  created (){
      this.getUserData();
  },
  methods: {
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
          this.userGet = data;
      }
  }
}

</script>

<style scoped lang="scss">
.mainPage{
    display: grid;
    grid-template-columns: 24vw 50vw 24vw;
    grid-gap: 1vw;
    margin-top: 3vw;
}

.user{
    margin: 1vw 6vw;
    display:flex;
    flex-direction:column;
    &__img{
        width:12vw;
        height:12vw;
        border-radius:50%;
        border: 1px solid #2C3F51;
    }
    &__fullname{
        margin: 1vw 0 0.5vw;
        font-size:1.3em;
        font-weight: bold;
    }
    &__btn{
        background-color: transparent;
        font-size: 1.2em;
        color:#2C3F51;
        border:none;
        padding: 0 0.4vw;
        text-align: start;
        margin-bottom: 0.3vw;
        cursor:pointer;
        border-radius: 0 1vw 1vw 0;
        text-decoration: none;
    }
}

.user__btn:hover{
    background-color: #2C3F5122;
}

</style>
