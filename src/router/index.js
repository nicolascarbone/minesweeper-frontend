import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import SignIn from '@/components/SignIn'
import MineSweeper from '@/components/MineSweeper'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/game',
      name: 'Game',
      component: MineSweeper
    },
    {
      path: '/signin',
      name: 'Signin',
      component: SignIn
    }
  ]
})
