import Vue from 'vue';
import Component from 'vue-class-component';
import { SelectionChangedEvent, PaginationChangedEvent, GridReadyEvent, GridOptions, GridApi, SideBarModule, MenuModule, ClientSideRowModelModule, ColumnsToolPanelModule, FiltersToolPanelModule, RowGroupingModule, StatusBarModule, RangeSelectionModule, ColDef, ExcelExportParams, ExcelExportModule } from '@ag-grid-enterprise/all-modules'
import { AgGridVue } from '@ag-grid-community/vue';
import { GetCdnOrdersReportsShippedFacilityStatusClientidStartdateEnddateRequest, CdnApi, UserJson, GetCdnOrdersReportsShortFacilityTypeSkuClientidDaysoutRequest } from '@/api';

@Component({
  components: {
    AgGridVue
  },
  name: 'short-orders-',
})

export default class ShortOrders extends Vue {
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
  initiallyVisible: any = [];
  loading: boolean = false;
  itemsPerPage = 10;
  /*

PO#
Ship By
Delivery By
SKU
SKU Description

SKU Order Qty
SKU Order Allocated QTY
SKU Order Open Qty
Inventory Qty
Allocated Qty
Actual Qty Remaining
Demand Qty
Short Qty
UOM
Net Weight
*/
  columnDefs: ColDef[] = [{ hide: true, headerName: '', field: 'Facility_ID' },
  { hide: true, headerName: 'Facility Name', field: 'Facility_Name' },
  { hide: false, headerName: 'Order ID', field: 'OrderID' },
  { hide: true, headerName: 'Detail No', field: 'DetailSeqNbr' },
  { hide: false, headerName: 'SKU', field: 'SKU' },
  { hide: false, headerName: 'SKU Description', field: 'SKU_Description' },
  { hide: false, headerName: 'SKU Qty', field: 'SKUOriginalQty' },
  { hide: false, headerName: 'Ship Qty', field: 'SKUShipQty' },
  { hide: true, headerName: 'Back Order Qty', field: 'SKUBackorderedQty' },
  { hide: false, headerName: 'UOM', field: 'SKUUOM' },
  { hide: true, headerName: 'Lot ID', field: 'LotID' },
  { hide: true, headerName: 'Man Date', field: 'LotMfgDate' },
  { hide: true, headerName: 'Exp Date', field: 'LotExpDate' },
  { hide: true, headerName: '', field: 'Bulk_Qty' },
  { hide: false, headerName: 'Weight', field: 'Weight' },
  { hide: true, headerName: 'Sold To Acct', field: 'SoldToCustomerAcct' },
  { hide: true, headerName: 'Sold To', field: 'SoldToCustomerName' },
  { hide: true, headerName: 'Ship To Acct', field: 'ShipToCustomerAcct' },
  { hide: false, headerName: 'Consignee', field: 'ShipToCustomerName' },
  { hide: true, headerName: '', field: 'ShipAddressLine1' },
  { hide: true, headerName: '', field: 'ShipAddressLine2' },
  { hide: true, headerName: '', field: 'ShipAddressLine3' },
  { hide: true, headerName: '', field: 'ShipAddressLine4' },
  { hide: true, headerName: 'Ship City', field: 'ShipCity' },
  { hide: true, headerName: 'Ship State', field: 'ShipState' },
  { hide: true, headerName: 'Ship Zip', field: 'ShipPostalCode' },
  { hide: false, headerName: 'Order Status', field: 'OrderStatus' },
  { hide: true, headerName: 'L Max', field: 'LineMax' },
  { hide: false, headerName: 'PO Ref', field: 'SoldToCustomerPORef' },
  { hide: true, headerName: 'Order Date', field: 'OrderDate' },
  { hide: true, headerName: 'Order Ship Date', field: 'OrderShipDate' },
  { hide: true, headerName: '', field: 'DeptChargeNo' },
  { hide: false, headerName: 'Carrier ID', field: 'CarrierID' },
  { hide: true, headerName: '', field: 'Comments' },
  { hide: false, headerName: 'AQ Inv', field: 'AQ_Inv' },
  { hide: false, headerName: 'Actual Allocated Qty', field: 'AQ_Alloc' },
  { hide: false, headerName: 'Actual SKU Qty', field: 'AQ_SKU_QTY' },
  { hide: false, headerName: 'Demand SKU Qty', field: 'DQ_SKU_QTY' },
  { hide: false, headerName: 'ETF No', field: 'ETFNo' },
  { hide: true, headerName: '', field: 'OverRideShipToName' },
  { hide: false, headerName: 'Expected Ship', field: 'ExpectedShipDate' },
  { hide: true, headerName: '', field: 'OrderBy' },
  { hide: true, headerName: '', field: 'PQStatus' },
  { hide: true, headerName: '', field: 'SC' },
  { hide: true, headerName: '', field: 'OT' },
  { hide: false, headerName: 'SKU Open Qty', field: 'SKU_OPEN_QTY' },
  { hide: false, headerName: 'Allocated Qty', field: 'ALLOC_ORD_QTY' }]
  async mounted() {
    this.gridApi = this.gridOptions.api;
    this.gridOptions.onRowClicked
    await this.GetOrders();
  }
  onDatesChanged(val) {
    if (val && val.length && val.length === 2) {
      this.GetOrders();
    }
  }
  private async GetOrders() {
    let user: UserJson = JSON.parse(localStorage.getItem('user'));
    //'01','ALLOPEN', 'ALL','100210', 2
    let params: GetCdnOrdersReportsShortFacilityTypeSkuClientidDaysoutRequest = {
      facility: '01', type: 'ALLOPEN', sku: 'ALL', clientid: user.company.cADENCEID, daysout: '2'
    }

    let response = await this.$cdnApi.getCdnOrdersReportsShortFacilityTypeSkuClientidDaysout(params);

    if (response /* && response.length */) {


      // Object.keys(response[0]).map((v) => {
      //   let colDef: ColDef = {
      //     headerName: v,
      //     field: v,
      //     //hide:true
      //   }

      //   if (this.$numericFields.indexOf(v.toLowerCase()) !== -1) {
      //     colDef.type = 'numericColumn'
      //   }

      //   if (this.$currencyFields.indexOf(v.toLowerCase()) !== -1) {
      //     colDef.valueFormatter = (params) => {
      //       if(!params.value) return;
      //       let data:number = params.value || params.data[v] ;
      //       return data.toLocaleString(window.navigator.language, { minimumFractionDigits: 2, maximumFractionDigits: 2, style: 'currency', currency: 'USD' })
      //       //return data ? `$${data}` : ''
      //     }
      //     colDef.type = 'numericColumn'
      //   }

      //   if (this.$dateFields.indexOf(v.toLowerCase()) !== -1) {
      //     colDef.valueFormatter = (params) => {
      //       if(!params.value) return;
      //       let data = params.value || params.data[v] ;
      //       if (this.$dateTimeFields.indexOf(v.toLowerCase()) !== -1 && data) {
      //         let date = new Date(data);

      //         return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`
      //       }
      //       return data ? new Date(data).toLocaleDateString() : '';
      //     }
      //     colDef.filter = 'agDateColumnFilter'
      //   }

      //   // if(this.initiallyVisible.indexOf(v.toLowerCase()) > -1){
      //   //   colDef.hide =false;
      //   // }
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
    let shortOrders = this;
    let exportParams: ExcelExportParams = {
      fileName: 'test',
      processCellCallback: function (params) {
        if (!params.value) return ''
        if (shortOrders.$dateFields.indexOf(params.column.getId().toLowerCase()) !== -1) {

          let data = params.value;
          if (shortOrders.$dateTimeFields.indexOf(params.column.getId().toLowerCase()) !== -1 && data) {
            let date = new Date(data);

            return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`
          }
          return data ? new Date(data).toLocaleDateString() : '';
        }
        return params.value;
      }
    }
    shortOrders.gridOptions.api.exportDataAsExcel(exportParams);
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


