<template>
  <div class="publicationPage">
    <div>
        <router-link :to="{name: 'homePage'}" class="publicationPage__previous"><i class="fas fa-arrow-left"></i></router-link>
    </div>
    <div class="publicationView">
        <div class="publication">
            <div class="publication__header">
                <router-link :to="{ name: 'publications-by-user', params: { userId: dataGet.publication.user.id }}" class="publication__user">
                    <img :src="dataGet.publication.user.image" alt="">
                    <div>
                        <p class="publication__user__fullname">{{ fullname }}</p>
                        <p class="publication__user__date">{{ dataGet.publication.createdAt }}</p>
                    </div>
                </router-link>
                <div v-if="userId == dataGet.publication.user.id" class="publication__headerBtn">
                    <button class="publication__headerBtn__modify" v-on:click="activeModif()"><i class="fas fa-pencil-alt"></i></button>
                    <button class="publication__headerBtn__delete" v-on:click="deletePublication()"><i class="fas fa-trash-alt"></i></button>
                </div>
            </div>
            <div v-if="modif == 'false'">
                <p class="publication__text">{{ dataGet.publication.text }} </p>
                <img :src="dataGet.publication.image" class="publication__img">
                <div class="publication__commentsAndLikes">
                    <p class="publication__commentsAndLikes__comments"> {{ commentGet.comments.length }} commentaire</p>
                    <div v-if="userLiked">
                        <button class="publication__commentsAndLikes__like" @click.prevent="Like" style="color: green"><i class="fas fa-thumbs-up"></i></button>
                        <button class="publication__commentsAndLikes__dislike" disabled><i class="fas fa-thumbs-down"></i></button>
                    </div>
                    <div v-else-if="userDisliked">
                        <button class="publication__commentsAndLikes__like" disabled><i class="fas fa-thumbs-up"></i></button>
                        <button class="publication__commentsAndLikes__dislike" @click.prevent="Dislike" style="color: red"><i class="fas fa-thumbs-down"></i></button>
                    </div>
                    <div v-else>
                        <button class="publication__commentsAndLikes__like" @click.prevent="Like">{{ this.countLikes }}<i class="fas fa-thumbs-up"></i></button>
                        <button class="publication__commentsAndLikes__dislike" @click.prevent="Dislike">{{ this.countDislikes }}<i class="fas fa-thumbs-down"></i></button>
                    </div>
                </div>
            </div>

            <div v-else>
                <form @submit.prevent="modifPublication" class="modifPublication">
                    <h1 class="modifPublication__header">Modifier publication</h1>
                    <div>
                        <textarea placeholder="Texte de votre publication..." id="text" name="text" v-model="putPublication" class="modifPublication__txt"></textarea>
                    </div>
                    <div class="modifPublication__buttonImage">
                        <button class="btn-upload" for="image" :style="{'background-image':'url(' + imageData + ')'}">
                            <p>Image ou GIF</p>
                            <i class="fas fa-plus-circle"></i>
                        </button>
                        <input type="file" id="image" name="image" @change="previewImage" accept="image/*">
                    </div>
                    <div>
                        <button type="submit" class="modifPublication__submit">Publier</button>
                    </div>
                </form>
            </div>
        </div>

        <form @submit.prevent="createComment" class="publication__commentForm" id="form">
            <input type="text" class="publication__commentForm__input" name="text" v-model="commentCreate.text" placeholder="Commentaire">
            <button type="submit" class="publication__commentForm__submit"><i class="fas fa-paper-plane"></i></button>
        </form>
        <div>
            <ul>
                <li class="publication__comments" v-for="item in commentGet.comments" v-bind:key="item.id">
                    <img :src="item.userComment.image" class="publication__comments__userImage">
                    <div>
                        <p><span class="publication__comments__userFullname">{{ item.userComment.firstname }} {{ item.userComment.lastname }}</span> {{ item.text }} </p>
                        <p class="publication__comments__createdDate">{{ item.createdAt }}</p>
                    </div>
                    <button class="publication__comments__delete" v-if="item.userId == userId" v-on:click="deleteComment(item.id)"><i class="fas fa-times"></i></button>
                </li>
            </ul>
        </div>
    </div>
  </div>  
</template>

<script>
export default {
  name: 'Publication',
  data() {
      return {
          userId: localStorage.userId,
          commentCreate: {},
          dataCreate: {},
          dataGet: {},
          commentGet: {},
          deleteMessage: {},
          countLikes:0,
          userLiked: false,
          countDislikes:0,
          userDisliked: false,
          modif: localStorage.modif,
          imageData: '',
          putPublication: '',
          messageModif: ""
      };

  },
  computed: {
      fullname: function(){
          return this.dataGet.publication.user.firstname  + ' ' +  this.dataGet.publication.user.lastname;
      },
  },
  created () {
      this.getOnePublication();
      this.getAllComments();
  },
  methods: {
      async modifPublication(){
          const formData = new FormData();
          const image = document.getElementById('image').files[0];
          formData.append("text", JSON.stringify(this.putPublication));
          formData.append("image", image);
          console.log(image);
          const url = "http://localhost:3000/api/publications/" + this.userId + "/" + this.$route.params.id;
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
          console.log(this.messageModif);
          localStorage.setItem('modif', false);
          this.$router.go();
      },
      async activeModif(){
          console.log(localStorage.modif);
          if (localStorage.modif == "true"){
              localStorage.setItem('modif', false);
          }else if (localStorage.modif == "false"){
              localStorage.setItem('modif', true);
          }
          console.log(localStorage.modif);
          this.$router.go();
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
            const url = "http://localhost:3000/api/publications/" + this.userId + "/publication/" + this.$route.params.id;
            console.log(url);
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
                .catch(error => console.log(error));
            await this.$router.push({name: "homePage"})
          }else{
              console.log('Publication pas supprimer')
          }
      },
      async Like(){
          let like;
          if (this.userLiked){
              like = 0;
          } else  {
              like = 1;
          }
          const url = "http://localhost:3000/api/publications/" + this.userId + "/" + this.$route.params.id + "/likes";
          const  myHeader = new Headers({ "Content-Type": "application/json", "Authorization": "Basic " + localStorage.getItem("token")});
          const request = new Request(
              url,
              {
                  method:  "POST",
                  headers: myHeader,
                  mode: "cors",
                  cache: "default",
                  body: JSON.stringify({like: like})
              }
          );
          await fetch(request)
          .then(res => res.text())
          .then(json => console.log(json))
          .catch(error => console.log(error));
          await this.getOnePublication();
      },
      async Dislike(){
          let like;
          if (this.userDisliked){
              like = 0;
          } else  {
              like = -1;
          }
          console.log(like);
          const url = "http://localhost:3000/api/publications/" + this.userId + "/" + this.$route.params.id + "/likes";
          const  myHeader = new Headers({ "Content-Type": "application/json", "Authorization": "Basic " + localStorage.getItem("token")});
          const request = new Request(
              url,
              {
                  method:  "POST",
                  headers: myHeader,
                  mode: "cors",
                  cache: "default",
                  body: JSON.stringify({like: like})
              }
          );
          await fetch(request)
          .then(res => res.text())
          .then(json => console.log(json))
          .catch(error => console.log(error));
          await this.getOnePublication();
      },
      async countLikesAndDislikes(){
          let countLikes = 0;
          let countDislikes = 0;
          this.userLiked = false;
          this.userDisliked = false;
          for (let i = 0; i < this.dataGet.publication.likes.length; i++){
              if (this.dataGet.publication.likes[i].usersLiked !== null){
                  countLikes += 1;
              } else if (this.dataGet.publication.likes[i].usersDisliked !== null){
                  countDislikes += 1;
              }
              if(this.dataGet.publication.likes[i].usersLiked == this.userId){
                  this.userLiked = true;
                  this.userDisliked = false;
              } else if(this.dataGet.publication.likes[i].usersDisliked == this.userId){
                  this.userLiked = false;
                  this.userDisliked = true;
              }
          }
          this.countLikes = countLikes;
          this.countDislikes = countDislikes;
      },
      async createComment () {
          const url = "http://localhost:3000/api/publications/" + this.userId + "/" + this.$route.params.id + "/comments";
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
      async getOnePublication() {
          const url = "http://localhost:3000/api/publications/" + this.userId + "/" + this.$route.params.id;
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
          this.dataGet = data;
          await this.countLikesAndDislikes();
          this.imageData = this.dataGet.publication.image;
          this.putPublication = this.dataGet.publication.text;
      },
      async getAllComments() {
          const url = "http://localhost:3000/api/publications/" + this.userId + "/" + this.$route.params.id + "/comments";
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
      },
      async deleteComment(id) {
          const url = "http://localhost:3000/api/publications/" + this.userId + "/" + id + "/comments";
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

.publicationPage{
    display: grid;
    grid-template-columns: 24vw 50vw 24vw;
    grid-gap: 1vw;
    margin-top: 3vw;
    &__previous{
        margin-left: 2vw;
        font-size:1.5em;
        color:#2C3F51;
    }
}

.modifPublication{
    overflow: hidden;
    border-radius: 0.5vw;
    width: 100%;
    margin-bottom:3vw;
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
        margin: 1vw 2vw;
        height:3vw;
        resize: none;
        outline: none;
        font-family: Avenir, Helvetica, Arial, sans-serif;
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
            height:16vw;
            border:none;
            color:#2C3F51;
            p{font-size: 1.5em;}
            i {
                margin:2vw 0;
                font-size:5vw
            }
        }
    }
    &__submit{
        margin: 1vw  40%;
        height: 3vw;
        width: 10vw;
        font-size: 1.2em;
        border-radius: 2vw;
        border:none;
        box-shadow: 0px 0px 3px grey;
        background-color:#2C3F51;
        color:white;
        cursor:pointer;
    }
    &__submit:hover{
        box-shadow: 0px 0px 9px grey;
    }
}




.publicationView{
    width:100%;
    margin: 0 auto;
    box-shadow: 0px 0px 8px grey;
    border-radius: 0.5vw;
    padding-bottom:2vw;
}

.publication {
    border-bottom: 0.5px solid grey;
    border-radius:0px;
    &__header{
        display:flex;
        justify-content: space-between;
        padding: 0.7vw 0.7vw;
    }
    &__headerBtn{
        &__delete{
            color: red;
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
        margin-bottom: 1vw;
        color: #2C3F51;
        text-decoration:none;
        img{
            border-radius: 50%;
            box-shadow: 0px 0px 2px grey;
            width: 4vw;
            height:4vw;
            margin-right: 1vw;
        }
        &__fullname{
            font-weight: bold;
            font-size: 1.1em;
        }
        &__date{
            font-size: 0.6em;
        }
    }
    &__text{
        padding: 2vw;
    }
    &__img{
        width: 100%;
        height: max-content;
        box-shadow: 0px 0px 3px grey;
    }
    &__commentsAndLikes{
        display: flex;
        border-top: 0.5px solid grey;
        align-items: center;
         i{
           font-size: 3vw;     
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
            :hover{
                color: green;
            }
        }
        &__dislike{
            :hover{
                color: red;
            }
        }
    }
    &__commentForm{
        margin: 1vw 2vw;
        border:3px solid #2C3F51;
        border-radius: 4vw;
        overflow: hidden;
        padding-left:3%;
        display: flex;
        flex-wrap:nowrap;
        align-items: center;
        &__input{
            width: 36.25vw;
            height: 4vw;
            border:none;
            background-color: white;
        }
        &__submit{
            width: 7vw;
            height: 5vw;
            border:none;
            color: white;
            background-color: #2C3F51;
            :hover{
                box-shadow: 3px 3px 7px grey;
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
            width: 3vw;
            height:3vw;
            margin-right: 1vw;
        }
        &__userFullname{
            font-weight: bold;
        }
        &__createdDate{
            font-size: 0.7em;
            color:gray;
        }
        p{
            margin-top: 0.1vw;
            width: 41vw;
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

ul{padding:0; margin: 0px}
p{margin:0;}


</style>