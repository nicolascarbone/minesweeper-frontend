<template>
  <div class="login-wrapper border border-light">
    <form class="form-signin" @submit.prevent="login">
      <h2 class="form-signin-heading">Please sign in</h2>
      <div class="alert alert-danger" v-if="error">{{ error }}</div>
      <label for="inputEmail" class="sr-only">Email address</label>
      <input v-model="username" type="text" id="inputEmail" class="form-control" placeholder="Username" required autofocus>
      <label for="inputPassword" class="sr-only">Password</label>
      <input v-model="password" type="password" id="inputPassword" class="form-control" placeholder="Password" required>
      <button class="btn btn-lg btn-primary btn-block" type="submit">Sign in</button>
      <a href='#' v-on:click="createAccount()">Create Account</a>
    </form>
  </div>
</template>

<script>

import constants from '../constants';
export default {
  name: 'Login',
  data () {
    return {
      username: '',
      password: '',
      error: false
    }
  },
  updated () {
    if (localStorage.token) {
      this.$router.replace(this.$route.query.redirect || '/game')
    }
  },
  methods: {

    login () {

      this
        .$http
        .post(`${constants.baseApiUrl}/api/token/`, {
          username: this.username,
          password: this.password
        }, {
          // headers: {
            // 'Basic': ''
          // }
        })
        .then(request => this.loginSuccessful(request))
        .catch(() => this.loginFailed())

    },

    loginSuccessful (req) {

      if (!req.data.token) {
        this.loginFailed()
        return
      }

      this.error = false
      localStorage.token = req.data.token
      this.$router.replace(this.$route.query.redirect || '/game')

    },

    loginFailed () {

      this.error = 'Login failed!'
      delete localStorage.token

    },

    createAccount: function() {
      this.$router.push('/signin')
    }

  }
}
</script>

<style lang="css">

.login-wrapper {
  background: #fff;
  width: 70%;
  margin: 12% auto;
}

.form-signin {
  max-width: 330px;
  padding: 10% 15px;
  margin: 0 auto;
}
.form-signin .form-signin-heading,
.form-signin .checkbox {
  margin-bottom: 10px;
}
.form-signin .checkbox {
  font-weight: normal;
}
.form-signin .form-control {
  position: relative;
  height: auto;
  -webkit-box-sizing: border-box;
          box-sizing: border-box;
  padding: 10px;
  font-size: 16px;
}
.form-signin .form-control:focus {
  z-index: 2;
}
.form-signin input[type="email"] {
  margin-bottom: -1px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}
.form-signin input[type="password"] {
  margin-bottom: 10px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}
</style>