<template>
  <div class="publicationPage">
    <div>
        <router-link :to="{name: 'homePage'}" class="publicationPage__previous"><i class="fas fa-arrow-left"></i> Fil d'actualités</router-link>
    </div>
    <div class="publicationView">
        <div class="publication">
            <div class="publication__header">
                <router-link :to="{ name: 'publications-by-user', params: { userId: publicationUser.id }}" class="publication__user">
                    <img :src="publicationUser.image" alt="Image de l'utilisateur à l'origine de la publication">
                    <div>
                        <h1 class="publication__user__fullname">{{ fullname }}</h1>
                        <time class="publication__user__date">{{ date(dataGet.createdAt) }}</time>
                    </div>
                </router-link>
                <div v-if="user == publicationUser.id" class="publication__headerBtn">
                    <button class="publication__headerBtn__modify" v-on:click="activeModif()"><i class="fas fa-pencil-alt"></i> Modifier</button>
                    <button class="publication__headerBtn__delete" v-on:click="deletePublication()"><i class="fas fa-trash-alt"></i> Supprimer</button>
                </div>
                <div v-else-if="isAdmin == 'true'" class="publication__headerBtn">
                    <button class="publication__headerBtn__delete" v-on:click="deletePublication()"><i class="fas fa-trash-alt"></i> Supprimer</button>
                </div>
            </div>
            <div v-if="modif == false">
                <p class="publication__text">{{ dataGet.text }} </p>
                <img :src="dataGet.image" alt="GIF publié" class="publication__img">
                <div class="publication__commentsAndLikes">
                    <p class="publication__commentsAndLikes__comments"> {{ commentLength }} commentaire</p>
                    <div v-if="transition">

                    </div>
                    <div v-else id="likedislike">
                        <div v-if="!userLiked">
                            <button class="publication__commentsAndLikes__like" @click="Like()">J'aime</button>
                        </div>
                        <div v-else>
                            <button class="publication__commentsAndLikes__like" @click="Dislike()">Je  n'aime plus</button>
                        </div>
                        <div class="publication__commentsAndLikes__countLikes">
                            <p>{{ countLikes }}<i class="fas fa-heart"></i></p>
                        </div>
                    </div>

                </div>
            </div>

            <div v-else>
                <form @submit.prevent="checkText" class="modifPublication">
                    <h1 class="modifPublication__header">Modifier publication</h1>
                    <div>
                        <textarea placeholder="Texte de votre publication..." id="text" name="text" v-model="putPublication" class="modifPublication__txt"></textarea>
                        <span class="text-danger">{{ checkPublication }}</span>
                    </div>
                    <div class="modifPublication__buttonImage">
                        <button class="btn-upload" for="image" :style="{'background-image':'url(' + imageData + ')'}">
                            <p>GIF</p>
                            <i class="fas fa-plus-circle"></i>
                        </button>
                        <input type="file" id="image" name="image" @change="previewImage" accept="image/gif">
                    </div>
                    <div>
                        <button type="submit" class="modifPublication__submit">Publier</button>
                    </div>
                </form>
            </div>
        </div>

        <form @submit.prevent="createComment" class="publication__commentForm" id="form">
            <input type="text" id="comment" class="publication__commentForm__input" name="text" v-model="commentCreate.text" placeholder="Commentaire">
            <button type="submit" class="publication__commentForm__submit"><label for="comment" id="commenter">Commenter</label><i id="icon" class="fas fa-paper-plane"></i></button>
        </form>
        <div>
            <ul>
                <li class="publication__comments" v-for="item in commentGet.comments" v-bind:key="item.id">
                    <img :src="item.userComment.image" class="publication__comments__userImage">
                    <div>
                        <p><span class="publication__comments__userFullname">{{ item.userComment.firstname }} {{ item.userComment.lastname }}</span> {{ item.text }} </p>
                        <p class="publication__comments__createdDate">{{ date(item.createdAt) }}</p>
                    </div>
                    <button class="publication__comments__delete" v-if="item.userId == user || isAdmin == 'true'" v-on:click="deleteComment(item.id)"><i class="fas fa-times"></i></button>
                </li>
            </ul>
        </div>
    </div>
  </div>  
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'Publication',
  data() {
      return {
          publicationUser: {},
          publicationLikes:[],
          commentCreate: {},
          dataCreate: {},
          dataGet: {},
          commentGet: [],
          commentLength: '',
          deleteMessage: {},
          countLikes:0,
          userLiked: false,
          imageData: '',
          putPublication: '',
          messageModif: "",
          transition:false,
          checkPublication:""
      };

  },
  computed: {
      fullname: function(){
          return this.publicationUser.firstname  + ' ' +  this.publicationUser.lastname;
      },
      ...mapState(["user", "isAdmin", "modif"])
  },
  created () {
      this.getOnePublication();
      this.getAllComments();
  },
  methods: {
      async getOnePublication() {
          const url = "http://localhost:3000/api/publications/" + this.$route.params.id;
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
            .then(res => {
                if(res.status === 401){
                    this.$router.push({name: "login"});
                    localStorage.clear();
                }else{
                    return res.json();
                }
            })
            .then(data => this.dataGet = data.publication)
            .then(() => {
                this.publicationUser = this.dataGet.user;
                this.publicationLikes = this.dataGet.likes;
                this.imageData = this.dataGet.image;
                this.putPublication = this.dataGet.text;
            })
            .then(() => {
                this.countLikes = this.publicationLikes.length;
                this.userLiked = false;
                for (let i = 0; i < this.publicationLikes.length; i++){
                    if(this.dataGet.likes[i].usersLiked == this.user){
                        this.userLiked = true;
                        
                    }else{
                        this.userLiked = false;
                    }
                }
            })
            .catch(error=> console.log(error));
      },
      async modifPublication(){
          const formData = new FormData();
          const image = document.getElementById('image').files[0];
          formData.append("text", JSON.stringify(this.putPublication));
          formData.append("image", image);
          const url = "http://localhost:3000/api/publications/" + this.$route.params.id;
          const myHeader = new Headers({'Authorization': 'Basic ' + localStorage.getItem('token')});
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
          this.$store.commit('modif', false);
          this.$router.go();
      },
      async checkText (){
        const regex = /(?=.*[;{}$])|(?=.*<script>)/;
        const checkTxt = regex.test(this.putPublication);
        if(checkTxt == true){
            this.checkPublication = "Le texte de votre publication ne doit pas commporter les caractères ';', '{', '}', '$' ou la chaine '<script>'."
        }else{
            await this.modifPublication();
        }
      },
      async activeModif(){
          if (this.modif == true){
              this.$store.commit('modif', false);
          }else if (this.modif == false){
              this.$store.commit('modif', true);
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
      async deletePublication(){
          let r = confirm('Voulez-vous vraiment supprimer votre publication')
          if(r == true){
            const url = "http://localhost:3000/api/publications/" + this.$route.params.id;
            const  myHeader = new Headers({'Authorization': 'Basic ' + localStorage.getItem('token')});
            const request = new Request(
                    url,
                    {
                        method:  "DELETE",
                        headers: myHeader,
                        mode: "cors",
                    }
            );
            fetch(request)
                .then(res => res.json())
                .then(res => console.log(res))
                .then(() => this.$router.push({name: "homePage"}))
                .catch(error => console.log(error));
          }else{
              console.log('Publication pas supprimer')
          }
      },
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
      async Like(){
          const url = "http://localhost:3000/api/publications/" + this.$route.params.id + "/likes";
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
          .then(json => {
              this.countLikes += 1;
              this.userLiked = true;
              console.log(json);
            })
          .catch(error => console.log(error));
      },
      async Dislike(){
          const url = "http://localhost:3000/api/publications/" + this.$route.params.id + "/likes";
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
          .then(json => {
              this.countLikes -= 1;
              this.userLiked = false;
              console.log(json);
            })
          .catch(error => console.log(error));
      },
      async createComment () {
          const url = "http://localhost:3000/api/publications/" + this.$route.params.id + "/comments";
          const  myHeader = new Headers({ "Content-Type": "application/json", "Authorization": "Basic " + localStorage.getItem("token")});
          const request = new Request(
              url,
              {
                  method:  "POST",
                  headers: myHeader,
                  mode: "cors",
                  cache: "default",
                  body: JSON.stringify(this.commentCreate)
              }
          );
          await fetch(request)
          .then(res => res.text())
          .then(json => this.dataCreate = json)
          .catch(error => this.dataCreate = error);
          await this.getAllComments()
          .then(() => document.getElementById("form").reset())
          .then(() => this.dataCreate = "")
          .catch(error => console.log(error));
      },
      async getAllComments() {
          const url = "http://localhost:3000/api/publications/" + this.$route.params.id + "/comments";
          const  myHeader = new Headers({'Content-Type': 'application/json', 'Authorization': 'Basic ' + localStorage.getItem('token')});
          const request = new Request(
              url,
              {
                  method:  "GET",
                  headers: myHeader,
                  mode: "cors",
              }
          );
          const res  = await fetch(request);
          const data = await res.json();
          this.commentGet = data;
          this.commentLength = data.comments.length;
      },
      async deleteComment(id) {
          const url = "http://localhost:3000/api/publications/" + id + "/comments";
          const  myHeader = new Headers({'Content-Type': 'application/json', 'Authorization': 'Basic ' + localStorage.getItem('token')});
          const request = new Request(
                url,
                {
                    method:  "DELETE",
                    headers: myHeader,
                    mode: "cors",
                }
          );
          fetch(request)
            .then(res => res.json())
            .then(res => this.deleteMessage = res)
            .catch(error => this.deleteMessage = error);
          await this.getAllComments();
      },
  }
}
</script>

<style scoped lang="scss">
button{
    cursor:pointer;
}

a{
    color:#2C3F51;
    text-decoration:none;
}

ul{
    display: flex;
    flex-direction: column-reverse;
}

.text-danger{
    color: #9E0000;
    font-size: 0.8em;
}

a:hover{
    opacity:50%;
}

.publicationPage{
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: 1vw;
    margin-top: 8vw;
    @media screen and (min-width: 700px){
        margin: 4vw 10vw;
    }
    @media screen and (min-width: 1000px){
        margin: 3vw 0;
        grid-template-columns: 24vw 50vw 24vw;
    }
    &__previous{
        display:none;
        margin-left: 2vw;
        font-size:1.5em;
        color:#2C3F51;
        @media screen and (min-width: 1000px){
            display:block;
        }
        @media screen and (min-width: 1900px){
            font-size: 2.5em;
        }
    }
}

.modifPublication{
    overflow: hidden;
    border-radius: 0.5vw;
    width: 100%;
    margin-bottom:3vw;
    font-size: 0.8em;
    @media screen and (min-width: 700px){
        font-size: 1em;
    }
    @media screen and (min-width: 1800px){
        font-size: 1.3em;
    }
    &__header{
        margin:1vw 1vw 0;
    }
     &__messageCreate{
        font-size: 1.2em;
        margin: 1vw 0;
    }
    &__txt{
        width: 90%;
        border:none;
        margin: 4vw 5vw;
        height: 15vw;
        resize: none;
        outline: none;
        font-family: Avenir, Helvetica, Arial, sans-serif;
        @media screen and (min-width: 700px){
            margin: 2vw 3vw;
            height:5vw;
        }
        @media screen and (min-width: 1000px){
            margin: 1vw 2vw;
            height:3vw;
        }
        @media screen and (min-width: 1800px){
            font-size: 1.2em;
        }
    }
    &__buttonImage{
        display:inline-block;
        position: relative;
        overflow: hidden;
        width: 100%;
        margin:0;
        box-shadow: 0px 0px 2px grey;
        input[type=file]{
            left:0;
            top: 0;
            bottom: 0;
            right: 0;
            opacity:0;
            position: absolute;
            width:100%;
            height:100%;
            cursor:pointer;
        }
        .btn-upload{
            background-position: center;
            background-size: cover;
            width:100%;
            height:40vw;
            border:none;
            color:#2C3F51;
            @media screen and (min-width: 700px){
                height:25vw;
            }
            @media screen and (min-width: 1000px){
                height:16vw;
            }
            p{font-size: 1.5em;}
            i {
                margin:2vw 0;
                font-size:5vw
            }
        }
    }
    &__submit{
        margin: 4vw  31%;
        height: 10vw;
        width: 35vw;
        font-size: 1.2em;
        border-radius: 30vw;
        border:none;
        box-shadow: 0px 0px 3px grey;
        background-color:#2C3F51;
        color:white;
        cursor:pointer;
        @media screen and (min-width: 700px){
            margin: 2vw  39%;
            height: 5vw;
            width: 15vw;
        }
        @media screen and (min-width: 1000px){
            margin: 1vw  40%;
            height: 3vw;
            width: 10vw;
            border-radius: 2vw;
        }
    }
    &__submit:hover{
        box-shadow: 0px 0px 9px grey;
    }
}




.publicationView{
    width:100%;
    margin: 0 auto;
    box-shadow: 0px 0px 8px grey;
    border-radius: 3vw;
    padding-bottom:2vw;
    @media screen and (min-width: 700px){
        border-radius: 1.5vw;
    }
    @media screen and (min-width: 1000px){
        border-radius: 0.5vw;
    }
}

.publication {
    border-bottom: 0.5px solid grey;
    border-radius:0px;
    &__header{
        display:flex;
        justify-content: space-between;
        padding: 3vw 3vw;
        margin-bottom: 3vw;
        @media screen and (min-width: 700px){
            padding: 1.5vw 1.5vw;
            margin-bottom: 1vw;
        }
        @media screen and (min-width: 1000px){
            padding: 0.7vw 0.7vw;
            margin-bottom: 1vw;
        }
    }
    &__headerBtn{
        display: flex;
        flex-direction: column;
        margin-top:3vw;
        @media screen and (min-width: 700px){
            flex-direction: row;
            justify-content: start;
            align-items: start;
            margin-top:2vw;
        }
        @media screen and (min-width: 1000px){
            margin-top:1vw;
        }
        &__delete{
            color: #9E0000;
            background-color:transparent;
            border:none;
            &:hover{
                opacity:40%;
            }
        }
        &__modify{
            color: #2C3F51;
            background-color:transparent;
            border:none;
            &:hover{
                opacity:40%;
            }
        }
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
        object-fit:contain;
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
            color: #2C3F51;
        }
        &__comments{
            width:50%;
            text-align: center;
            height:100%;
        }
        &__like{
            font-size:1em;
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
    &__commentForm{
        margin: 1vw 2vw;
        border:3px solid #2C3F51;
        border-radius: 10vw;
        overflow: hidden;
        padding-left:3%;
        display: flex;
        flex-wrap:nowrap;
        align-items: center;
        height: 10vw;
        @media screen and (min-width: 700px){
            border-radius: 4vw;
            height: 5vw;
        }
        @media screen and (min-width: 1000px){
            height: 4vw;
        }
        @media screen and (min-width: 1900px){
            height: 3vw;
        }
        &__input{
            width: 75vw;
            height: 100%;
            border:none;
            background-color: white;
            &:focus{
                border:none;
            }
            @media screen and (min-width: 700px){
                width: 65vw;
            }
            @media screen and (min-width: 1000px){
                width: 38vw;
            }
            @media screen and (min-width: 1900px){
                font-size: 1.3em;
            }
        }
        &__submit{
            width: 13vw;
            height: 11vw;
            border:none;
            color: white;
            background-color: #2C3F51;
            &:hover{
                opacity:80%;
            }
            @media screen and (min-width: 700px){
                width: 7vw;
            }
            @media screen and (min-width: 1000px){
                width: 10vw;
            }
            @media screen and (min-width: 1500px){
                width: 7vw;
            }
        }
    }
    &__comments{
        margin: 0;
        padding: 1.5vw 1vw;
        list-style:  none;
        border-bottom: 0.3px solid grey;
        display: flex;
        &__userImage{
            border-radius: 50%;
            box-shadow: 0px 0px 1px grey;
            width: 10vw;
            height: 10vw;
            margin: 0 3vw;
            object-fit:cover;
            @media screen and (min-width: 700px){
                width: 5vw;
                height:5vw;
                margin: 0 2vw;
            }
            @media screen and (min-width: 1000px){
                width: 3vw;
                height:3vw;
                margin: 0 1vw;
            }
        }
        &__userFullname{
            font-weight: bold;
        }
        &__createdDate{
            font-size: 0.7em;
            color:gray;
        }
        p{
            margin-top: 1vw;
            width: 73vw;
            @media screen and (min-width: 700px){
                margin-top: 0.5vw;
                width: 63vw;
            }
            @media screen and (min-width: 1000px){
                margin-top: 0.1vw;
                width: 41vw;
            }
        }
        &__delete{
            background-color: transparent;
            border:none;
            padding:0;
            height:min-content;
            :hover {
                color:  #2C3F5133;
            }
        }
    }
}

#commenter{
    display: none;
    @media screen and (min-width: 1000px){
        display:inline;
    }
}

#icon{
    @media screen and (min-width: 1000px){
        display:none;
    }
}

#likedislike{
    width:70%;
    div{
        width:100%;
    }
}

ul{padding:0; margin: 0px}
p{margin:0;}


</style>