import Vue from 'vue'
import Router from 'vue-router'
import SocialMediaActivityCreate from '../components/SocialMediaActivityCreate';
import ContactCollection from '../components/ContactCollection';
import TicketList from '../components/TicketList';
import TicketDetail from '../components/TicketDetail/TicketDetail';
import InteractionHistory from '../components/InteractionHistory';

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
        },
      {
        name: 'TicketDetail',
        path: '/TicketDetail/:id',
        component: TicketDetail
      },
      {
        name: 'InteractionHistory',
        path: '/TicketDetail/InteractionHistory/:id',
        component: InteractionHistory
      }
  ]
})

export default router