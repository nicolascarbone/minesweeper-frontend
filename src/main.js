import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Resource from 'vue-resource';

Vue.use(Resource);

// Vue.http.headers.common['Authorization'] = 'Token 274e7ff5492b0f8de9aad93dd66cf026956f77d6';

Vue.http.interceptors.push((request, next) => {
  console.log('por setear header ', localStorage.token);
  if (localStorage.token) {
    request.headers.set('Authorization', 'Token ' + localStorage.token);
  }
  next()
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app');

