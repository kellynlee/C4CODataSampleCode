import Vue from 'vue';
import App from './App';
import router from './router/index';
import axios from 'axios';
import MuseUI from 'muse-ui';
import 'muse-ui/dist/muse-ui.css';
import Loading from 'muse-ui-loading';
import 'muse-ui-loading/dist/muse-ui-loading.css';
import Toast from 'muse-ui-toast';
import Message from 'muse-ui-message';
import configData from '../config/api.config';
import wx from 'weixin-jsapi';

// import apiConfig from '../config/api.config';

Vue.use(MuseUI);
Vue.use(Loading);
Vue.use(Toast);
Vue.use(Message);
Vue.use(wx);

Vue.config.debug = true;
Vue.config.productionTip = false;
axios.defaults.baseURL = 'api/';
Vue.prototype.$axios = axios;
Vue.prototype.CONFIG = configData;

new Vue({
  el: '#app',
  router: router,
  template: '<App/>',
  components: { App }
});
