import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Resource from 'vue-resource';

Vue.use(Resource);

Vue.http.interceptors.push((request, next) => {
  if (localStorage.token) {
    request.headers.set('Authorization', 'Token ' + localStorage.token);
  }
  next()
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app');

