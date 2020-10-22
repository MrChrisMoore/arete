<template>
  <v-container id="dashboard" fluid tag="section">
    <v-row>
      <v-col cols="12" lg="4">
        <base-material-chart-card
          :data="emailsSubscriptionChart.data"
          :options="emailsSubscriptionChart.options"
          :responsive-options="emailsSubscriptionChart.responsiveOptions"
          color="#E91E63"
          hover-reveal
          type="Bar"
        >
          <template v-slot:reveal-actions>
            <v-tooltip bottom>
              <template v-slot:activator="{ attrs, on }">
                <v-btn v-bind="attrs" color="info" icon v-on="on">
                  <v-icon color="info">mdi-refresh</v-icon>
                </v-btn>
              </template>

              <span>Refresh</span>
            </v-tooltip>

            <v-tooltip bottom>
              <template v-slot:activator="{ attrs, on }">
                <v-btn v-bind="attrs" light icon v-on="on">
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
              </template>

              <span>Change Date</span>
            </v-tooltip>
          </template>

          <h4 class="card-title font-weight-light mt-2 ml-2">Orders by Month</h4>

          <p class="d-inline-flex font-weight-light ml-2 mt-1">Last Campaign Performance</p>

          <template v-slot:actions>
            <v-icon class="mr-1" small>mdi-clock-outline</v-icon>
            <span class="caption grey--text font-weight-light">updated 10 minutes ago</span>
          </template>
        </base-material-chart-card>
      </v-col>

      <v-col cols="12" lg="4">
        <base-material-chart-card
          :data="dailySalesChart.data"
          :options="dailySalesChart.options"
          color="success"
          hover-reveal
          type="Line"
        >
          <template v-slot:reveal-actions>
            <v-tooltip bottom>
              <template v-slot:activator="{ attrs, on }">
                <v-btn v-bind="attrs" color="info" icon v-on="on">
                  <v-icon color="info">mdi-refresh</v-icon>
                </v-btn>
              </template>

              <span>Refresh</span>
            </v-tooltip>

            <v-tooltip bottom>
              <template v-slot:activator="{ attrs, on }">
                <v-btn v-bind="attrs" light icon v-on="on">
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
              </template>

              <span>Change Date</span>
            </v-tooltip>
          </template>

          <h4 class="card-title font-weight-light mt-2 ml-2">Orders by Day</h4>

          <p class="d-inline-flex font-weight-light ml-2 mt-1">
            <v-icon color="green" small>mdi-arrow-up</v-icon>
            <span class="green--text">55%</span>&nbsp;
            increase in today's orders
          </p>

          <template v-slot:actions>
            <v-icon class="mr-1" small>mdi-clock-outline</v-icon>
            <span class="caption grey--text font-weight-light">updated 4 minutes ago</span>
          </template>
        </base-material-chart-card>
      </v-col>

      <v-col cols="12" lg="4">
        <base-material-chart-card
          :data="dataCompletedTasksChart.data"
          :options="dataCompletedTasksChart.options"
          hover-reveal
          color="info"
          type="Line"
        >
          <template v-slot:reveal-actions>
            <v-tooltip bottom>
              <template v-slot:activator="{ attrs, on }">
                <v-btn v-bind="attrs" color="info" icon v-on="on">
                  <v-icon color="info">mdi-refresh</v-icon>
                </v-btn>
              </template>

              <span>Refresh</span>
            </v-tooltip>

            <v-tooltip bottom>
              <template v-slot:activator="{ attrs, on }">
                <v-btn v-bind="attrs" light icon v-on="on">
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
              </template>

              <span>Change Date</span>
            </v-tooltip>
          </template>

          <h3 class="card-title font-weight-light mt-2 ml-2">Orders Daily</h3>

          <p class="d-inline-flex font-weight-light ml-2 mt-1">past 21 hours</p>

          <template v-slot:actions>
            <v-icon class="mr-1" small>mdi-clock-outline</v-icon>
            <span class="caption grey--text font-weight-light">campaign sent 26 minutes ago</span>
          </template>
        </base-material-chart-card>
      </v-col>

      <v-col cols="12" sm="6" lg="3">
        <base-material-stats-card
          color="info"
          icon="fas fa-pallet"
          title="Orders Today"
          value="+245"
          sub-icon="mdi-clock"
          sub-text="Just Updated"
        />
      </v-col>

      <v-col cols="12" sm="6" lg="3">
        <base-material-stats-card
          color="primary"
          icon="mdi-poll"
          title="Total Orders"
          value="75.521"
          sub-icon="mdi-tag"
          sub-text="Total for this year"
        />
      </v-col>

      <v-col cols="12" sm="6" lg="3">
        <base-material-stats-card
          color="success"
          icon="mdi-currency-usd"
          title="Revenue"
          value="$ 34,245"
          sub-icon="mdi-calendar"
          sub-text="Last 24 Hours"
        />
      </v-col>

      <v-col cols="12" sm="6" lg="3">
        <base-material-stats-card
          color="orange"
          icon="mdi-animation"
          title="Bookings"
          value="184"
          sub-icon="mdi-alert"
          sub-icon-color="red"
          sub-text="Decrease Detected..."
        />
      </v-col>

      <v-col cols="12" md="12" class="mt-2">
        <base-material-card color="warning" class="px-5 py-3">
          <template v-slot:heading class="pa-2">
            <div class="display-2 font-weight-light">Sales by Facility</div>

            <!-- <div class="subtitle-1 font-weight-light">New accounts on {{new Date()}}</div> -->
          </template>
          <v-card-text class="pt-1">
            <v-data-table :headers="headers" :items="items" />
          </v-card-text>
        </base-material-card>
      </v-col>

      <!-- <v-col cols="12" md="6" class="mt-2">
        <base-material-card class="px-5 py-3">
          <template v-slot:heading>
            <v-tabs v-model="tabs" background-color="transparent" slider-color="white">
              <span class="subheading font-weight-light mx-3" style="align-self: center">Tasks:</span>
              <v-tab class="mr-3">
                <v-icon class="mr-2">mdi-help</v-icon>Inquiries
              </v-tab>
              <v-tab class="mr-3">
                <v-icon class="mr-2">mdi-check-underline</v-icon>Todos
              </v-tab>
              <v-tab>
                <v-icon class="mr-2">mdi-lightbulb</v-icon>Ideas
              </v-tab>
            </v-tabs>
          </template>

          <v-tabs-items v-model="tabs" class="transparent">
            <v-tab-item v-for="n in 3" :key="n">
              <v-card-text>
                <template v-for="(task, i) in tasks[tabs]">
                  <v-row :key="i" align="center">
                    <v-col cols="1">
                      <v-list-item-action>
                        <v-checkbox v-model="task.value" color="secondary" />
                      </v-list-item-action>
                    </v-col>

                    <v-col cols="9">
                      <div class="font-weight-light" v-text="task.text" />
                    </v-col>

                    <v-col cols="2" class="text-right">
                      <v-icon class="mx-1">mdi-pencil</v-icon>
                      <v-icon color="error" class="mx-1">mdi-close</v-icon>
                    </v-col>
                  </v-row>
                </template>
              </v-card-text>
            </v-tab-item>
          </v-tabs-items>
        </base-material-card>
      </v-col> -->
    </v-row>
  </v-container>
</template>

<script lang='ts'>
import {AuthApi} from '../../api/apis/AuthApi';
import Vue from 'vue';
import Component from 'vue-class-component'
import { UserJson } from '@/api';

const API_URL = `${process.env.VUE_APP_API_URL}/auth`;
@Component
export default class Dash extends Vue {
  name="DashboardDashboard"


      dailySalesChart={
        data: {
          labels: ["M", "T", "W", "T", "F", "S", "S"],
          series: [[12, 17, 7, 17, 23, 18, 38]]
        },
        options: {
          lineSmooth: (this as any).$chartist.Interpolation.cardinal({
            tension: 0
          }),
          low: 0,
          high: 50, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
          chartPadding: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
          }
        }
      }
      dataCompletedTasksChart= {
        data: {
          labels: ["12am", "3pm", "6pm", "9pm", "12pm", "3am", "6am", "9am"],
          series: [[20, 750, 450, 300, 280, 240, 200, 190]]
        },
        options: {
          lineSmooth: (this as any).$chartist.Interpolation.cardinal({
            tension: 0
          }),
          low: 0,
          high: 1000, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
          chartPadding: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
          }
        }
      }
      emailsSubscriptionChart= {
        data: {
          labels: [
            "Ja",
            "Fe",
            "Ma",
            "Ap",
            "Mai",
            "Ju",
            "Jul",
            "Au",
            "Se",
            "Oc",
            "No",
            "De"
          ],
          series: [[542, 443, 320, 780, 553, 453, 326, 434, 568, 610, 756, 895]]
        },
        options: {
          axisX: {
            showGrid: false
          },
          low: 0,
          high: 1000,
          chartPadding: {
            top: 0,
            right: 5,
            bottom: 0,
            left: 0
          }
        },
        responsiveOptions: [
          [
            "screen and (max-width: 640px)",
            {
              seriesBarDistance: 5,
              axisX: {
                labelInterpolationFnc: function(value) {
                  return value[0];
                }
              }
            }
          ]
        ]
      }
      headers=[
        // {
        //   sortable: false,
        //   text: "ID",
        //   value: "id",
        // },
        {
          sortable: false,
          text: "Facility",
          value: "name"
        },
        {
          sortable: false,
          text: "Sales",
          value: "sales",
          align: "right"
        },
        // {
        //   sortable: false,
        //   text: "Country",
        //   value: "country",
        //   align: "right"
        // },
        {
          sortable: false,
          text: "City",
          value: "city",
          align: "right"
        }
      ]
      items=[
        {
          id: 1,
          name: "LA Warehouse 1",
        //  country: "USA",
          city: "Los Angelos",
          sales: "$35,738"
        },
        {
          id: 2,
          name: "CA Toronto",
         // country: "Canada",
          city: "Totonto",
          sales: "$23,738"
        },
        {
          id: 3,
          name: "MI Detroit Fac1",
        //  country: "Netherlands",
          city: "Detroit",
          sales: "$56,142"
        },
        {
          id: 4,
          name: "MI Detroit Fac2",
         // country: "Korea, South",
          city: "Detroit",
          sales: "$38,735"
        },
        {
          id: 5,
          name: "OH Columbus Fac1",
         // country: "Ireland",
          city: "Columbus",
          sales: "$63,542"
        }
      ]
      tabs= 0
      tasks={
        0: [
          {
            text: "Text of some example task",
            value: true
          },
          {
            text: "Text of another example task",
            value: false
          },
          {
            text: "Text of yet another example task",
            value: false
          },
          {
            text: "another ",
            value: true
          }
        ],
        1: [
          {
            text: "Read Emails",
            value: true
          },
          {
            text: "Do that thing your supposes to do",
            value: false
          }
        ],
        2: [
          {
            text: "Get Rich",
            value: false
          },
          {
            text: "Sell Kidney",
            value: true
          },
          {
            text: "Drive blindfolded",
            value: true
          }
        ]
      }
      list= {
        0: false,
        1: false,
        2: false
      }
  

  async mounted() {
    let user:UserJson = JSON.parse(localStorage.getItem('user'));
  

  }
  
    complete(index) {
      this.list[index] = !this.list[index];
    }

 
  
};
</script>
