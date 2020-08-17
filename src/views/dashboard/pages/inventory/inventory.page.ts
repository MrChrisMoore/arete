import Vue from "vue";
import Component from "vue-class-component";
import { ReportsApi } from "@/api/apis/ReportsApi";
import { DataTableHeader } from 'vuetify';
@Component({
  components: {},
  name: "inventory-page",
})
export default class InventoryPage extends Vue {
  headers = [];
  items = [];
  loading = true;
  async mounted() {
    let response = await this.reportsApi.getReportsKcinventory();
    if (response && response.length) {
      this.loading =false;
      Object.keys(response[0]).map((v) => {
        let header:DataTableHeader ={
          sortable: true,
          text: v,
          value: v,
          width:'auto',
          groupable:true,
          filterable:true,
          divider:true
          
        }
        this.headers.push(header);
      });

      this.items = response;
    }
  }
}
