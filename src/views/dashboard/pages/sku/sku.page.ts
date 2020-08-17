import Vue from 'vue';
import Component from 'vue-class-component';
import { DataTableHeader } from 'vuetify';

@Component({
  components: {
  },
  name: 'sku-page',
})

export default class SkuPage extends Vue {
  headers = [];
  items = [];
loading = true;
  async mounted() {
    let response = await this.reportsApi.getReportsKcskuactivity();
    if (response && response.length) {
      this.loading = false;
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


