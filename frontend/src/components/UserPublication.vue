<template>
  <div class="userPage">
    <div class="userPage__user">

    </div>
    <div>
        <p>UserPublication</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserPublication',
  data() {
      return {
          userId: localStorage.userId,
          put: {},
          publicationGet: {},
      };
  },
  computed: {
  },
  created (){
  },
  methods: {
  }
}

</script>

<style scoped lang="scss">

</style>
