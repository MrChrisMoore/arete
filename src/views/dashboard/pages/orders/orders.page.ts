import Vue from 'vue';
import Component from 'vue-class-component';
import { DataTableHeader } from 'vuetify';

@Component({
  components: {
  },
  name: 'orders-page',
})

export default class OrdersPage extends Vue {
  headers:DataTableHeader[] = [];
  items = [];
loading = true;
  // async mounted() {
  //   let response = await this.reportsApi.getReportsKcorders();
  //   if (response && response.length) {
  //     this.loading =false;
  //     Object.keys(response[0]).map((v) => {
  //       let header:DataTableHeader ={
  //         sortable: true,
  //         text: v,
  //         value: v,
  //         width:'auto',
  //         groupable:true,
  //         filterable:true,
  //         divider:true
          
  //       }
  //       this.headers.push(header);
  //     });

  //     this.items = response;
  //   }
  // }
}


