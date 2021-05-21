<template>
  <div class="mainPage">
      <p class="mainPage__messageCreate">{{ dataCreate.message }}</p>
      <form @submit.prevent="createPublication" class="createPublication">
        <h1 class="createPublication__header">Nouvel publication</h1>
        <div>
            <textarea placeholder="Texte de votre publication..." id="text" name="text" v-model="postCreate" class="createPublication__txt"></textarea>
        </div>
        <div class="createPublication__buttonImage">
            <button class="btn-upload" for="image" :style="{'background-image':'url(' + imageData + ')'}">
                <p>Image ou GIF</p>
                <i class="fas fa-plus-circle"></i>
            </button>
            <input type="file" id="image" name="image" @change="previewImage" accept="image/*">
        </div>
        <div>
            <button type="submit" class="createPublication__submit">Publier</button>
        </div>
    </form>

    <div id="publications">
        <ul>
            <li v-for="item in dataGet.publication" v-bind:key="item.id" class="publication">
                <div class="publication__user">
                    <img :src="item.user.image" alt="">
                    <div>
                        <p class="publication__user__fullname">{{ item.user.firstname }} {{ item.user.lastname }}</p>
                        <p class="publication__user__date">{{ item.createdAt }}</p>
                    </div>
                </div>
                <p class="publication__text">{{ item.text }} </p>
                <img :src="item.image" class="publication__img">
                <div class="publication__commentsAndLikes">
                    <router-link :to="`/publication/${item.id}`"  class="publication__commentsAndLikes__comments"> {{ item.comments.length }} commentaires </router-link>
                    <div>
                        <button class="publication__commentsAndLikes__like"><i class="fas fa-thumbs-up"></i></button>
                        <button class="publication__commentsAndLikes__dislike"><i class="fas fa-thumbs-down"></i></button>
                    </div>
                </div>
            </li>
        </ul>

        {{ dataGet.publication }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'PublicationsList',
  data() {
      return {
          postCreate: "",
          dataCreate: {},
          dataGet: {},
          imageData:"",
      };

  },
  beforeMount () {
      this.getPublications();
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
      async createPublication() {
          const url = "http://localhost:3000/api/publications/" + localStorage.userId;
          const  myHeader = new Headers({ 'Content-Type': 'multipart/form-data', "Authorization": "Basic " + localStorage.getItem("token")});
          const formData = new FormData();
          const image = document.getElementById('image').files[0];
          formData.append("text", JSON.stringify(this.postCreate));
          formData.append("image", image);
          const request = new Request(
              url,
              {
                  method:  "POST",
                  header: myHeader,
                  mode: "cors",
                  body: formData
              }
          );
          const res  = await fetch(request);
          const data = await res.json();
          this.dataCreate = data;
            await this.getPublications()
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
          const res  = await fetch(request);
          const data = await res.json();
          this.dataGet = data;
      }
  }
}


</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
ul{padding:0}

li{list-style: none;}

p{margin: 0;}

.mainPage{
    &__messageCreate{
        font-size:1.2em;
        margin: 1vw 38vw;
    }
}

.createPublication{
    overflow: hidden;
    border-radius: 0.5vw;
    box-shadow: 0px 0px 8px grey;
    width: 50%;
    margin:3vw auto;
    &__header{
        margin-left:1vw;
    }
    &__txt{
        width: 90%;
        border:none;
        margin: 1vw 2vw;
        height:4vw;
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
            width: 15vw;
            height: 15vw;
            width:100%;
            height:100%;
            cursor:pointer;
        }
        .btn-upload{
            background-position: center;
            background-size: cover;
            width:100%;
            height:30vw;
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
    }
}


#publications{
    width: 50%;
    margin:0 auto;
    box-shadow: none;
}

.publication {
    border-radius: 0.5vw;
    box-shadow: 0px 0px 8px grey;
    margin:3vw 0;
    &__user{
        display:flex;
        padding: 0.7vw 0.7vw;
        margin-bottom: 1vw;
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
        border:3px solid grey;
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
            background-color: blue;
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
                color: blue;
            }
        }
    }
}

</style>