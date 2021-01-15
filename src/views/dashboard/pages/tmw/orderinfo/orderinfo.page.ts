import { PostTmwOrderIdRequest, PostTmwOrdersDawgRequest } from '@/api';

import Vue from 'vue';
import { VCard, VImg, VCardActions, VCardText, VContainer, VCardTitle, VSwitch, VDataTable, VChip, VList, VListItemTitle, VListGroup, VListItem, VListItemIcon, VListItemGroup, VSlideXTransition } from 'vuetify/lib';
import Component from 'vue-class-component';
import { Watch } from 'vue-property-decorator';
// import { DataTableHeader } from 'vuetify';
import { Resize } from 'vuetify/lib/directives';
// import 'ag-grid-enterprise';
// import { AgGridVue } from 'ag-grid-vue';
import { SelectionChangedEvent, PaginationChangedEvent,GridChartsModule, GridReadyEvent, GridOptions, GridApi, SideBarModule, MenuModule, ClientSideRowModelModule, ColumnsToolPanelModule, FiltersToolPanelModule, RowGroupingModule, StatusBarModule, RangeSelectionModule, ColDef, ExcelExportParams, ExcelExportModule } from '@ag-grid-enterprise/all-modules'
import { AgGridVue } from '@ag-grid-community/vue';
// import { ColDef,  GridOptions, GridReadyEvent, CsvExportParams, PaginationChangedEvent, SelectionChangedEvent } from 'ag-grid-community';
import MarkerClusterer from '@google/markerclusterer';
import { OverlappingMarkerSpiderfier } from 'ts-overlapping-marker-spiderfier';
import SingleOrderPage from '../single_order/index.vue'
// import {Client} from "@googlemaps/google-maps-services-js";
const MAPS_API_KEY = process.env.VUE_APP_MAPS_API_KEY;

const CALLBACK_NAME = 'gmapsCallback';

let initialized = !!window.google && !!window.google.maps;
let resolveInitPromise;
let rejectInitPromise;
// This promise handles the initialization
// status of the google maps script.
const initPromise = new Promise((resolve, reject) => {
  resolveInitPromise = resolve;
  rejectInitPromise = reject;
});

function gmapsInit() {
  // If Google Maps already is initialized
  // the `initPromise` should get resolved
  // eventually.
  if (initialized) return initPromise;

  initialized = true;
  // The callback function is called by
  // the Google Maps script if it is
  // successfully loaded.
  window[CALLBACK_NAME] = () => resolveInitPromise(window.google);

  // We inject a new script tag into
  // the `<head>` of our HTML to load
  // the Google Maps script.

  if (document.getElementById('mapsScript')) document.removeChild(document.getElementById('mapsScript'));

  const script = document.createElement('script');
  script.async = true;
  script.defer = true;
  script.setAttribute("id", "mapsScript");
  script.setAttribute('src', `https://maps.googleapis.com/maps/api/js?key=${MAPS_API_KEY}&region=US&callback=${CALLBACK_NAME}`)
  script.onerror = rejectInitPromise;
  document.querySelector('head').appendChild(script);
  return initPromise;
}


@Component({
  components: {
    SingleOrderPage, VCard, VContainer, VImg, VCardActions, VCardText, VCardTitle, VSwitch, VDataTable, VChip, AgGridVue, VList, VListItemTitle, VListGroup, VListItem, VListItemIcon, VListItemGroup, VSlideXTransition
  },
  name: 'tmw-order-info',
  //directives: { Resize }
})

export default class OrderinfoPage extends Vue {
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
  modules = [SideBarModule,GridChartsModule, MenuModule, ClientSideRowModelModule, ColumnsToolPanelModule, ExcelExportModule, FiltersToolPanelModule, RangeSelectionModule, RowGroupingModule, StatusBarModule]

  //frameworkComponents = { customStatsToolPanel: CustomStatsToolPanel };
  /* Test Card Section   */
  bottom = false
  rowsPerPageArray = [3, 4, 6]
  rpp = 3
  //page: 1
  busy = false
  get numberOfPages() {
    return Math.ceil(this.items.length / this.ipp)
  }
  get rowsPerPage() {
    return this.rpp
  }
  get itemsPerRow() {
    switch (this.$vuetify.breakpoint.name) {
      case 'xs': return 1
      case 'sm': return 2
      case 'md': return 3
      case 'lg': return 4
      case 'xl': return 6
    }
  }
  _ipp = 0;
  get ipp() {
    this._ipp = Math.ceil(this.rowsPerPage * this.itemsPerRow);
    return this._ipp;
  }
  set ipp(val) {
    this._ipp = val;
  }
  nextPage() {
    if (this.page + 1 <= this.numberOfPages) this.page += 1
  }
  formerPage() {
    if (this.page - 1 >= 1) this.page -= 1
  }
  calcRowsPerPage() {
    let container: any = document.getElementById('container');
    debugger
    let minItemHeight = 300
    if (container) {
      let containerHeight = parseInt(container.clientHeight, 0)
      console.log(containerHeight)
      this.rpp = Math.floor(Math.max(containerHeight, minItemHeight) / minItemHeight)
    }
    else {
      this.rpp = 2
    }
  }

  /*End Test  */


  // headers: DataTableHeader[] = [];
  items = [];
  pickupStart = `${new Date().getFullYear()}-0${new Date().getMonth()}-01`;
  pickupEnd = '';
  loading = true;
  get themeClass() {
    return this.$vuetify.theme.dark ? 'ag-theme-alpine-dark' : 'ag-theme-alpine'
  }
  // windowSize = {
  //   x: 0,
  //   y: 0,
  // }
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
  itemsPerPage = 10;
  sortBy = 'FB#';
  columnDefs: ColDef[] = [];
  rowData = null;
  menu = false
  gridOptions: GridOptions = {enableCharts:true};
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
  // dateFields =['delivery appt', 'pickup', 'arrcons', 'depcons', 'arrship', 'depship']
  // dateTimeFields = ['delivery appt', 'arrcons', 'depcons', 'arrship', 'depship'];
  // numericFields =['weight', 'cs', 'pallet', 'lead time', 'distance'];
  // currencyFields =['misc', 'total charges', 'lumper admin', 'nyc', 'lumper', 'linehaul', 'fuel','detention','afterhours'];
  initiallyVisible = ['fb#', 'consignee name', 'arrcons', 'depship', 'weight', 'distance'];
  geoCoder: google.maps.Geocoder;
  // getMainMenuItems(params) {
  //   return params.defaultItems
  // }
  map: google.maps.Map<HTMLElement>;
  dates = [];

  onBtExport() {
    let orderInfo = this;
    let exportParams: ExcelExportParams = {
      fileName: 'test',
      processCellCallback: function (params) {
        if (!params.value) return ''
        if (orderInfo.$dateFields.indexOf(params.column.getId().toLowerCase()) !== -1) {

          let data = params.value;
          if (orderInfo.$dateTimeFields.indexOf(params.column.getId().toLowerCase()) !== -1 && data) {
            let date = new Date(data);

            return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`
          }
          return data ? new Date(data).toLocaleDateString() : '';
        }
        return params.value;
      }
    }
    orderInfo.gridOptions.api.exportDataAsExcel(exportParams);
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

  // getContextMenuItems(){

  //   return
  // }

  async mounted() {
    this.gridApi = this.gridOptions.api;    
    await this.GetOrders();

  }
 

  get dateRangeText() {
    return this.dates.join(' ~ ')
  }
  onDatesChanged(val) {
    if (val && val.length && val.length === 2) {
      this.GetOrders();
    }
  }
  setDateFilter(val) {
    // let month = new Date().getMonth() +1;
    // let year = new Date().getFullYear();
    // let day = new Date().getDate();
    let startDate = new Date();
    let start = '';
    let end = `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`
    switch (val) {
      case '30':
        startDate = new Date(new Date().setDate(new Date().getDate() - 30));
        start = `${startDate.getFullYear()}-${startDate.getMonth()+1}-${startDate.getDate()}`
        break;
      case '60':
        startDate = new Date(new Date().setDate(new Date().getDate() - 60));
        start = `${startDate.getFullYear()}-${startDate.getMonth()+1}-${startDate.getDate()}`
        break;
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

  @Watch('cards')
  onCardsChanged(val) {
    if (!val) return;
    let orders = this;
    window.addEventListener('resize', () => {
      //debounce
      if (!this.busy) {
        this.busy = true
        setTimeout(() => {
          this.calcRowsPerPage()
          this.busy = false
        }, 300)
      }
    })
    setTimeout(function () {

      orders.calcRowsPerPage()
    }, 100)
  }
  private async GetOrders() {
    let user = JSON.parse(localStorage.getItem('user'));
    let params: PostTmwOrdersDawgRequest = {
      body: { tmwCodes: user.tmwCodes, pickupRange: this.dates, compare:false },

    }

    let response = await this.$tmwApi.postTmwOrdersDawg(params);
    if (response /* && response.length */) {

      if (!this.dates.length) {
        this.dates = [response.pickupRange.start, response.pickupRange.end];
      }
      if (this.columnDefs.length === 0) {
        Object.keys(response.rangeResult[0]).map((v) => {
          let colDef: ColDef = {
            headerName: v,
            field: v,
            hide: true
          }

          if (this.$numericFields.indexOf(v.toLowerCase()) !== -1) {
            colDef.type = 'numericColumn'
          }

          if (this.$currencyFields.indexOf(v.toLowerCase()) !== -1) {
            colDef.valueFormatter = (params) => {
              if (!params.value) return;
              let data: number = params.value || params.data[v];
              return data.toLocaleString(window.navigator.language, { minimumFractionDigits: 2, maximumFractionDigits: 2, style: 'currency', currency: 'USD' })
              //return data ? `$${data}` : ''
            }
            colDef.type = 'numericColumn'
          }

          if (this.$dateFields.indexOf(v.toLowerCase()) !== -1) {
            colDef.valueFormatter = (params) => {
              if (!params.value) return;
              let data = params.value || params.data[v];
              if (this.$dateTimeFields.indexOf(v.toLowerCase()) !== -1 && data) {
                let date = new Date(data);

                return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`
              }
              return data ? new Date(data).toLocaleDateString() : '';
            }
            colDef.filter = 'agDateColumnFilter'
          }

          if (this.initiallyVisible.indexOf(v.toLowerCase()) > -1) {
            colDef.hide = false;
          }
          this.columnDefs.push(colDef);

          // let width = v.length * 3;

          // let header: DataTableHeader = {
          //   sortable: true,
          //   text: v,
          //   value: v,
          //   width: width,
          //   groupable: true,
          //   filterable: true,
          //   divider: true
          // };
          // this.keys.push(v);
          // this.headers.push(header);

        });
      }
      this.rowData = response.rangeResult;
      this.loading = false;
    }
  }


  spiderfier: OverlappingMarkerSpiderfier;
  async loadMap() {
    let OIpage = this;

    await gmapsInit();
    OIpage.map = new google.maps.Map(document.getElementById('order_info_map_canvas'));
    OIpage.geoCoder = new google.maps.Geocoder();
    OIpage.spiderfier = new OverlappingMarkerSpiderfier(OIpage.map, {});

    OIpage.geoCoder.geocode({ region: 'us', address: 'United States' }, (result, status) => {
      OIpage.map.setCenter(result[0].geometry.location);
      OIpage.map.fitBounds(result[0].geometry.viewport);
      // this.addMarker();

    });

  }

  private addMarker() {
    let OIpage = this;
    if (OIpage.items.length) {
      let map = OIpage.map;
      if (!map) {
        OIpage.loadMap();
        return;
      }
      const { start, end } = OIpage.getItemsOnPage();

      let markers: google.maps.Marker[] = [];
      let counter = 1;
      for (var i = start; i < end; i++) {
        let val = OIpage.items[i]
        if (val['_CONSIGNEE_MARKER']) {
          console.log('Marker Already Present');

        } else {
          setTimeout(() => {

            OIpage.geoCoder.geocode({ region: 'US', address: `${val['CONSIGNEE ZIP']}` }, (results, status1) => {
              if (results && results.length && results[0].geometry && results[0].geometry.location) {

                let infowindow = new google.maps.InfoWindow({
                  content: `${val['CONSIGNEE NAME']}`,
                });
                let ConsignMarker = new google.maps.Marker({
                  position: results[0].geometry.location,
                  // map,
                  /* label:`${val['TOTAL CHARGES']}`, */
                  icon: 'http://maps.google.com/mapfiles/kml/pushpin/red-pushpin.png'
                });
                val['_CONSIGNEE_MARKER'] = ConsignMarker;
                OIpage.spiderfier.addMarker(ConsignMarker, (event) => {
                  debugger
                });
                ConsignMarker.addListener('click', () => {
                  infowindow.open(map, val['_CONSIGNEE_MARKER']);
                });
              }
            });


          }, 500 * counter);
        }
        if (val['_ORIGIN_MARKER']) {
          console.log('Marker Already Present');
        } else {
          setTimeout(() => {
            OIpage.geoCoder.geocode({ region: 'US', address: `${val['ORIGIN CITY']}, ${val['ORIGIN STATE']}` }, (results, status) => {
              if (results && results.length && results[0].geometry && results[0].geometry.location) {
                let infowindow = new google.maps.InfoWindow({
                  content: `${val['CONSIGNEE NAME']}`,
                });
                let OriginMarker = new google.maps.Marker({
                  position: results[0].geometry.location,
                  // map,
                  /* label:`${val['TOTAL CHARGES']}`, */
                  icon: 'http://maps.google.com/mapfiles/kml/pushpin/wht-pushpin.png'
                });
                val['_ORIGIN_MARKER'] = OriginMarker;
                OIpage.spiderfier.addMarker(OriginMarker, (event) => {
                  debugger
                });
                OriginMarker.addListener('click', () => {
                  infowindow.open(map, val['_ORIGIN_MARKER']);
                });

              }
            });
          }, 500 * counter);
        }
      }
      OIpage.spiderfier.addListener('format', function (marker, status) {
        var iconURL = status == OverlappingMarkerSpiderfier.markerStatus.SPIDERFIED ? 'http://maps.google.com/mapfiles/kml/pushpin/wht-pushpin.png' :
          status == OverlappingMarkerSpiderfier.markerStatus.SPIDERFIABLE ? 'http://maps.google.com/mapfiles/kml/pushpin/wht-pushpin.png' :
            status == OverlappingMarkerSpiderfier.markerStatus.UNSPIDERFIABLE ? 'http://maps.google.com/mapfiles/kml/pushpin/wht-pushpin.png' :
              null;
        marker.setIcon({
          url: iconURL,
          scaledSize: new google.maps.Size(23, 32) // makes SVG icons work in IE
        });
      });
      // OIpage.itemsOnPage.forEach((val) => {

      // OIpage.geoCoder.geocode({ region: 'US', address: `${val['CONSIGNEE ZIP']}` }, (results, status1) => {
      //   if (results) {
      //     let markers = results.map(x => {

      //       if (x && x.geometry && x.geometry.location) {

      //         let infowindow = new google.maps.InfoWindow({
      //           content: `${val['CONSIGNEE NAME']}`,
      //         });
      //         let marker = new google.maps.Marker({
      //           position: x.geometry.location,
      //           map,
      //           /* label:`${val['TOTAL CHARGES']}`, */
      //           icon: 'http://maps.google.com/mapfiles/kml/pushpin/red-pushpin.png'
      //         });

      //         marker.addListener('click', () => {
      //           infowindow.open(OIpage.map, marker);
      //         });
      //         return marker;
      //       }
      //     });
      //     markers = markers.filter(item => { return item; });
      //     if (markers && markers.length)
      //       new MarkerClusterer(OIpage.map, markers);
      //   }
      //   //  result.forEach((res)=>{
      //   //    new google.maps.Marker({position:res.geometry.location})
      //   //  })
      // });
      // OIpage.geoCoder.geocode({ region: 'US', address: `${val['ORIGIN CITY']}, ${val['ORIGIN STATE']}` }, (results, status) => {
      //   if (results) {
      //     let markers = results.map(x => {
      //       if (x && x.geometry && x.geometry.location) {

      //         let infowindow = new google.maps.InfoWindow({
      //           content: `${val['CONSIGNEE NAME']}`,
      //         });
      //         let marker = new google.maps.Marker({
      //           position: x.geometry.location,
      //           map,
      //           /* label:`${val['TOTAL CHARGES']}`, */
      //           icon: 'http://maps.google.com/mapfiles/kml/pushpin/wht-pushpin.png'
      //         });

      //         marker.addListener('click', () => {
      //           infowindow.open(map, marker);
      //         });
      //         return marker;
      //       }
      //     });
      //     markers = markers.filter(item => { return item; });
      //     if (markers && markers.length)
      //       new MarkerClusterer(map, markers);
      //   }
      // });
      // });
    }
  }
  viewSingleOrder = false;
  singleOrderInfo: any = null;
  // selectedOrderInfo:any =null;
  // additionalOrderInfo:any = null;
  onSelectionChanged(event: SelectionChangedEvent) {
    let OIpage = this;
    let selectedRows = event.api.getSelectedRows();
    OIpage.singleOrderInfo = selectedRows[0];

    let params: PostTmwOrderIdRequest = { id: selectedRows[0]['FB#'] }
    OIpage.$tmwApi.postTmwOrderId(params).then((response) => {
      //  OIpage.additionalOrderInfo =
      ['BOL', 'CURRENT_STATUS', 'STAGE', 'SUB_TYPE', 'TRIP_NUMBER', 'TYPE', 'WHS_NO', 'BILL_DATE', 'DETAIL_LINE_ID'].forEach(v => {
        return OIpage.singleOrderInfo[v] = response[0][v]
      });

      OIpage.viewSingleOrder = true;
    })

    // const directionsService = new google.maps.DirectionsService();
    // const directionsRenderer = new google.maps.DirectionsRenderer();
    // directionsRenderer.setMap(OIpage.map);
    // let selectedRows = event.api.getSelectedRows();



    // directionsService.route(
    //   {
    //     origin: {
    //       query: `${selectedRows[0]["ORIGIN CITY"]}, ${selectedRows[0]["ORIGIN STATE"]}`,
    //     },
    //     destination: {
    //       query: `${selectedRows[0]["CONSIGNEE CITY"]}, ${selectedRows[0]["CONSIGNEE STATE"]}`,
    //     },
    //     travelMode: google.maps.TravelMode.DRIVING,
    //   },
    //   (response, status) => {
    //     if (status === "OK") {
    //       directionsRenderer.setDirections(response);
    //     } else {
    //       window.alert("Directions request failed due to " + status);
    //     }
    //   }
    // );
  }
  onPaginationChanged(event: PaginationChangedEvent) {
    if (!event.newPage) return;
    let OIpage = this;
    OIpage.clearPreviousMarkers();
    OIpage.addMarker();
  }
  clearPreviousMarkers() {
    let OIpage = this;
    let pagesize = OIpage.gridApi.paginationGetPageSize();
    let numPage = OIpage.gridApi.paginationGetCurrentPage() - 1;
    if (numPage < 0) return;
    let start = numPage * pagesize;
    let end = start + pagesize;

    for (var i = start; i < end; i++) {
      if (OIpage.items && OIpage.items[i]) {
        if (OIpage.items[i]["_CONSIGNEE_MARKER"]) OIpage.items[i]["_CONSIGNEE_MARKER"].setMap(null);
        if (OIpage.items[i]["_ORIGIN_MARKER"]) OIpage.items[i]["_ORIGIN_MARKER"].setMap(null);
      }
    }
  }

  private getItemsOnPage() {
    let OIpage = this;
    let pagesize = OIpage.gridApi.paginationGetPageSize();
    let numPage = OIpage.gridApi.paginationGetCurrentPage();
    let start = numPage * pagesize;
    let end = start + pagesize;

    return { start, end };
    // OIpage.itemsOnPage = OIpage.items.slice(start, end);
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
    let response = await this.$tmwApi.getTmwAccessorialId({ id: id });
    if (response) {
      this.accCharges = response;
      this.accDialog = true
    }


  }
  async getOrderHeader(id) {
    let response = await this.$tmwApi.getTmwOrderHeaderId({ id: id })
    if (response && response.length) {
      this.selectedOrderHeader = response[0];
      this.orderDialog = true;
    }
  }
}


