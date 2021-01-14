<template>
  <v-app-bar id="app-bar" fixed app flat dense>
    <v-progress-linear
      :active="loading"
      :indeterminate="true"
      absolute
      bottom
      color="info"
    ></v-progress-linear>
    <v-btn
      class="mr-3 hidden-lg-and-up"
      elevation="1"
      fab
      small
      @click="setDrawer(!drawer)"
    >
      <v-icon v-if="value">mdi-view-quilt</v-icon>

      <v-icon v-else>mdi-dots-vertical</v-icon>
    </v-btn>

    <v-toolbar-title class="font-weight-light" v-text="$route.name" />

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
      <!-- <template v-slot:activator="{ on, attrs }">
        <v-btn color="error" v-bind="attrs" v-on="on"> BETA </v-btn>
      </template> -->
      <v-card>
        <v-toolbar color="warning">
          <!-- <v-btn icon @click="disclaimer = false">
            <v-icon>mdi-close</v-icon>
          </v-btn> -->
          <v-toolbar-title class="">Arete Beta Disclaimer</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn text color="success" @click="disclaimer = false">
              <v-icon>mdi-check</v-icon>
              I Understand
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <article class="container">
          <v-list three-line subheader>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title class="text-h5 "> SCOPE</v-list-item-title>
                <!-- <v-list-item-subtitle> -->
                Your use of the Arete Portal (the “Portal”) is limited to that
                of a beta tester and for your own internal purposes. The Portal
                and all affiliated materials including documentation and
                information provided is copyrighted. Solely for the term of the
                beta test and subject to your compliance with any terms and
                conditions provided by FST Logistics, FST Logistics grants you a
                limited, revocable, non-transferable, non-exclusive license to
                use the Portal for your own internal business purposes. FST
                Logistics is not granting you any ownership right or other
                intellectual property right in the Portal or any affiliated
                documentation or information other than the limited right to
                use.
                <!-- </v-list-item-subtitle> -->
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title class="text-h5 "> BETA </v-list-item-title>
                The Portal is provided on a pre-release, “beta” or “evaluation”
                basis in order to permit FST Logistics to test the functionality
                thereof (“Beta Services”). The Portal and associated
                documentation, information, and services are in the nature of
                pilot, limited release, developer preview, non-production,
                evaluation services. Use of the Portal shall be subject to all
                use restrictions specified by FST Logistics. You acknowledge
                that the Portal may not be complete or fully functional and may
                contain bugs, errors, omissions and other problems. Furthermore,
                while FST Logistics may use good faith efforts to assist you
                with use of Portal, FST Logistics provides the Portal “AS IS”
                without any support, warranty, maintenance, error correction or
                other obligation of any kind. FST Logistics may revoke your
                right to use the Portal at any time without incurring any
                liability and does not guarantee that future versions of the
                Portal will be made available under the same commercial or other
                terms.
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title class="text-h5 ">BETA TESTERS DUTIES</v-list-item-title>
                You agree to report any flaws, errors or imperfections
                discovered in any software or other materials relating to your
                use of the Portal. You understand that prompt and accurate
                reporting is the purpose of the this beta test and undertake to
                use best efforts to provide frequent reports on all aspects of
                the Portal both positive and negative and acknowledges that any
                improvements, modifications and changes arising from or in
                connection with the your use of the Portal, remain or become the
                exclusive property of FST Logistics.
              </v-list-item-content>
            </v-list-item>

            <v-list-item>
              <v-list-item-content>
                <v-list-item-title class="text-h5 ">CONFIDENTIALITY</v-list-item-title >
                You acknowledge that you may receive or become aware of
                confidential information and trade secrets of FST Logistics
                (“Confidential Information”). The Portal and its underlying
                software components are expressly included within the
                Confidential Information of FST Logistics. You agree to maintain
                and protect the confidentiality of all Confidential Information
                of which you becomes aware (whether or not identified or marked
                as confidential at the time of its disclosure) and not disclose
                any Confidential Information to any person, firm, or entity, and
                you shall preserve and protect the confidentiality of all
                Confidential Information with the same degree of care that you
                uses to protect your own trade secrets, but never less than
                reasonable care. Violations of these confidentiality obligations
                are likely to cause irreparable harm and therefore FST Logistics
                may seek immediate injunctive relief without the need of posting
                bond in the event of a violation the same.
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title class="text-h5 ">DISCLAIMER</v-list-item-title>
                FST LOGISTICS MAKES NO REPRESENTATIONS OR WARRANTIES, WHETHER
                EXPRESS, IMPLIED, OR STATUTORY, REGARDING OR RELATING TO THE
                PORTAL AND ACCESS TO THE PORTAL AND THE SERVICES AND INFORMATION
                PROVIDED THEREIN ARE DISTRIBUTED AND LICENSED “AS-IS”, WITH NO
                WARRANTIES WHATSOEVER, EXPRESS OR IMPLIED, INCLUDING, WITHOUT
                LIMITATION, WARRANTIES OF MERCHANTABILITY, QUALITY, FITNESS FOR
                ANY PARTICULAR PURPOSE (OR ANY GENERAL PURPOSE) OR
                NON-INFRINGEMENT OF PATENTS, COPYRIGHTS, OR OTHER PROPRIETARY
                RIGHTS OF OTHERS. FST LOGISTICS ALSO DOES NOT GUARANTEE THAT
                YOUR ACCESS TO OR USE OF THE PORTAL WILL BE UNINTERRUPTED, ERROR
                FREE, OR SECURE. FST LOGISTICS DOES NOT WARRANT THE ACCURACY,
                RELIABILITY, COMPLETENESS, OR TIMELINESS OF THE CONTENT OF
                INTERNET WEBSITES OR OTHER DATA RECEIVED BY YOU VIA THE
                INTERNET.
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title class="text-h5 ">
                  LIMITATION OF LIABILITY</v-list-item-title >
                NEITHER FST LOGISTICS NOR ANY OF ITS AFFILIATES, OFFICERS,
                DIRECTORS, EMPLOYEES, AGENTS, OR REPRESENTATIVES SHALL BE, UNDER
                ANY CIRCUMSTANCES, LIABLE TO YOU OR ANY OTHER PERSON, FIRM, OR
                ENTITY (WHETHER IN AN ACTION ARISING FROM CONTRACT, TORT, OR
                OTHER LEGAL THEORY) FOR SPECIAL, INCIDENTAL, CONSEQUENTIAL,
                EXEMPLARY, OR OTHER DAMAGES RESULTING FROM THE ACCESS OR USE OF
                THE PORTAL, OR OTHERWISE, HOWEVER CAUSED, INCLUDING, WITHOUT
                LIMITATION, SUCH DAMAGES ARISING FROM (I) INFORMATION OR DATA
                OBTAINED FROM OR THROUGH THE PORTAL, (II) RELIANCE BY ANY PERSON
                ON INFORMATION OR DATA OBTAINED FROM OR THROUGH THE PORTAL,
                (III) VIRUS TRANSMISSION OR DELETION OR LOSS OF FILES OR E-MAIL,
                (IV) LOSS OF DATA OR INFORMATION OF ANY KIND, (V) LOSS OF
                PROFIT, GOODWILL, USE, DATA, OR OTHER INTANGIBLE LOSSES (EVEN IF
                FST LOGISTICS HAS BEEN ADIVSED OF THE POSSIBILITY OF SUCH
                DAMAGES), (VI) LIABILITY FOR PERSONAL INJURY, OR (VII) LIABILITY
                TO THIRD PARTIES.
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </article>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="tempViewDisclaimer"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn color="error" v-bind="attrs" v-on="on"> BETA </v-btn>
      </template>
      <v-card>
        <v-toolbar color="warning">
          <!-- <v-btn icon @click="disclaimer = false">
            <v-icon>mdi-close</v-icon>
          </v-btn> -->
          <v-toolbar-title class="">Arete Beta Disclaimer</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn text color="success" @click="tempViewDisclaimer = false">
              <v-icon>mdi-check</v-icon>
             Hide
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <article class="container">
          <v-list three-line subheader>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title class="text-h5 "> SCOPE</v-list-item-title>
                <!-- <v-list-item-subtitle> -->
                Your use of the Arete Portal (the “Portal”) is limited to that
                of a beta tester and for your own internal purposes. The Portal
                and all affiliated materials including documentation and
                information provided is copyrighted. Solely for the term of the
                beta test and subject to your compliance with any terms and
                conditions provided by FST Logistics, FST Logistics grants you a
                limited, revocable, non-transferable, non-exclusive license to
                use the Portal for your own internal business purposes. FST
                Logistics is not granting you any ownership right or other
                intellectual property right in the Portal or any affiliated
                documentation or information other than the limited right to
                use.
                <!-- </v-list-item-subtitle> -->
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title class="text-h5 "> BETA </v-list-item-title>
                The Portal is provided on a pre-release, “beta” or “evaluation”
                basis in order to permit FST Logistics to test the functionality
                thereof (“Beta Services”). The Portal and associated
                documentation, information, and services are in the nature of
                pilot, limited release, developer preview, non-production,
                evaluation services. Use of the Portal shall be subject to all
                use restrictions specified by FST Logistics. You acknowledge
                that the Portal may not be complete or fully functional and may
                contain bugs, errors, omissions and other problems. Furthermore,
                while FST Logistics may use good faith efforts to assist you
                with use of Portal, FST Logistics provides the Portal “AS IS”
                without any support, warranty, maintenance, error correction or
                other obligation of any kind. FST Logistics may revoke your
                right to use the Portal at any time without incurring any
                liability and does not guarantee that future versions of the
                Portal will be made available under the same commercial or other
                terms.
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title class="text-h5 ">BETA TESTERS DUTIES</v-list-item-title>
                You agree to report any flaws, errors or imperfections
                discovered in any software or other materials relating to your
                use of the Portal. You understand that prompt and accurate
                reporting is the purpose of the this beta test and undertake to
                use best efforts to provide frequent reports on all aspects of
                the Portal both positive and negative and acknowledges that any
                improvements, modifications and changes arising from or in
                connection with the your use of the Portal, remain or become the
                exclusive property of FST Logistics.
              </v-list-item-content>
            </v-list-item>

            <v-list-item>
              <v-list-item-content>
                <v-list-item-title class="text-h5 ">CONFIDENTIALITY</v-list-item-title >
                You acknowledge that you may receive or become aware of
                confidential information and trade secrets of FST Logistics
                (“Confidential Information”). The Portal and its underlying
                software components are expressly included within the
                Confidential Information of FST Logistics. You agree to maintain
                and protect the confidentiality of all Confidential Information
                of which you becomes aware (whether or not identified or marked
                as confidential at the time of its disclosure) and not disclose
                any Confidential Information to any person, firm, or entity, and
                you shall preserve and protect the confidentiality of all
                Confidential Information with the same degree of care that you
                uses to protect your own trade secrets, but never less than
                reasonable care. Violations of these confidentiality obligations
                are likely to cause irreparable harm and therefore FST Logistics
                may seek immediate injunctive relief without the need of posting
                bond in the event of a violation the same.
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title class="text-h5 ">DISCLAIMER</v-list-item-title>
                FST LOGISTICS MAKES NO REPRESENTATIONS OR WARRANTIES, WHETHER
                EXPRESS, IMPLIED, OR STATUTORY, REGARDING OR RELATING TO THE
                PORTAL AND ACCESS TO THE PORTAL AND THE SERVICES AND INFORMATION
                PROVIDED THEREIN ARE DISTRIBUTED AND LICENSED “AS-IS”, WITH NO
                WARRANTIES WHATSOEVER, EXPRESS OR IMPLIED, INCLUDING, WITHOUT
                LIMITATION, WARRANTIES OF MERCHANTABILITY, QUALITY, FITNESS FOR
                ANY PARTICULAR PURPOSE (OR ANY GENERAL PURPOSE) OR
                NON-INFRINGEMENT OF PATENTS, COPYRIGHTS, OR OTHER PROPRIETARY
                RIGHTS OF OTHERS. FST LOGISTICS ALSO DOES NOT GUARANTEE THAT
                YOUR ACCESS TO OR USE OF THE PORTAL WILL BE UNINTERRUPTED, ERROR
                FREE, OR SECURE. FST LOGISTICS DOES NOT WARRANT THE ACCURACY,
                RELIABILITY, COMPLETENESS, OR TIMELINESS OF THE CONTENT OF
                INTERNET WEBSITES OR OTHER DATA RECEIVED BY YOU VIA THE
                INTERNET.
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title class="text-h5 ">
                  LIMITATION OF LIABILITY</v-list-item-title >
                NEITHER FST LOGISTICS NOR ANY OF ITS AFFILIATES, OFFICERS,
                DIRECTORS, EMPLOYEES, AGENTS, OR REPRESENTATIVES SHALL BE, UNDER
                ANY CIRCUMSTANCES, LIABLE TO YOU OR ANY OTHER PERSON, FIRM, OR
                ENTITY (WHETHER IN AN ACTION ARISING FROM CONTRACT, TORT, OR
                OTHER LEGAL THEORY) FOR SPECIAL, INCIDENTAL, CONSEQUENTIAL,
                EXEMPLARY, OR OTHER DAMAGES RESULTING FROM THE ACCESS OR USE OF
                THE PORTAL, OR OTHERWISE, HOWEVER CAUSED, INCLUDING, WITHOUT
                LIMITATION, SUCH DAMAGES ARISING FROM (I) INFORMATION OR DATA
                OBTAINED FROM OR THROUGH THE PORTAL, (II) RELIANCE BY ANY PERSON
                ON INFORMATION OR DATA OBTAINED FROM OR THROUGH THE PORTAL,
                (III) VIRUS TRANSMISSION OR DELETION OR LOSS OF FILES OR E-MAIL,
                (IV) LOSS OF DATA OR INFORMATION OF ANY KIND, (V) LOSS OF
                PROFIT, GOODWILL, USE, DATA, OR OTHER INTANGIBLE LOSSES (EVEN IF
                FST LOGISTICS HAS BEEN ADIVSED OF THE POSSIBILITY OF SUCH
                DAMAGES), (VI) LIABILITY FOR PERSONAL INJURY, OR (VII) LIABILITY
                TO THIRD PARTIES.
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
import { mapState, mapMutations,ma } from "vuex";

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
    tempViewDisclaimer:false
  }),

  computed: {
    ...mapState({
      drawer: (state) => state.drawer,
      loading: (state) => {
        return state.loader.loading;
      },
    
    }),
      disclaimer: {
        
        get(){
          
          return this.$store.state.disclaimer.showDisclaimer
          },
        set(value){ 
          if(!value){
            this.$store.dispatch('disclaimer/hideDisclaimer',value)
          }          
          }
      }
  },

  methods: {
    ...mapMutations({
      setDrawer: "SET_DRAWER",
      // showDisclaimer:"showDisclaimer",
      hideDisclaimer:"disclaimer/hide",
    }),
    logout() {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      this.$router.push("/login");
    },
  },
};
</script>
