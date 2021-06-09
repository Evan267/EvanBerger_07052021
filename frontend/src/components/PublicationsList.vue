<template>
    <div>
      <form @submit.prevent="checkText" class="createPublication">
        <h1 class="createPublication__header"><label for="text">Nouvelle publication</label></h1>
        <div>
            <textarea placeholder="Texte de votre publication..." id="text" name="text" v-model="postCreate" class="createPublication__txt"></textarea>
            <span class="text-danger">{{ checkPublication }}</span>
        </div>
        <div class="createPublication__buttonImage">
            <button class="btn-upload" for="image" :style="{'background-image':'url(' + imageData + ')'}">
                <label for="image">GIF</label>
                <i class="fas fa-plus-circle"></i>
            </button>
            <input type="file" id="image" name="image" @change="previewImage" accept="image/gif">
        </div>
        <span class="text-danger">{{ checkImg }}</span>
        <div>
            <button type="submit" class="createPublication__submit">Publier</button>
        </div>
      </form>

      <div id="publications">
        <ul>
            <li v-for="(item, index) in dataGet.publication" v-bind:key="item.id" class="publication">
                <router-link :to="{ name: 'publications-by-user', params: { userId: item.user.id }}" class="publication__user">
                    <img :src="item.user.image" :alt='"photo utilisateur qui a créé la publication n°" + (index+1)'>
                    <div>
                        <h2 class="publication__user__fullname">{{ item.user.firstname }} {{ item.user.lastname }}</h2>
                        <p class="publication__user__date">{{ date(item.createdAt) }}</p>
                    </div>
                </router-link>
                <p class="publication__text">{{ item.text }} </p>
                <router-link :to="{name: 'publication-details', params: { id: item.id }}"><img :src="item.image" :alt="'GIF de la publication n°' + (index+1)" class="publication__img"></router-link>
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
                            <p>{{ likesLength[index] }}<i class="fas fa-heart"></i></p>
                        </div>
                    </div>
                </div>
            </li>
        </ul>
      </div>
    </div>
</template>

<script>


export default {
  name: 'PublicationsList',
  data() {
      return {
          userId: localStorage.userId,
          postCreate: "",
          dataCreate: {},
          dataGet: {},
          imageData:"",
          userLiked: [],
          likesLength: [],
          test: true,
          checkPublication:"",
          checkImg:""
      };

  },
  beforeMount () {
      this.getPublications();
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
      async checkText (){
        const regex = /(?=.*[;{}$])|(?=.*<script>)/;
        console.log(this.postCreate);
        const checkTxt = regex.test(this.postCreate);
        console.log(checkTxt)
        if(checkTxt == true){
            this.checkPublication = "Le texte de votre publication ne doit pas commporter les caractères ';', '{', '}', '$' ou la chaine '<script>'."
        }else if (this.imageData == ""){
            this.checkImg = "Votre publication doit contenir un GIF."
        }else{
            await this.createPublication();
        }
      },
      async Like(publicationId){
          const url = "http://localhost:3000/api/publications/" + this.userId + "/" + publicationId + "/likes";
          const  myHeader = new Headers({ "Content-Type": "application/json", "Authorization": "Basic " + localStorage.getItem("token")});
          const request = new Request(
              url,
              {
                  method:  "POST",
                  headers: myHeader,
                  mode: "cors",
                  cache: "default",
                  body: JSON.stringify({user: this.userId})
              }
          );
          fetch(request)
          .then(res => res.text())
          .then(json => {
              this.getPublications();
              console.log(json)
          })
          .catch(error => console.log(error));
      },
      async Dislike(publicationId){
          const url = "http://localhost:3000/api/publications/" + this.userId + "/" + publicationId + "/likes";
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
              this.getPublications();
              console.log(json)
          })
          .catch(error => console.log(error));
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
      async createPublication() {
          const formData = new FormData();
          const image = document.getElementById('image').files[0];
          formData.append("text", JSON.stringify(this.postCreate));
          formData.append("image", image);
          const url = "http://localhost:3000/api/publications/" + localStorage.userId + "/publication";
          const myHeader = new Headers({'Authorization': 'Basic ' + localStorage.getItem('token')});
          const request = new Request(
              url,
              {
                  method:  "POST",
                  headers: myHeader,
                  mode: "cors",
                  cache: "default",
                  body: formData
              }
          );
          const res  = await fetch(request);
          const data = await res.json();
          this.dataCreate = data;
          this.$router.go();
      },
      async getPublications() {
          const url = "http://localhost:3000/api/publications/" + localStorage.userId;
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
                    this.likesLength[i] = this.dataGet.publication[i].likes.length;
                    for(let x = 0; x < this.dataGet.publication[i].likes.length; x++){
                        if(this.dataGet.publication[i].likes[x].usersLiked == this.userId){
                            this.userLiked[i] = true;
                        }
                    }
                }
            })
            .catch(error=> console.log(error));
          localStorage.modif = false;
      }
  }
}


</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
ul{padding:0}

li{list-style: none;}

p{margin: 0;}

a{
    color: #2C3F51;
    text-decoration:none;
}

.text-danger{
    color: #9E0000;
    font-size: 0.8em;
}

button{
    cursor: pointer;
}

.createPublication{
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border-radius: 3vw;
    box-shadow: 0px 0px 8px grey;
    width: 100%;
    margin-bottom:3vw;
    @media screen and (min-width: 700px){
        border-radius: 1.5vw;
    }
    @media screen and (min-width: 1000px){
        border-radius: 0.5vw;
    }
    &__header{
        margin:4vw 4vw 0;
        font-size: 1.6em;
        @media screen and (min-width: 700px){
            margin:2vw 2vw 0;
        }
        @media screen and (min-width: 1400px){
            margin:1vw 1vw 0;
            font-size: 2em;
        }
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
            label{font-size: 1.5em;display:block}
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
        margin:2vw 0;
    }
    @media screen and (min-width: 1000px){
        border-radius: 0.5vw;
        margin:1vw 0;
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