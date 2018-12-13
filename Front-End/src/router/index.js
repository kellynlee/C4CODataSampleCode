import Vue from 'vue'
import Router from 'vue-router'
import SocialMediaActivityCreate from '../components/SocialMediaActivityCreate';
import ContactCollection from '../components/ContactCollection';
import TicketList from '../components/TicketList';
import TicketDetail from '../components/TicketDetail/TicketDetail';

Vue.use(Router)
var router = new Router({
  mode: 'history',
  scrollBehavior (to, from, savedPosition) {
    return { x: 0, y: 0 }
  },
  routes: [
    {
      name: 'SocialMediaActivityCreate',
      path: '/SocialMediaActivityCreate',
      component: SocialMediaActivityCreate,
      meta: {
        keepAlive: false,
      }
    },
    {
      name: 'ContactCollection',
      path: '/ContactCollection',
      component: ContactCollection,
      meta: {
        keepAlive: false,
      }
      },
      {
        name: 'TicketList',
        path: '/TicketList',
        component: TicketList,
        meta: {
          keepAlive: true,
          isBack:false
        }
        },
      {
        name: 'TicketDetail',
        path: '/TicketDetail/:id',
        component: TicketDetail,
        meta: {
          keepAlive: false,
        }
      }
  ]
})

export default router