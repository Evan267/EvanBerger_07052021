<template>
    <div>
      <div class="userPublications">
          <h1>Publications de {{ userGet.user.firstname }} {{ userGet.user.lastname }}</h1>
          <img :src="imageData" alt="Image de  l'utilisateur qui a créé les publications suivantes" class="userPublications__img">
      </div>
      <div id="publications">
        <ul>
            <li v-for="(item, index) in dataGet.publication" v-bind:key="item.id" class="publication">
                <div class="publication__user">
                    <img :src="item.user.image" :alt='"photo utilisateur qui a créé la publication n°" + (index+1)'>
                    <div>
                        <h2 class="publication__user__fullname">{{ item.user.firstname }} {{ item.user.lastname }}</h2>
                        <p class="publication__user__date">{{ date(item.createdAt) }}</p>
                    </div>
                </div>
                <p class="publication__text">{{ item.text }} </p>
                <router-link :to="{name: 'publication-details', params: { id: item.id }}"><img :src="item.image" class="publication__img" :alt="'GIF de la publication n°' + (index+1)"></router-link>
                <div class="publication__commentsAndLikes">
                    <router-link :to="{name: 'publication-details', params: { id: item.id }}"  class="publication__commentsAndLikes__comments"> {{ item.comments.length }} commentaires </router-link>
                    <div id="likedislike">
                        <div v-if="userLiked[index] == false">
                            <button class="publication__commentsAndLikes__like" @click="Like(item.id)">J'aime</button>
                        </div>
                        <div v-else>
                            <button class="publication__commentsAndLikes__like" @click="Dislike(item.id)">Je  n'aime plus</button>
                        </div>
                        <div class="publication__commentsAndLikes__countLikes">
                            <p>{{ item.likes.length }}<i class="fas fa-heart"></i></p>
                        </div>
                    </div>
                </div>
            </li>
        </ul>
      </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'PublicationsByUser',
  data() {
      return {
          postCreate: '',
          dataCreate: {},
          dataGet: {},
          userGet:{
              user: {
                firstname: '',
                lastname: '',
              }
          },
          imageData:'',
          userLiked: []
      };

  },
  beforeMount () {
      this.getUserData();
      this.getUserPublications();
  },
  computed: {
      ...mapState(["user"])
  },
  methods: {
      date(date){
          let dateFormat = new Date(date);
          let dateParse = Number(dateFormat);
          let now = Number(new Date());
          let diff = now - dateParse;
            if (diff > 604800000){
                return dateFormat.getDate() + "/" + (dateFormat.getMonth() + 1) + "/" + dateFormat.getFullYear();
            } else if (diff > 86400000) {
              let j = diff / 86400000;
              let timeDays = Math.round(j) + "j";
              return timeDays;
            } else if (diff > 3600000) {
              let h = diff / 3600000;
              let timeHours = Math.round(h) + "h";
              return timeHours;
            } else if (diff > 60000) {
              let m = diff / 60000;
              let timeMinutes = Math.round(m) + "min";
              return timeMinutes;
            } else if (diff > 1000) {
              let s = diff / 1000;
              let timeSeconds = Math.round(s) + "s";
              return timeSeconds;
            } else {
              return "1s";
            }
      },
      async Like(publicationId){
          const url = "http://localhost:3000/api/publications/" + publicationId + "/likes";
          const  myHeader = new Headers({ "Content-Type": "application/json", "Authorization": "Basic " + localStorage.getItem("token")});
          const request = new Request(
              url,
              {
                  method:  "POST",
                  headers: myHeader,
                  mode: "cors",
                  cache: "default",
              }
          );
          fetch(request)
          .then(res => res.text())
          .then(json => console.log(json))
          .catch(error => console.log(error));
          await this.getUserPublications();
      },
      async Dislike(publicationId){
          const url = "http://localhost:3000/api/publications/" + publicationId + "/likes";
          const  myHeader = new Headers({ "Content-Type": "application/json", "Authorization": "Basic " + localStorage.getItem("token")});
          const request = new Request(
              url,
              {
                  method:  "DELETE",
                  headers: myHeader,
                  mode: "cors",
                  cache: "default",
              }
          );
          fetch(request)
          .then(res => res.text())
          .then(json => console.log(json))
          .catch(error => console.log(error));
          await this.getUserPublications();
      },
      async getUserData() {
          const url = "http://localhost:3000/api/auth/" + this.$route.params.userId;
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
          this.imageData = this.userGet.user.image;
      },
      async getUserPublications() {
          const url = "http://localhost:3000/api/publications/user/" + this.$route.params.userId;
          const  myHeader = new Headers({'Content-Type': 'application/json', 'Authorization': 'Basic ' + localStorage.getItem('token')});
          const request = new Request(
              url,
              {
                  method:  "GET",
                  headers: myHeader,
                  mode: "cors",
              }
          );
          fetch(request)
            .then(res => res.json())
            .then(data => this.dataGet = data)
            .then(() => {
                this.userLiked = [];
                for(let i = 0; i < this.dataGet.publication.length; i++){
                    this.userLiked.push(false);
                    for(let x = 0; x < this.dataGet.publication[i].likes.length; x++){
                        if(this.dataGet.publication[i].likes[x].usersLiked == this.user){
                            this.userLiked[i] = true;
                        }
                    }
                }
            })
            .catch(error=> console.log(error));
          this.$store.commit('modif', false);
      }
  }
}
</script>


<style scoped lang="scss">
ul{padding:0}

li{list-style: none;}

p{margin: 0;}
a{color:#2C3F51; text-decoration:none}
button{cursor:pointer}

.userPublications{
    display:flex;
    flex-direction: column;
    align-items: center;
    text-align:center;
    &__img{
        width:25vw;
        height:25vw;
        border-radius:50%;
        border: 1px solid #2C3F51;
        object-fit: cover;
        @media screen and (min-width: 1000px){
            width:15vw;
            height:15vw;
        }
    }
}

.publication{
    box-shadow: none;
}



#publications{
    width: 100%;
    margin:0;
    box-shadow: none;
    ul{
        display:flex;
        flex-direction:column-reverse;
    }
}

.publication {
    border-radius: 3vw;
    box-shadow: 0px 0px 8px grey;
    margin:3vw 0;
    @media screen and (min-width: 700px){
        border-radius: 1.5vw;
        margin:1vw 0;
    }
    @media screen and (min-width: 1000px){
        border-radius: 0.5vw;
    }
    &__user{
        display:flex;
        padding: 3vw 3vw;
        margin-bottom: 3vw;
        text-decoration: none;
        @media screen and (min-width: 700px){
            padding: 1.5vw 1.5vw;
            margin-bottom: 1vw;
        }
        @media screen and (min-width: 1000px){
            padding: 0.7vw 0.7vw;
            margin-bottom: 1vw;
        }
        &:hover{
            opacity:50%;
        }
        img{
            border-radius: 50%;
            box-shadow: 0px 0px 2px grey;
            width: 12vw;
            height:12vw;
            margin-right: 3vw;
            object-fit: cover;
            @media screen and (min-width: 700px){
                width: 5vw;
                height:5vw;
                margin-right: 1.5vw;
            }
            @media screen and (min-width: 1000px){
                width: 4vw;
                height:4vw;
                margin-right: 1vw;
            }
            @media screen and (min-width: 1450px){
                width: 3vw;
                height:3vw;
            }
        }
        &__fullname{
            font-weight: bold;
            font-size: 1.1em;
            margin: 0;
            @media screen and (min-width: 1900px){
                font-size: 1.5em;
            }
        }
        &__date{
            font-size: 0.9em;
            @media screen and (min-width: 1900px){
                font-size: 1.1em;
            }
        }
    }
    &__text{
        padding: 6vw;
        @media screen and (min-width: 700px){
            padding: 3vw;
        }
        @media screen and (min-width: 1000px){
            padding: 2vw;
        }
        @media screen and (min-width: 1800px){
            padding: 1vw;
            font-size:1.2em
        }
    }
    &__img{
        width: 100%;
        height: auto;
        box-shadow: 0px 0px 3px grey;
        object-fit: contain;
    }
    &__commentsAndLikes{
        display: flex;
        border-top: 0.5px solid grey;
        align-items: center;
        padding: 2vw 0;
        font-size: 0.8em;
        @media screen and (min-width: 700px){
            padding: 0;
            font-size: 1em;
        }
        @media screen and (min-width: 1400px){
            font-size: 1.2em;
        }
        @media screen and (min-width: 1800px){
            font-size: 1.5em;
        }
        div{
            width:50%;
            display: flex;
            justify-content: space-evenly;
            padding: 0.5vw;
        }
        button{
            border:none;
            background-color:transparent;
        }
        &__comments{
            width:50%;
            text-align: center;
            height:100%;
            &:hover{
                opacity:50%;
            }
        }
        &__like{
            font-size:1em;
            color:#2C3F51;
            &:hover{
                opacity: 50%;
            }
        }
        &__countLikes{
            margin: auto 0;
            i{
                font-size: 1.05em;
                margin-left:1vw;
            }
        }
    }
}

</style>