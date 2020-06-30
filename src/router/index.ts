import Vue from 'vue';
import VueRouter, { RouteConfig, Route, NavigationGuardNext } from 'vue-router';
import Login from '../views/Login.vue';


Vue.use(VueRouter);

// function loggedInRedirectDashboard(to: Route, from: Route, next: NavigationGuardNext<Vue>){
 
//   fetch(authCheckURL, { method: "GET" , credentials:'include'})
//   .then(response => response.json())
//   .then(result => {
//     if(result && result.authenticated){
//       this.$router.push('/dashboard');
//     }
//   });  
  
//   if(localStorage.token){
//     next('/dashboard');
//   } else {
//     next();
//   }
// };





//   const routes: Array<RouteConfig> = [
//   {
//     path: '/login',
//     name: 'login',
//     component: Login,
//    // beforeEnter:loggedInRedirectDashboard
//   },
//   {
//     path: '/about',
//     name: 'About',
//     // route level code-splitting
//     // this generates a separate chunk (about.[hash].js) for this route
//     // which is lazy-loaded when the route is visited.
//     component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),  
//   },
//   {
//     path: '/dashboard',
//     name: 'dashboard',
//     // route level code-splitting
//     // this generates a separate chunk (about.[hash].js) for this route
//     // which is lazy-loaded when the route is visited.
//     component: () => import(/* webpackChunkName: "about" */ '../views/Dashboard.vue'),
//     //beforeEnter:isLoggedIn
//   },
//   {
//     path: '/clients',
//     name: 'clients',
//     // route level code-splitting
//     // this generates a separate chunk (about.[hash].js) for this route
//     // which is lazy-loaded when the route is visited.
//     component: () => import(/* webpackChunkName: "about" */ '../components/clients.vue'),
//     //beforeEnter:isLoggedIn
//   }
// ];

// const router = new VueRouter({
//   mode: 'history',
//   base: process.env.BASE_URL,
//   routes
// });

// export default router
export default new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      component: () => import('@/views/dashboard/Index.vue'),
      children: [
        // Dashboard
        
        {
          name: 'Dashboard',
          path: '',
          component: () => import('@/views/dashboard/Dashboard.vue'),
        },
        {
          path: '/login',
          name: 'login',
          component: Login,
         // beforeEnter:loggedInRedirectDashboard
        },
        // Pages
        {
          name: 'User Profile',
          path: 'pages/user',
          component: () => import('@/views/dashboard/pages/UserProfile.vue'),
        },
        {
          name: 'Notifications',
          path: 'components/notifications',
          component: () => import('@/views/dashboard/component/Notifications.vue'),
        },
        {
          name: 'Icons',
          path: 'components/icons',
          component: () => import('@/views/dashboard/component/Icons.vue'),
        },
        {
          name: 'Typography',
          path: 'components/typography',
          component: () => import('@/views/dashboard/component/Typography.vue'),
        },
        // Tables
        {
          name: 'Regular Tables',
          path: 'tables/regular-tables',
          component: () => import('@/views/dashboard/tables/RegularTables.vue'),
        },
        // Maps
        {
          name: 'Google Maps',
          path: 'maps/google-maps',
          component: () => import('@/views/dashboard/maps/GoogleMaps.vue'),
        },
        {
          name:'Warehouse Overview',
          path:'/sisense/wh-overview',
          component:() => import('@/views/dashboard/pages/WarehouseOverview.vue')
        }
       
      ],
    },
  ],
})
