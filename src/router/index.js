import {createRouter, createWebHashHistory} from 'vue-router'
import Home from '../views/Home.vue'
import Stretch from '../views/Stretch.vue'
import Home2 from '../views/Home2.vue'
import Login from '../views/Login.vue'
import SymptomSelect from '../views/SymptomSelect.vue'
import StretchRecord from '../views/StretchRecord.vue'
import YotuStretch01 from '../views/YotuStretch01.vue'
import YotuStretch02 from '../views/YotuStretch02.vue'
import YotuStretch03 from '../views/YotuStretch03.vue'
import KatakoriStretch01 from '../views/KatakoriStretch01.vue'
import KatakoriStretch02 from '../views/KatakoriStretch02.vue'
import KatakoriStretch03 from '../views/KatakoriStretch03.vue'
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
    {
      path: '/stretch-record',
      name: 'StretchRecord',
      component: StretchRecord,
      meta: {
        title: 'StretchRecord'
      }
    },
    {
      path: '/stretch-record',
      name: 'StretchRecord',
      component: StretchRecord,
      meta: {
        title: 'StretchRecord'
      }
    },
    {
      path: '/yotustretch01',
      name: 'YotuStretch01',
      component: YotuStretch01,
      meta: {
        title: 'YotuStretch01'
      }
    },
    {
      path: '/yotustretch02',
      name: 'YotuStretch02',
      component: YotuStretch02,
      meta: {
        title: 'YotuStretch02'
      }
    },
    {
      path: '/yotustretch03',
      name: 'YotuStretch03',
      component: YotuStretch03,
      meta: {
        title: 'YotuStretch03'
      }
    },
    {
      path: '/katakoristretch01',
      name: 'KatakoriStretch01',
      component: KatakoriStretch01,
      meta: {
        title: 'KatakoriStretch01'
      }
    },
    {
      path: '/katakoristretch02',
      name: 'KatakoriStretch02',
      component: KatakoriStretch02,
      meta: {
        title: 'KatakoriStretch02'
      }
    },
    {
      path: '/katakoristretch03',
      name: 'KatakoriStretch03',
      component: KatakoriStretch03,
      meta: {
        title: 'KatakoriStretch03'
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
