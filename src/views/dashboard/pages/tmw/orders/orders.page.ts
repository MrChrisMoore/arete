
import {  PostTmwOrdersRequest } from '@/api';

import Vue from 'vue';
import {VCard,VCardActions,VCardText,VCardTitle,VSwitch,VDataTable,VChip}from 'vuetify/lib';
import Component from 'vue-class-component';
import { Watch } from 'vue-property-decorator';
import { DataTableHeader } from 'vuetify';
import {Resize} from 'vuetify/lib/directives'

@Component({
  components: {
    VCard,VCardActions,VCardText,VCardTitle,VSwitch,VDataTable ,VChip },
  name: 'tmw-orders',
  directives:{Resize}
})

export default class OrdersPage extends Vue {
  headers: DataTableHeader[] = [];
  items = [];
  pickupStart=`${new Date().getFullYear()}-${new Date().getMonth()<10?`0${new Date().getMonth()}`:new Date().getMonth()}-01`;
  pickupEnd='';
  loading = true;
  windowSize = {
    x: 0,
    y: 0,
  }
  cards=false
  accDialog=false;
  accCharges =[];
  selectedOrderHeader= {};
  orderDialog = false;
  keys=[];
    itemsPerPageArray= [1, 4, 8, 12, 15];
    search= '';
    filter= {};
    sortDesc= false;
    page= 1;
    itemsPerPage= 4;
    sortBy= 'FreightBill';
  onResize() {
    this.windowSize = { x: window.innerWidth, y: window.innerHeight };
  }
  async mounted() {
    await this.GetOrders();
  }
@Watch('pickupStart')
onPickupChanged(){
  this.GetOrders();
  debugger
}
  
  private async GetOrders() {
    let user = JSON.parse(localStorage.getItem('user'));
    let params:PostTmwOrdersRequest ={
       body:{tmwCodes: user.tmwCodes }
    }
    
    
    if(this.pickupStart){
      params.body.pickup =this.pickupStart;
    }
    let response = await this.$tmwApi.postTmwOrders(params);
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
        };
        this.keys.push(v);
        this.headers.push(header);
      });

      this.items = response;

    }
  }

  get  numberOfPages () {
      return Math.ceil(this.items.length / this.itemsPerPage)
    }
  get  filteredKeys () {
      return this.keys.filter(key => key !== `FreightBill` && key !== 'ACCESSORIALS')
    }
 
filterOrders(items, search){
  
  return items;
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
  async accessorials(id:number){
    let response = await this.$tmwApi.getTmwAccessorialId({id:id});
    if(response){      
      this.accCharges = response;
      this.accDialog = true
    }

    
  }
      async getOrderHeader(id){
        let response = await this.$tmwApi.getTmwOrderHeaderId({id:id})
        if(response && response.length ){
          this.selectedOrderHeader = response[0];
          this.orderDialog = true;
        }
      }
}


