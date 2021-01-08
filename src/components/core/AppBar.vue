<template>
  <v-app-bar id="app-bar" fixed  app  flat dense >
     <v-progress-linear
        :active="loading"
        :indeterminate="true"
        absolute
        bottom
        color="info"
      ></v-progress-linear>
    <v-btn class="mr-3 hidden-lg-and-up" elevation="1" fab small @click="setDrawer(!drawer)">
      <v-icon v-if="value">mdi-view-quilt</v-icon>

      <v-icon v-else>mdi-dots-vertical</v-icon>
    </v-btn>

    <v-toolbar-title class=" font-weight-light" v-text="$route.name" />

    <v-spacer />

    <!-- <v-text-field :label="$t('search')" color="secondary" hide-details style="max-width: 165px;">
      <template v-if="$vuetify.breakpoint.mdAndUp" v-slot:append-outer>
        <v-btn class="mt-n2" elevation="1" fab small>
          <v-icon>mdi-magnify</v-icon>
        </v-btn>
      </template>
    </v-text-field> -->

    <div class="mx-3" />
    
    <v-btn class="ml-2" min-width="0" text to="/">
      <v-icon>mdi-view-dashboard</v-icon>
    </v-btn>

    <!-- <v-menu bottom left offset-y origin="top right"   transition="scale-transition">
      <template v-slot:activator="{ attrs, on }">
        <v-btn class="ml-2 d-none d-md-flex" min-width="0" text v-bind="attrs" v-on="on">
          <v-badge color="red" overlap bordered>
            <template v-slot:badge>
              <span>{{notifications.length}}</span>
            </template>

            <v-icon>mdi-bell</v-icon>
          </v-badge>
        </v-btn>
      </template>

      <v-list :tile="false" nav>
        <div>
          <app-bar-item v-for="(n, i) in notifications" :key="`item-${i}`">
            <v-list-item-title v-text="n" />
          </app-bar-item>
        </div>
      </v-list>
    </v-menu> -->

    <v-btn class="ml-2" min-width="0" text to="/pages/user">
      <v-icon>mdi-account</v-icon>
    </v-btn>
    <v-btn class="ml-2" min-width="0" text @click="logout()">
      <v-icon>mdi-logout</v-icon>
    </v-btn>
  <v-dialog
      v-model="disclaimer"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          color="error"
          
          v-bind="attrs"
          v-on="on"
        >
          BETA
        </v-btn>
      </template>
      <v-card>
        <v-toolbar          
          color="warning"
        >
          <v-btn
            icon            
            @click="disclaimer = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>Disclaimer</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn             
              text
              color="success"
              @click="disclaimer = false"
            >
            <v-icon>mdi-check</v-icon>
              I Understand
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <article class="container">
        <v-list
          three-line
          subheader
          
        >
          
<v-list-item>
   <v-list-item-content >
              <v-list-item-title class="text-h5"> SCOPE OF THIS AGREEMENT</v-list-item-title>
              <!-- <v-list-item-subtitle> -->
                The Software-Product accompanying this Agreement as a pre-release copy and all affiliated materials,
 including documentation and information (collectively the “Product”), is copyrighted. 
 Scope of this agreement is the licensing (not selling) of the “Product” to You, as the ‘user’ (either an individual or an entity).
  FST Logistics reserves all rights not expressly granted.
  <!-- </v-list-item-subtitle> -->
         


            </v-list-item-content>

</v-list-item>
<v-list-item >
            <v-list-item-content>
              <v-list-item-title class="text-h5">BETA TESTERS DUTIES</v-list-item-title>
              <!-- <v-list-item-subtitle> -->
                Beta Tester agrees to report any flaws, errors or imperfections discovered in any software or other materials where Beta Tester has been granted access to the Beta Test.
 Beta Tester understands that prompt and accurate reporting is the purpose of the Beta Tests and undertakes to use best efforts to provide frequent reports on all aspects of the product 
 both positive and negative and acknowledges that any improvements, modifications and changes arising from or in connection with the Beta Testers contribution to the Project,
  remain or become the exclusive property of the Disclosing Party
<!-- </v-list-item-subtitle> -->
            </v-list-item-content>
          </v-list-item>

<v-list-item >
            <v-list-item-content >
              <v-list-item-title class="text-h5">CONFIDENTIALITY</v-list-item-title>
              <!-- <v-list-item-subtitle> -->
                The Tester will not disclose Software or any comments regarding Software to any third party without the prior written approval of FST Logistics. The Tester will maintain the confidentiality of Software with at least the same degree of care that you use to protect your own confidential and proprietary information, but not less than a reasonable degree of care under the circumstances. The Tester will not be liable for the disclosure of any confidential information which is:

(a.) in the public domain other than by a breach of this Agreement on Tester’s part; or (b.) rightfully received from a third party without any obligation of confidentiality; or (c.) rightfully known to Tester without any limitation on use or disclosure prior to its receipt from FST Logistics; or (d.) generally made available to third parties by FST Logistics without restriction on disclosure.
<!-- </v-list-item-subtitle> -->
            </v-list-item-content>
          </v-list-item>

        </v-list>
        </article>
      </v-card>
    </v-dialog>
  </v-app-bar>
</template>

<script>
// Components
import { VHover, VListItem } from "vuetify/lib";
// Utilities
import { mapState, mapMutations } from "vuex";

export default {
  name: "DashboardCoreAppBar",

  components: {
    AppBarItem: {
      render(h) {
        return h(VHover, {
          scopedSlots: {
            default: ({ hover }) => {
              return h(
                VListItem,
                {
                  attrs: this.$attrs,
                  class: {
                    "black--text": !hover,
                    "white--text secondary elevation-12": hover,
                  },
                  props: {
                    activeClass: "",
                    dark: hover,
                    link: true,
                    ...this.$attrs,
                  },
                },
                this.$slots.default
              );
            },
          },
        });
      },
    },
  },

  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },

  data: () => ({
    notifications: [
      // "Mike John Responded to your email",
      // "You have 4 new tasks",
      // "Another Notification",
      // "Another one",
    ],
    disclaimer:false
  }),

  computed: {
    ...mapState({
      drawer:state =>state.drawer,
      loading: (state)=>{     
      return state.loader.loading
      }
      }),
  },

  methods: {
    ...mapMutations({
      setDrawer: "SET_DRAWER",
    }),
    logout() {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      this.$router.push("/login");
    },
  
  },
};
</script>
