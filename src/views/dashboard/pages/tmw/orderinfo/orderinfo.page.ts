import { PostTmwOrdersDawgRequest } from '@/api';

import Vue from 'vue';
import { VCard, VCardActions, VCardText, VCardTitle, VSwitch, VDataTable, VChip, VList, VListItemTitle, VListGroup, VListItem, VListItemIcon, VListItemGroup } from 'vuetify/lib';
import Component from 'vue-class-component';
import { Watch } from 'vue-property-decorator';
import { DataTableHeader } from 'vuetify';
import { Resize } from 'vuetify/lib/directives'
import { AgGridVue } from 'ag-grid-vue';
import { ColDef, GridApi, GridOptions, GridReadyEvent, CsvExportParams } from 'ag-grid-community';

@Component({
  components: {
    VCard, VCardActions, VCardText, VCardTitle, VSwitch, VDataTable, VChip, AgGridVue, VList, VListItemTitle, VListGroup, VListItem, VListItemIcon, VListItemGroup
  },
  name: 'tmw-order-info',
  directives: { Resize }
})

export default class OrderinfoPage extends Vue {

  /* Test Card Section   */
  bottom= false  
  rowsPerPageArray= [3, 4, 6]
  rpp=3
  //page: 1
  busy= false
 get numberOfPages () {
    return Math.ceil(this.items.length / this.ipp)
  }
  get rowsPerPage () {
    return this.rpp
  }
  get itemsPerRow () {
    switch (this.$vuetify.breakpoint.name) {
      case 'xs': return 1
      case 'sm': return 2
      case 'md': return 3
      case 'lg': return 4
      case 'xl': return 6
    }
  }
  _ipp = 0;
  get ipp () {
    this._ipp = Math.ceil(this.rowsPerPage * this.itemsPerRow);
     return this._ipp;
  }
  set ipp (val){
    this._ipp = val;
  }
  nextPage () {
    if (this.page + 1 <= this.numberOfPages) this.page += 1
}
formerPage () {
    if (this.page - 1 >= 1) this.page -= 1
}
calcRowsPerPage () {
    let container:any = document.getElementById('container');
    debugger
    let minItemHeight = 300
    if (container) {
        let containerHeight = parseInt(container.clientHeight, 0)
        console.log(containerHeight)
        this.rpp = Math.floor(Math.max(containerHeight,minItemHeight)/minItemHeight)
    }
    else {
        this.rpp = 2
    }
}

  /*End Test  */
  headers: DataTableHeader[] = [];
  items = [];
  pickupStart = `${new Date().getFullYear()}-0${new Date().getMonth()}-01`;
  pickupEnd = '';
  loading = true;
  themeClass = 'ag-theme-alpine-dark'
  windowSize = {
    x: 0,
    y: 0,
  }
  cards = false
  accDialog = false;
  accCharges = [];
  selectedOrderHeader = {};
  orderDialog = false;
  keys = [];
  itemsPerPageArray = [1, 4, 8, 12, 15];
  search = '';
  filter = {};
  sortDesc = false;
  page = 1;
  itemsPerPage = 4;
  sortBy = 'FB#';
  columnDefs: ColDef[] = [];
  rowData = null;

  gridOptions: GridOptions = {};
  gridApi: GridApi = null;
  defaultColDef = {
    sortable: true,
    filter: true,
    resizable: true,
    minWidth: 100,
    flex: 1,
  };
  onResize() {
    this.windowSize = { x: window.innerWidth, y: window.innerHeight };
  }

  onBtExport() {
    let exportParams: CsvExportParams = { 
      fileName: 'test',
      processCellCallback:function(params){
        if(!params.value) return ''
        if (['delivery appt', 'pickup', 'arrcons', 'depcons'].indexOf(params.column.getId().toLowerCase()) !== -1) {
          
            let data = params.value;
            if (['delivery appt', 'arrcons', 'depcons'].indexOf(params.column.getId().toLowerCase()) !== -1 && data) {
              let date = new Date(data);

              return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`
            }
            return data ? new Date(data).toLocaleDateString() : '';
          }
        return params.value;
      }
     }
    this.gridApi.exportDataAsCsv(exportParams);
  }
  onFirstDataRendered(params: GridReadyEvent) {
    this.sizeEm()
  }

  sizeEm() {

    var allColumnIds = [];

    this.gridOptions.columnApi.getAllColumns().forEach(function (column) {
      allColumnIds.push(column.getColId());
    });
    this.gridOptions.columnApi.autoSizeColumns(allColumnIds, false);
  }
  beforeMount() {
    this.themeClass = this.$vuetify.theme.dark ? 'ag-theme-alpine-dark' : 'ag-theme-alpine'
  }
  async mounted() {
    this.gridApi = this.gridOptions.api;

    await this.GetOrders();
  }
  // @Watch('pickupStart')
  // onPickupChanged(){
  //   this.GetOrders();

  // }
@Watch('cards')
onCardsChanged(val){
  if(!val) return;
  let orders =this;
  window.addEventListener('resize', () => {
    //debounce
    if (!this.busy) {
        this.busy = true
        setTimeout(()=>{
            this.calcRowsPerPage()
            this.busy = false
        }, 300)
    }
})
  setTimeout(function(){
    
    orders.calcRowsPerPage()
}, 100)
}
  private async GetOrders() {
    let user = JSON.parse(localStorage.getItem('user'));
    let params: PostTmwOrdersDawgRequest = {
      body: { tmwCodes: user.tmwCodes }
    }


    // if(this.pickupStart){
    //   params.body.pickup =this.pickupStart;
    // }
    let response = await this.tmwApi.postTmwOrdersDawg(params);
    if (response && response.length) {
      this.loading = false;

      Object.keys(response[0]).map((v) => {
        let colDef: ColDef = {
          headerName: v,
          field: v
        }

        if (['weight', 'cs', 'pallet'].indexOf(v.toLowerCase()) !== -1) {
          colDef.type = 'numericColumn'
        }

        if (['misc', 'total charges', 'lumper admin', 'nyc', 'lumper', 'linehaul', 'fuel'].indexOf(v.toLowerCase()) !== -1) {
          colDef.valueFormatter = (params) => {

            let data = params.data[v];
            return data ? `$${data}` : ''
          }
          colDef.type = 'numericColumn'
        }

        if (['delivery appt', 'pickup', 'arrcons', 'depcons'].indexOf(v.toLowerCase()) !== -1) {
          colDef.valueFormatter = (params) => {
            let data = params.data[v] || params.data[v];
            if (['delivery appt', 'arrcons', 'depcons'].indexOf(v.toLowerCase()) !== -1 && data) {
              let date = new Date(data);

              return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`
            }
            return data ? new Date(data).toLocaleDateString() : '';
          }
          colDef.filter = 'agDateColumnFilter'
        }
        this.columnDefs.push(colDef);

        let width = v.length * 3;

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
      this.rowData = response;
    }
  }

  // get numberOfPages() {
  //   return Math.ceil(this.items.length / this.itemsPerPage)
  // }
  get filteredKeys() {
    return this.keys.filter(key => key !== `FB#`)
  }

  filterOrders(items, search) {

    return items;
  }
  // nextPage() {
  //   if (this.page + 1 <= this.numberOfPages) this.page += 1
  // }
  // formerPage() {
  //   if (this.page - 1 >= 1) this.page -= 1
  // }
  updateItemsPerPage(number) {
    this.itemsPerPage = number
  }
  async accessorials(id: number) {
    let response = await this.tmwApi.getTmwAccessorialId({ id: id });
    if (response) {
      this.accCharges = response;
      this.accDialog = true
    }


  }
  async getOrderHeader(id) {
    let response = await this.tmwApi.getTmwOrderHeaderId({ id: id })
    if (response && response.length) {
      this.selectedOrderHeader = response[0];
      this.orderDialog = true;
    }
  }
}


