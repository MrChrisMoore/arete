<template>
  <v-navigation-drawer
    id="core-navigation-drawer"
    v-model="drawer"
    :expand-on-hover="expandOnHover"
    :right="$vuetify.rtl"
    mini-variant
    app
    v-bind="$attrs"
   
  >
    <v-divider class="mb-1" />
    <v-list dense nav class="py-0">
      <v-list-item class="px-0">
        <v-list-item-avatar class="align-self-center" contain>
          <img id="logo" src="@/assets/logo.png" max-height="30" />
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title class="text-h6" v-text="profile.title" />
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <v-divider class="mb-2" />   

    <v-list expand dense nav class="py-0">
      <div />
      <template v-for="(item, i) in computedItems">
        <base-item-group v-if="item.children" :key="`group-${i}`" :item="item" ></base-item-group>
        <base-item  @click.stop="drawer = !drawer" class="px-0" v-else :key="`item-${i}`" :item="item" />
      </template>

      <!-- Style cascading bug  -->
      <!-- https://github.com/vuetifyjs/vuetify/pull/8574 -->
      <div />
    </v-list>
  </v-navigation-drawer>
</template>

<script>
// Utilities
import { mapState } from "vuex";


const URL = `${process.env.VUE_APP_API_URL}`;
//import image from '@/assets/logo.png';
export default {
  name: "DashboardCoreDrawer",

  props: {
    expandOnHover: {
      type: Boolean,
      default: true,
    },
  },

  data: () => ({
    logo: require("@/assets/logo.png"), //image,

    items: [
      // {
      //   icon: "mdi-view-dashboard",
      //   title: "Warehouse",
      //   to: "/sisense/wh-overview",
      // },
      // {
      //   icon: "mdi-account",
      //   title: "user",
      //   to: "/pages/user",
      // },
      // {
      //   title: 'rtables',
      //   icon: 'mdi-clipboard-outline',
      //   to: '/tables/regular-tables',
      // },
      // {
      //   title: 'typography',
      //   icon: 'mdi-format-font',
      //   to: '/components/typography',
      // },
      // {
      //   title: 'icons',
      //   icon: 'mdi-chart-bubble',
      //   to: '/components/icons',
      // },
      // {
      //   title: "google",
      //   icon: "mdi-map-marker",
      //   to: "/maps/google-maps",
      // },
      // {
      //   icon: "mdi-view-dashboard-variant",
      //   title: "Orders Overview",
      //   to: "/",
      // },
      // {
      //   icon: "mdi-view-dashboard-variant",
      //   title: "Inventory",
      //   to: "/reports/inventory"
      // },
      // {
      //   icon: "mdi-view-dashboard-variant",
      //   title: "Accessorials",
      //   to: "/tmw/accessorials",
      // },
      // {
      //   icon: "mdi-receipt",
      //   title: "Orders",
      //   to: "/tmw/orders",
      // },
      // {
      //   icon: "mdi-truck-delivery",
      //   title: "OTD-SS",
      //   to: "/tmw/otd-ss",
      // },
       {
       icon:'mdi-truck',
       title:'Transportation',
       children:[ {
        icon: "mdi-table-search",
        title: "Orders",
        to: "/tmw/orderinfo",
      },
        {
        icon: "mdi-view-dashboard-variant",
        title: "Order Analytics",
        to: "/",
      },]
     },
      {
        icon: "fas fa-warehouse",
        title: "Warehouse",        
        children:[
          {
          icon:'mdi-warehouse',
          title:'Shipped Orders',
          to:'/wms/shipped-orders'
        },
        {
          icon:'mdi-garage-alert',
          title:'Short Orders',
          to:'/wms/short-orders'
        }
        ]
      },
      //  {
      //   icon: "mdi-view-dashboard-variant",
      //   title: "SKU Activity",
      //   to: "/reports/sku"
      // },
      // {
      //   icon: "mdi-file-table-box-multiple",
      //   title: "My Reports",
      //   children: []
      // }
      //  {
      //   title: 'Warehouse',
      //   icon: 'mdi-view-dashboard-variant',
      //   to: '/sisense/wh-overview',
      // },
      // {
      //   title: 'notifications',
      //   icon: 'mdi-bell',
      //   to: '/components/notifications',
      // },
    ],
  }),
  
  computed: {
    ...mapState(["barColor"]),
    drawer: {
      get() {
        return this.$store.state.drawer;
      },
      set(val) {
        this.$store.commit("SET_DRAWER", val);
      },
    },
    computedItems() {
      return this.items.map(this.mapItem);
    },
    profile() {
      return {
        avatar: true,
        title: this.$t("avatar"),
      };
    },
  },

  methods: {
    mapItem(item) {
      return {
        ...item,
        children: item.children ? item.children.map(this.mapItem) : undefined,
        title: this.$t(item.title),
      };
    },
    mapReports(item) {
      return {
        icon: item.icon,
        //to:item.to,
        children: item.children
          ? item.children.map(this.mapReports)
          : undefined,
        title: this.$t(item.title || item.Name),
      };
    },
  },
};
</script>

<style lang="sass">
@import '~vuetify/src/styles/tools/_rtl.sass'


#core-navigation-drawer
  .v-list-group__header.v-list-item
    padding:2px
  .v-list--nav 
    padding-left: 8px
    padding-right: 8px
  
  .v-list-group__header.v-list-item--active:before
    opacity: .24

  .v-list-item
    &__icon--text,
    &__icon:first-child
      justify-content: center
      text-align: center
      width: 20px

      +ltr()
      margin-right: 24px
      margin-left: 12px !important

      +rtl()
      margin-left: 24px
      margin-right: 12px !important

  .v-list--dense
    .v-list-item
      &__icon--text,
      &__icon:first-child
        margin-top: 5px

  .v-list-group--sub-group
    .v-list-item
      +ltr()
      padding-left: 8px

      +rtl()
      padding-right: 8px

    .v-list-group__header
      +ltr()
      padding-right: 0

      +rtl()
      padding-right: 0

      .v-list-item__icon--text
        margin-top: 19px
        order: 0

      .v-list-group__header__prepend-icon
        order: 2

        +ltr()
        margin-right: 8px

        +rtl()
        margin-left: 8px
</style>
