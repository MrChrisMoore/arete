import Vue from 'vue';
import Component from 'vue-class-component';
import { SelectionChangedEvent, PaginationChangedEvent, GridReadyEvent, GridOptions, GridApi, SideBarModule, MenuModule, ClientSideRowModelModule, ColumnsToolPanelModule, FiltersToolPanelModule, RowGroupingModule, StatusBarModule, RangeSelectionModule, ColDef, ExcelExportParams, ExcelExportModule } from '@ag-grid-enterprise/all-modules'
import { AgGridVue } from '@ag-grid-community/vue';
import { GetCdnOrdersReportsShippedFacilityStatusClientidStartdateEnddateRequest, CdnApi, UserJson } from '@/api';
import { Watch } from 'vue-property-decorator';
@Component({
  components: {
    AgGridVue
  },
  name: 'shipped-orders-page',
})

export default class ShippedOrdersPage extends Vue {

  sideBar = {
    toolPanels: ['columns', 'filters'],
    // hiddenByDefault:true
  };
  statusBar = {
    statusPanels: [
      {
        statusPanel: 'agAggregationComponent',
        // statusPanelParams: {
        //   aggFuncs: ['sum', 'avg'],
        // },
      },
    ],
  };
  modules = [SideBarModule, MenuModule, ClientSideRowModelModule, ColumnsToolPanelModule, ExcelExportModule, FiltersToolPanelModule, RangeSelectionModule, RowGroupingModule, StatusBarModule]
  //columnDefs: ColDef[] = [];
  rowData = null;
  dates = [];
  menu = false
  get dateRangeText() {
    return this.dates.join(' ~ ')
  }

  gridOptions: GridOptions = {};
  gridApi: GridApi = null;
  defaultColDef = {
    // sortable: true,
    // filter: true,
    // resizable: true,
    // minWidth: 100,
    // flex: 1,
    resizable: true,
    flex: 1,
    minWidth: 100,
    enableValue: true,
    enableRowGroup: true,
    enablePivot: true,
    sortable: true,
    filter: true,
    menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
  };

  columnDefs:ColDef[] = [
    { hide: false, headerName: 'Qty Ordered', field: 'Bulk_Qty', type:'numericColumn' },
    { hide: true, headerName: '', field: 'CarrierID',type:'numericColumn' },
    { hide: false, headerName: 'Carrier Name', field: 'CarrierName' },
    { hide: false, headerName: 'Case Picks', field: 'CaseCalc',type:'numericColumn' },
    { hide: true, headerName: 'Client Account', field: 'ClientAcct' },
    { hide: true, headerName: 'Client Name', field: 'ClientName' },
    { hide: true, headerName: '', field: 'Comments' },
    { hide: true, headerName: '', field: 'Delivery1' },
    { hide: true, headerName: '', field: 'DeptChargeNo',type:'numericColumn' },
    { hide: false, headerName: 'Line Nbr', field: 'DetailSeqNbr',type:'numericColumn' },
    { hide: true, headerName: '', field: 'ETFNo',type:'numericColumn' },
    { hide: false, headerName: 'Expected Ship Date', field: 'ExpectedShipDate', valueFormatter:(params) =>{return this.$options.filters.toDateString(params.value)} },
    { hide: true, headerName: '', field: 'ExternalUID',type:'numericColumn' },
    { hide: true, headerName: '', field: 'Facility_ID',type:'numericColumn' },
    { hide: true, headerName: '', field: 'Facility_Name' },
    { hide: true, headerName: '', field: 'LineMax',type:'numericColumn' },
    { hide: true, headerName: '', field: 'Notes' },
    { hide: true, headerName: '', field: 'OT' },
    { hide: true, headerName: '', field: 'OrderBy' },
    { hide: false, headerName: 'Order Date', field: 'OrderDate', valueFormatter:(params) =>{return this.$options.filters.toDateString(params.value)} },
    { hide: false, headerName: 'Order ID',rowGroup:true, field: 'OrderID',type:'numericColumn' },
    { hide: false, headerName: 'Order Ship Date', field: 'OrderShipDate', valueFormatter:(params) =>{return this.$options.filters.toDateString(params.value)} },
    { hide: true, headerName: '', field: 'OrderStatus' },
    { hide: true, headerName: '', field: 'OverRideShipToName' },
    { hide: true, headerName: '', field: 'SC' },
    { hide: false, headerName: 'SKU', field: 'SKU' },
    { hide: true, headerName: '', field: 'SKUBackorderedQty',type:'numericColumn' },
    { hide: true, headerName: '', field: 'SKUOriginalQty',type:'numericColumn' },
    { hide: false, headerName: 'Ship Qty', field: 'SKUShipQty',type:'numericColumn' },
    { hide: true, headerName: '', field: 'SKUUOM' },
    { hide: true, headerName: '', field: 'SKU_Description' },
    { hide: true, headerName: '', field: 'ShipAddressLine1' },
    { hide: true, headerName: '', field: 'ShipAddressLine2' },
    { hide: true, headerName: '', field: 'ShipAddressLine3' },
    { hide: true, headerName: '', field: 'ShipAddressLine4' },
    { hide: true, headerName: '', field: 'ShipCity' },
    { hide: true, headerName: '', field: 'ShipPostalCode' },
    { hide: true, headerName: '', field: 'ShipState' },
    { hide: true, headerName: '', field: 'ShipToCustomerAcct' },
    { hide: false, headerName: 'Ship To', field: 'ShipToCustomerName' },
    { hide: true, headerName: '', field: 'SoldToCustomerAcct' },
    { hide: true, headerName: '', field: 'SoldToCustomerName' },
    { hide: false, headerName: 'Sold To Customer PORef', field: 'SoldToCustomerPORef' },
    { hide: false, headerName: 'User Field1', field: 'UserField1' },
    { hide: false, headerName: 'User Field2', field: '' },
    { hide: false, headerName: 'Weight', field: 'Weight',type:'numericColumn' },
    { hide: false, headerName: 'Line Notes', field: 'line_notes' },
    { hide: false, headerName: 'Order Notes', field: 'order_notes' },
    { hide: false, headerName: 'Pallets Shipped', field: 'pallet_count',type:'numericColumn' },
    { hide: false, headerName: 'Tracking/PRO', field: 'trackingnumber' },]
  loading: boolean = false;
  itemsPerPage = 10;

  async mounted() {
    this.gridApi = this.gridOptions.api;
    this.setInitialDates();
    await this.GetOrders();
  }

  setInitialDates(){
    let startDate = new Date(new Date().setDate(new Date().getDate() - 7));
    let start = `${startDate.getFullYear()}-${startDate.getMonth()+1}-${startDate.getDate()}`;
    let end = `${new Date().getFullYear()}-${new Date().getMonth() +1}-${new Date().getDate()}`
    this.dates = [start, end];
  }



  setDateFilter(val) {
    
    let startDate =new Date();
    let start = '';
    let end = `${new Date().getFullYear()}-${new Date().getMonth() +1}-${new Date().getDate()}`
    switch (val) {
      case '90':
        startDate = new Date(new Date().setDate(new Date().getDate() - 90));
        start = `${startDate.getFullYear()}-${startDate.getMonth()+1}-${startDate.getDate()}`
        break;
      case '180':
        startDate = new Date(new Date().setDate(new Date().getDate() - 180))
        start = `${startDate.getFullYear()}-${startDate.getMonth()+1}-${startDate.getDate()}`
        break;
      default:
        start = `${new Date().getFullYear()}-1-1`
        break;
    }
    this.dates = [start, end];
    this.GetOrders();


  }

  onDatesChanged(val) {
    if (val && val.length && val.length === 2) {
      this.GetOrders();
    }
  }
  private async GetOrders() {
    let user: UserJson = JSON.parse(localStorage.getItem('user'));
    //'01','SHIP','100219','2020-12-01','2020-12-31', 1,null,null
    let params: GetCdnOrdersReportsShippedFacilityStatusClientidStartdateEnddateRequest = {
      facility: 1, status: 'SHIP', clientid: parseInt(user.company.cADENCEID), startdate: this.dates[0], enddate: this.dates[1]
    }

    let response = await this.$cdnApi.getCdnOrdersReportsShippedFacilityStatusClientidStartdateEnddate(params);

    if (response /* && response.length */) {

     
      // Object.keys(response[0]).map((v) => {
        

        // if (this.$numericFields.indexOf(v.toLowerCase()) !== -1) {
        //   colDef.type = 'numericColumn'
        // }

        // if (this.$currencyFields.indexOf(v.toLowerCase()) !== -1) {
        //   colDef.valueFormatter = (params) => {
        //     if (!params.value) return;
        //     let data: number = params.value || params.data[v];
        //     return data.toLocaleString(window.navigator.language, { minimumFractionDigits: 2, maximumFractionDigits: 2, style: 'currency', currency: 'USD' })
        //     //return data ? `$${data}` : ''
        //   }
        //   colDef.type = 'numericColumn'
        // }

        // if (this.$dateFields.indexOf(v.toLowerCase()) !== -1) {
        //   colDef.valueFormatter = (params) => {
        //     if (!params.value) return;
        //     let data = params.value || params.data[v];
        //     if (this.$dateTimeFields.indexOf(v.toLowerCase()) !== -1 && data) {
        //       let date = new Date(data);

        //       return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`
        //     }
        //     return data ? new Date(data).toLocaleDateString() : '';
        //   }
        //   colDef.filter = 'agDateColumnFilter'
        // }

       
      //   this.columnDefs.push(colDef);


      // });

      this.rowData = response;
      this.loading = false;
    }
  }
  get themeClass() {
    return this.$vuetify.theme.dark ? 'ag-theme-alpine-dark' : 'ag-theme-alpine'
  }
  onBtExport() {
    let shippedOrders = this;
    let exportParams: ExcelExportParams = {
      fileName: 'test',
      processCellCallback: function (params) {
        if (!params.value) return ''
        if (shippedOrders.$dateFields.indexOf(params.column.getId().toLowerCase()) !== -1) {

          let data = params.value;
          if (shippedOrders.$dateTimeFields.indexOf(params.column.getId().toLowerCase()) !== -1 && data) {
            let date = new Date(data);

            return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`
          }
          return data ? new Date(data).toLocaleDateString() : '';
        }
        return params.value;
      }
    }
    shippedOrders.gridOptions.api.exportDataAsExcel(exportParams);
  }

  onFirstDataRendered(params: GridReadyEvent) {
    this.sizeEm();
    // this.getItemsOnPage();
    // this.addMarker();
  }

  sizeEm() {

    var allColumnIds = [];

    this.gridOptions.columnApi.getAllColumns().forEach(function (column) {
      allColumnIds.push(column.getColId());
    });
    this.gridOptions.columnApi.autoSizeColumns(allColumnIds, false);
  }

  onSelectionChanged(event: SelectionChangedEvent) {
    return


  }

}


