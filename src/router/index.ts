import Vue from "vue";
import VueRouter, { RouteConfig, Route, NavigationGuardNext } from "vue-router";
import Login from "../views/Login.vue";
import VerificationComponent from "@/components/login/verification/index.vue";
import ChangePage from '@/components/login/change/index.vue';

Vue.use(VueRouter);
const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      component: () => import("@/views/dashboard/Index.vue"),
      children: [
        // Dashboard

        {
          name: "Examples",
          path: "",
          
          component: () => import("@/views/dashboard/Dashboard.vue"),
          meta: {
            requiresAuth: true,
          },
        },
        {
          path: "/login",
          name: "login",
          component: Login,
          meta: {
            guest: true,
          },
          // beforeEnter:loggedInRedirectDashboard
        },
        {
          path: "/verify",
          name: "verify",
          component: VerificationComponent,
          meta: {
            requiresAuth: true,
          },
          // beforeEnter:loggedInRedirectDashboard
        },
        {
          path: "/change",
          name: "change",
          component: ChangePage,
          meta: {
            requiresAuth: true,
          },
          // beforeEnter:loggedInRedirectDashboard
        },
        // Pages
        {
          name: "User Profile",
          path: "pages/user",
          component: () => import("@/views/dashboard/pages/UserProfile.vue"),
          meta: {
            requiresAuth: true,
          },
        },
        {
          name: "Notifications",
          path: "components/notifications",
          component: () =>
            import("@/views/dashboard/component/Notifications.vue"),
          meta: {
            requiresAuth: true,
          },
        },
        {
          name: "Icons",
          path: "components/icons",
          component: () => import("@/views/dashboard/component/Icons.vue"),
          meta: {
            requiresAuth: true,
          },
        },
        {
          name: "Typography",
          path: "components/typography",
          component: () => import("@/views/dashboard/component/Typography.vue"),
          meta: {
            requiresAuth: true,
          },
        },
        // Tables
        {
          name: "Regular Tables",
          path: "tables/regular-tables",
          component: () => import("@/views/dashboard/tables/RegularTables.vue"),
          meta: {
            requiresAuth: true,
          },
        },
        // Maps
        {
          name: "Google Maps",
          path: "maps/google-maps",
          component: () => import("@/views/dashboard/maps/GoogleMaps.vue"),
          meta: {
            requiresAuth: true,
          },
        },
        {
          name: "Warehouse Overview",
          path: "/sisense/wh-overview",
          component: () =>
            import("@/views/dashboard/pages/WarehouseOverview.vue"),
          meta: {
            requiresAuth: true,
          },
        },
        {
          name: "Orders",
          path: "/sisense/orders",
          component: () =>
            import("@/views/dashboard/pages/Orders.vue"),
          meta: {
            requiresAuth: true,
          },
        },
        {
          name: "Inventory",
          path: "/reports/inventory",
          component: () =>
            import("@/views/dashboard/pages/inventory/index.vue"),
          meta: {
            requiresAuth: true,
          },
        },
        {
          name: "Orders",
          path: "/reports/orders",
          component: () =>
            import("@/views/dashboard/pages/orders/index.vue"),
          meta: {
            requiresAuth: true,
          },
        },
        {
          name: "Inventory",
          path: "/reports/sku",
          component: () =>
            import("@/views/dashboard/pages/sku/index.vue"),
          meta: {
            requiresAuth: true,
          },
        },
        {
          name: "TruckMate Orders",
          path: "/tmw/orders",
          component: () =>
            import("@/views/dashboard/pages/tmw/orders/index.vue"),
          meta: {
            requiresAuth: true,
          },
        },
        {
          name: "Accessorials",
          path: "/tmw/accessorials",
          component: () =>
            import("@/views/dashboard/pages/tmw/accessorials/index.vue"),
          meta: {
            requiresAuth: true,
          },
        },
        {
          name: "On Time Delivery and Sailing Schedule",
          path: "/tmw/otd-ss",
          component: () =>
            import("@/views/dashboard/pages/tmw/otd-ss/index.vue"),
          meta: {
            requiresAuth: true,
          },
        },
        {
          name: "Order Info",
          path: "/tmw/orderinfo",
          component: () =>
            import("@/views/dashboard/pages/tmw/orderinfo/index.vue"),
          meta: {
            requiresAuth: true,
          },
        },
      ],
    },
  ],
});

router.beforeEach((to, from, next) => {
  let token = localStorage.getItem('token');
  let user = JSON.parse(localStorage.getItem('user'));
  let tempVerifcation = JSON.parse(localStorage.getItem('tempVerification'))
  // check if the route requires auth
  if(to.matched.some((record) =>record.meta.requiresAuth)){
    // the route does require auth
    if(!token || !user){
      // no token or user send to login
      next({name:'login',  params: { nextUrl: to.fullPath }});
    }else{
     // we have a user and a token check if verified
      if(!user.verified && to.path !== '/verify' && !tempVerifcation){
        next({name:'verify'});
      }else{
        if(user.needsNewPassword && to.path !== '/change'){
          next({name:'change'})
        }else{

          next();
        }
      }
      // if (user.verified || to.path === '/verify' || (tempVerifcation && tempVerifcation.valid)) {
      //   // user has previously verified, just completed verification, or is going to verification page

      // }
    }
    console.log('Made it here for some reason');
    //next();
  }else{
    next();
  }



  
});

export default router;
