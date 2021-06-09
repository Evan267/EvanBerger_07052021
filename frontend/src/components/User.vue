<template>
    <div class="mainPage">
        <nav class="user">
            <div class="deroulant">
                <div class="user__info">
                    <img :src="userGet.user.image" alt="Photo de l'utilisateur" class="user__img">
                    <h2 class="user__fullname">{{ fullname }}</h2>
                </div>
                <ul class="sous">
                    <li><router-link :to="{ name: 'publications-by-user', params: { userId: userId }}" class="user__btn" >Vos publications</router-link></li>
                    <li><router-link :to="{ name: 'user-profil', params: { userId: userId }}" class="user__btn">Votre Profil</router-link></li>
                    <li><router-link :to="{ name: 'homePage'}" class="user__btn">Fil d'actualités</router-link></li>
                </ul>
            </div>
        </nav>
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
          userGet: {
              user: {
                  firstname:'',
                  lastname:'',
                  image:''
              }
          },
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
          const url = "http://localhost:3000/api/auth/" + localStorage.userId + "/" + localStorage.userId;
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
          fetch(request)
            .then(res => {
                if(res.status === 401){
                    this.$router.push({name: "login"})
                }else{
                    return res.json()
                }
            })
            .then(data => this.userGet = data)
            .catch(error=> console.log(error))
      }
  }
}

</script>

<style scoped lang="scss">
.mainPage{
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: 1vw;
    margin-top: 3vw;
    &__deconnect{
        position:absolute;
    }
    @media screen and (min-width: 700px){
        grid-template-columns: 25vw 70vw;
    }
    @media screen and (min-width: 1000px){
        grid-template-columns: 24vw 50vw 24vw;
    }
}

ul{
    list-style-type:none;
    padding:0;
}

.deroulant{
    background-color:white;
}

.sous{
    display:none;
    margin:0;
    position: absolute;
    background-color:white;
    z-index:100;
    width: 96%;
    box-shadow: 0 1px 2px grey;
    border-radius: 0 0 5vw 5vw;
    @media screen and (min-width: 700px){
        display:block;
        box-shadow: none;
        border-radius: none;
        width: auto;
    }
}

nav div:hover {
    background-color:#2C3F5122;
    border-radius: 5vw 5vw 0 0;
    @media screen and (min-width: 700px){
        background-color:transparent;
        border-radius:none;
    }
    .user__info{
        border-bottom: 2px solid #2C3F51;
        @media screen and (min-width: 700px){
            border-color: transparent;
        }
    }
    .sous{
        display:block;
    }
}

.user{
    margin: 1vw 0 7vw;
    display:flex;
    flex-direction:column;
    @media screen and (min-width: 700px){
        margin: 1vw 6vw 7vw;
    }
    &__info{
        display:  flex;
        justify-content: center;
        align-items:center;
        padding:3vw 0;
        margin:0;
        border-bottom: 2px solid transparent;
        @media screen and (min-width: 700px){
            display:block;
            padding:0;
        }
    }
    &__img{
        width:12vw;
        height:12vw;
        border-radius:50%;
        border: 1px solid #2C3F51;
        object-fit: cover;
        margin-right:3vw;
    }
    &__fullname{
        margin: 1vw 0 0.5vw;
        font-size:1.3em;
        font-weight: bold;
        @media screen and (min-width: 1800px){
            font-size: 1.8em;
        }
    }
    &__btn{
        display:block;
        background-color: transparent;
        width:100%;
        font-size: 1.2em;
        color:#2C3F51;
        border:none;
        padding: 2vw 0;
        text-align: center;
        margin-bottom: 0.3vw;
        cursor:pointer;
        border-radius: 0 1vw 1vw 0;
        text-decoration: none;
        @media screen and (min-width: 700px){
            text-align: start;
            padding: 0 0.6vw;
        }
        @media screen and (min-width: 1800px){
            font-size: 1.6em;
        }
    }
    @media screen and (min-width: 700px){
        margin: 1vw 1vw;
    }
    @media screen and (min-width: 1000px){
        margin: 1vw 3vw;
    }
    @media screen and (min-width: 1300px){
        margin: 1vw 6vw;
    }
}

.user__btn:hover{
    background-color: #2C3F5122;
}

</style>
