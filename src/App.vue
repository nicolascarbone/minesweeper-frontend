<template>
  <div id="app">
    <div class="container-fluid">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>

import MineSweeper from './components/MineSweeper.vue'

export default {
  name: 'app',
  components: {
    MineSweeper
  },
  created() {
    this.checkLogin();
  },
  updated () {
    this.checkLogin();
  },
  methods: {

    checkLogin: function() {
      if (!localStorage.token && this.$route.path !== '/login' && this.$route.path !== '/signin') {
        this.$router.push('/login?redirect=game')
      }
    }

  }
}

</script>

<style>

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

</style>
