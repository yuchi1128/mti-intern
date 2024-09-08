import {createRouter, createWebHashHistory} from 'vue-router'
import Home from '../views/Home.vue'
import Stretch from '../views/Stretch.vue'
import Home2 from '../views/Home2.vue'
import Login from '../views/Login.vue'
import SymptomSelect from '../views/SymptomSelect.vue'
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
    {
      path: '/home2',
      name: 'Home2',
      component: Home2,
      meta: {
        title: 'Home2'
      }
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
      meta: {
        title: 'Login'
      }
    },
    {
      path: '/symptom-select',
      name: 'SymptomSelect',
      component: SymptomSelect,
      meta: {
        title: 'SymptomSelect'
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
