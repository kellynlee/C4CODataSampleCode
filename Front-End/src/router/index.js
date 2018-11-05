import Vue from 'vue'
import Router from 'vue-router'
import SocialMediaActivityCreate from '../components/SocialMediaActivityCreate';
import ContactCollection from '../components/ContactCollection';
import TicketList from '../components/TicketList';
Vue.use(Router)
var router = new Router({
  mode: 'history',
  routes: [
    {
      name: 'SocialMediaActivityCreate',
      path: '/SocialMediaActivityCreate',
      component: SocialMediaActivityCreate
    },
    {
      name: 'ContactCollection',
      path: '/ContactCollection',
      component: ContactCollection
      },
      {
        name: 'TicketList',
        path: '/TicketList',
        component: TicketList
        }
  ]
})

export default router