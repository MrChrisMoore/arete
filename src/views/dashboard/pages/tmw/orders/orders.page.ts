
import Vue from 'vue';
import Component from 'vue-class-component';
import { DataTableHeader } from 'vuetify';
import {Resize} from 'vuetify/lib/directives'

@Component({
  components: {
  },
  name: 'tmw-orders',
  directives:{Resize}
})

export default class OrdersPage extends Vue {
  headers: DataTableHeader[] = [];
  items = [];
  loading = true;
  windowSize = {
    x: 0,
    y: 0,
  }

  onResize() {
    this.windowSize = { x: window.innerWidth, y: window.innerHeight };
  }
  async mounted() {
    let user = JSON.parse(localStorage.getItem('user'));
    let response = await this.reportsApi.postReportsTmwOrders({ body: { tmwCodes: user.tmwCodes } })
    if (response && response.length) {
      this.loading = false;

      Object.keys(response[0]).map((v) => {
        // console.log(`${v}:: Length :: ${v.length * 2}`);
         let width = v.length * 3;
        // console.log(`${v} : W1 = ${width}`)
        // if(response[0][v] && (response[0][v].length * 3 > width)){
        //   console.log(response[0][v].length * 3);
        //   width = response[0][v].length * 3; 
        // }
        // console.log(`${v} : W2 = ${width}`)
        let header: DataTableHeader = {
          sortable: true,
          text: v,
          value: v,
          width: width,
          groupable: true,
          filterable: true,
          divider: true

        }
        this.keys.push(v);
        this.headers.push(header);
      });

      this.items = response;
    
    }
  }
keys=[];
  itemsPerPageArray= [1, 4, 8, 12, 15];
  search= '';
  filter= {};
  sortDesc= false;
  page= 1;
  itemsPerPage= 4;
  sortBy= 'DETAIL_LINE_ID';

  
  get  numberOfPages () {
      return Math.ceil(this.items.length / this.itemsPerPage)
    }
  get  filteredKeys () {
      return this.keys.filter(key => key !== `DETAIL_LINE_ID`)
    }
 

  nextPage () {
    if (this.page + 1 <= this.numberOfPages) this.page += 1
  }
  formerPage () {
    if (this.page - 1 >= 1) this.page -= 1
  }
  updateItemsPerPage (number) {
    this.itemsPerPage = number
  }
}


