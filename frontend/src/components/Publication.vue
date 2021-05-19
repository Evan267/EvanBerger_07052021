<template>
  <div class="publication">
    <div id="publication">
        <div id="user">
            <img :src="dataGet.publication.user.image" alt="">
            <p>{{ fullname }}</p>
            <p>{{ dataGet.publication.cr }}</p>
        </div>
        
        <p>{{ dataGet.publication.description }} </p>
        <a :href="dataGet.publication.url">{{ dataGet.publication.url }}</a>
        <div id="commentsAndLikes">
            <p> {{ commentGet.comments.length }} commentaires </p>
            <div>
                <button>like</button>
                <button>dislike</button>
            </div>
        </div>
        {{dataGet}}
    </div>
    <form @submit.prevent="createComment">
        <input type="text" id="text" name="publication_text" v-model="commentCreate.text" placeholder="Commentaire">
        <button type="submit">Envoyer</button>
    </form>
    <div>
        <ul>
            <li v-for="item in commentGet.comments" v-bind:key="item.id">
                <p> {{ item.text }} </p>
                <button v-if="item.userId == userId" v-on:click="deleteComment(item.id)"><i class="fas fa-times"></i></button>
            </li>
        </ul>
    </div>
    {{ commentGet }}
  </div>
  
</template>

<script>
export default {
  name: 'PublicationsList',
  data() {
      return {
          userId: localStorage.userId,
          commentCreate: {},
          dataCreate: {},
          dataGet: {},
          commentGet: {},
          deleteMessage: {},
      };

  },
  computed: {
      fullname: function(){
          return this.dataGet.publication.user.firstname  + ' ' +  this.dataGet.publication.user.lastname;
      }
  },
  beforeMount () {
      this.getOnePublication();
      this.getAllComments();
  },
  methods: {
      async createComment () {
          const url = "http://localhost:3000/api/publications/" + localStorage.userId + "/" + this.$route.params.id + "/comments";
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
          fetch(request)
          .then(res => res.text())
          .then(json => this.dataCreate = json)
          .catch(error => this.dataCreate = error);
          this.getAllComments();
      },
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
          const res  = await fetch(request);
          const data = await res.json();
          this.dataGet = data;
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
          this.getAllComments();
      },
      /*async getUser(objet) {
          let result = [];
          for (let i = 0; i < objet.length; i++){
              const url = "http://localhost:3000/api/auth/" + objet[i].userId;
              console.log(url);
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
                .then(json => result[objet[i].userId] = json.user)
                .catch(error => result[objet[i].userId] = error);
            console.log(result);
            this.commentUser[objet[i].userId] = result[objet[i].userId];
            console.log(this.commentUser);
          }
      }*/
  }
}


</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.publication{
    width:50%;
    margin: 0 auto;
    border: 1px solid grey;
    border-radius: 0.5vw;

}

#publication {
    border-bottom: 0.5px solid grey;
}

#publication p {
    margin: 0;
}

#commentsAndLikes{
    margin: 1vw 0;
    display: flex;
    border-top: 0.5px solid grey;
}

#commentsAndLikes p{
    width:50%;
    text-align: center;
    height:100%
}

ul{padding:0}
li{
    list-style:  none;
    border-bottom: 0.3px solid grey;
    display: flex;
}


</style>