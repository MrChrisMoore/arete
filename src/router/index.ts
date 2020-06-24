import Vue from 'vue';
import VueRouter, { RouteConfig, Route, NavigationGuardNext } from 'vue-router';
import Login from '../views/Login.vue';


Vue.use(VueRouter);

function loggedInRedirectDashboard(to: Route, from: Route, next: NavigationGuardNext<Vue>){
    if(localStorage.token){
    next('/dashboard');
  } else {
    next();
  }
};
// function isLoggedIn(to: Route, from: Route, next: NavigationGuardNext<Vue>){
//   if(localStorage.token){
//     next();
//   } else {
//     next('/login');
//   }
// };
  const routes: Array<RouteConfig> = [
  {
    path: '/login',
    name: 'login',
    component: Login,
    beforeEnter:loggedInRedirectDashboard
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),  
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Dashboard.vue'),
    //beforeEnter:isLoggedIn
  },
  {
    path: '/clients',
    name: 'clients',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../components/clients.vue'),
    //beforeEnter:isLoggedIn
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

export default router
