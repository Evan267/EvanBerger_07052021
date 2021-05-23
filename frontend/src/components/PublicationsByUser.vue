<template>
    <div>
      <div class="userPublications">
          <h1>Publications de {{ userGet.user.firstname }} {{ userGet.user.lastname }}</h1>
          <img :src="imageData" alt="" class="userPublications__img">
      </div>
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
                    <router-link :to="{name: 'publication-details', params: { id: item.id }}"  class="publication__commentsAndLikes__comments"> {{ item.comments.length }} commentaires </router-link>
                    <div>
                        <button class="publication__commentsAndLikes__like"><i class="fas fa-thumbs-up"></i></button>
                        <button class="publication__commentsAndLikes__dislike"><i class="fas fa-thumbs-down"></i></button>
                    </div>
                </div>
            </li>
        </ul>
      </div>
    </div>
</template>

<script>
export default {
  name: 'PublicationsByUser',
  data() {
      return {
          postCreate: "",
          dataCreate: {},
          dataGet: {},
          userGet:{},
          imageData:"",
      };

  },
  beforeMount () {
      this.getUserData();
      this.getUserPublications();
  },
  methods: {
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
          console.log(this.userGet);
      },
      async getUserPublications() {
          const url = "http://localhost:3000/api/publications/" + localStorage.userId + "/user/" + this.$route.params.userId;
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
          console.log(this.dataGet);
      }
  }
}
</script>


<style scoped lang="scss">
ul{padding:0}

li{list-style: none;}

p{margin: 0;}

.userPublications{
    display:flex;
    flex-direction: column;
    align-items: center;
    &__img{
        width:15vw;
        height:15vw;
        border-radius:50%;
        border: 1px solid #2C3F51;
    }
}

.publication{
    box-shadow: none;
}

.createPublication{
    overflow: hidden;
    border-radius: 0.5vw;
    box-shadow: 0px 0px 8px grey;
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


#publications{
    width: 100%;
    margin:0;
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
}

</style>