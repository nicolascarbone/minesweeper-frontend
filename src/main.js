import Vue from 'vue'
import App from './App.vue'
import Resource from 'vue-resource';

Vue.use(Resource);

Vue.http.headers.common['Authorization'] = 'Token 274e7ff5492b0f8de9aad93dd66cf026956f77d6';

new Vue({
  render: h => h(App)
}).$mount('#app');

