import Vue from 'vue';
import VueRouter, { RouteConfig, Route, NavigationGuardNext } from 'vue-router';
import Login from '../views/Login.vue';


Vue.use(VueRouter);
const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      component: () => import('@/views/dashboard/Index.vue'),
      children: [
        // Dashboard
        
        {
          name: 'Dashboard',
          path: 'dashboard',
          component: () => import('@/views/dashboard/Dashboard.vue'),
          meta: {
            requiresAuth: true
        }
        },
        {
          path: '/login',
          name: 'login',
          component: Login,
          meta:{
            guest:true
          }
         // beforeEnter:loggedInRedirectDashboard
        },
        // Pages
        {
          name: 'User Profile',
          path: 'pages/user',
          component: () => import('@/views/dashboard/pages/UserProfile.vue'),
          meta: {
            requiresAuth: true
        }
        },
        {
          name: 'Notifications',
          path: 'components/notifications',
          component: () => import('@/views/dashboard/component/Notifications.vue'),
          meta: {
            requiresAuth: true
        }
        },
        {
          name: 'Icons',
          path: 'components/icons',
          component: () => import('@/views/dashboard/component/Icons.vue'),
          meta: {
            requiresAuth: true
        }
        },
        {
          name: 'Typography',
          path: 'components/typography',
          component: () => import('@/views/dashboard/component/Typography.vue'),
          meta: {
            requiresAuth: true
        }
        },
        // Tables
        {
          name: 'Regular Tables',
          path: 'tables/regular-tables',
          component: () => import('@/views/dashboard/tables/RegularTables.vue'),
          meta: {
            requiresAuth: true
        }
        },
        // Maps
        {
          name: 'Google Maps',
          path: 'maps/google-maps',
          component: () => import('@/views/dashboard/maps/GoogleMaps.vue'),
          meta: {
            requiresAuth: true
        }
        },
        {
          name:'Warehouse Overview',
          path:'/sisense/wh-overview',
          component:() => import('@/views/dashboard/pages/WarehouseOverview.vue'),
          meta: {
            requiresAuth: true
        }
        }
       
      ],
    },
  ],
  
});

router.beforeEach((to, from, next) => {
  if(to.matched.some(record => record.meta.requiresAuth)) {
    if(process.env.LOG_VERBOSE !== 'false')console.log('Checking for token.');    
      if (!localStorage.getItem('token')) {
          next({
              path: '/login',
              params: { nextUrl: to.fullPath }
          })
      } else {
        if(process.env.LOG_VERBOSE !== 'false')console.log('Checking for User.');
          let user = JSON.parse(localStorage.getItem('user'))
          if(to.matched.some(record => record.meta.is_admin)) {
              if(user.is_admin == 1){
                  next()
              }
              else{
                  next({ name: 'Dashboard'})
              }
          }else {
              next()
          }
      }
  } else if(to.matched.some(record => record.meta.guest)) {
    if(process.env.LOG_VERBOSE !== 'false')console.log('Checking for token on guest.');
      if(localStorage.getItem('jwt') == null){
          next()
      }
      else{
          next({ name: 'Dashboard'})
      }
  }else {
      next()
  }
})



 export default router

