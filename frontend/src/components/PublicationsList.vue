<template>
  <div class="publication">
      <form @submit.prevent="createPublication">
        <h1>Nouvel publication</h1>
        <div>
            <label for="text">Texte:</label>
            <textarea id="text" name="publication_text" v-model="postCreate.description"></textarea>
        </div>
        <div>
            <label for="url">Url:</label>
            <input type="url" name="publication_url" id="url" v-model="postCreate.url">
        </div>
        <div id="create">
            <button type="submit">Publier</button>
        </div>
    </form>

    {{ dataCreate.message }}
    <div id="publications">
        <ul>
            <li v-for="item in dataGet.publication" v-bind:key="item.id">
                <p>{{ item.description }} </p>
                <a :href="item.url">{{ item.url }}</a>
                <div id="commentsAndLikes">
                    <router-link :to="`/publication/${item.id}`"  id="publicationLink"> {{ item.comments.length }} commentaires </router-link>
                    <div>
                        <button>like</button>
                        <button>dislike</button>
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
          postCreate: {},
          dataCreate: {},
          dataGet: {},
      };

  },
  beforeMount () {
      this.getPublications();

  },
  methods: {
      async createPublication () {
          const url = "http://localhost:3000/api/publications/" + localStorage.userId;
          const  myHeader = new Headers({ "Content-Type": "application/json", "Authorization": "Basic " + localStorage.getItem("token")});
          const request = new Request(
              url,
              {
                  method:  "POST",
                  headers: myHeader,
                  mode: "cors",
                  cache: "default",
                  body: JSON.stringify(this.postCreate)
              }
          );
          fetch(request)
          .then(res => res.json())
          .then(json => this.dataCreate = json)
          .catch(error => this.dataCreate = error);
          this.getPublications();
      },
      async getPublications() {
          const  myHeader = new Headers({'Content-Type': 'application/json', 'Authorization': 'Basic ' + localStorage.getItem('token')});
          const request = new Request(
              "http://localhost:3000/api/publications",
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
<style scoped>
.logIn{
    display: flex;
    flex-direction: column;
    align-items: center;
}

form{
    margin-bottom: 10vw;
}

form h1{
    margin: 3vw 20%;
}


form div{
    display: flex;
    flex-direction: column;
    margin: 2vw auto;
    width: 50%;
}

ul{padding:0}

li{
    list-style: none;
    border: 1px solid grey;
    border-radius: 0.5vw;
    margin: 1vw auto;
    width:50%;
}

li p {
    margin: 0;
}

#commentsAndLikes{
    margin: 1vw 0;
    display: flex;
    border-top: 0.5px solid grey;
}

#publicationLink{
    width:50%;
    text-align: center;
    height:100%
}

#logInOrSignUp{
    flex-direction: row;
    justify-content: space-evenly;
}

</style>