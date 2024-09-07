import {createRouter, createWebHashHistory} from 'vue-router'
import Home from '../views/Home.vue'
import Stretch from '../views/Stretch.vue'
// import Profile from '../views/Profile.vue'
// import User from '../views/User.vue'
// import ArticleView from '../views/ArticleView.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      meta: {
        title: 'Home'
      }
    },
    {
      path: '/stretch',
      name: 'Stretch',
      component: Stretch,
      meta: {
        title: 'Stretch'
      }
    },
    // {
    //   path: '/profile',
    //   name: 'Profile',
    //   component: Profile,
    //   meta: {
    //     title: 'Profile'
    //   }
    // },
    // {
    //   path: '/user',
    //   name: 'User',
    //   component: User,
    //   meta: {
    //     title: 'User'
    //   }
    // },
    // {
    //   path: '/articleview',
    //   name: 'ArticleView',
    //   component: ArticleView,
    //   meta: {
    //     title: 'ArticleView'
    //   }
    // }
  ]
})

const DEFAULT_TITLE = 'TITLE';

router.afterEach((to) => {
  document.title = to.meta.title ?? DEFAULT_TITLE
})

export default router
