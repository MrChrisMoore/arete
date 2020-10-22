import { PostTmwOrdersDawgRequest } from '@/api';

import Vue from 'vue';
import { VCard, VImg, VCardActions, VCardText, VContainer, VCardTitle, VSwitch, VDataTable, VChip, VList, VListItemTitle, VListGroup, VListItem, VListItemIcon, VListItemGroup } from 'vuetify/lib';
import Component from 'vue-class-component';
import { Watch } from 'vue-property-decorator';
import { DataTableHeader } from 'vuetify';
import { Resize } from 'vuetify/lib/directives'
import { AgGridVue } from 'ag-grid-vue';
import { ColDef, GridApi, GridOptions, GridReadyEvent, CsvExportParams, PaginationChangedEvent, SelectionChangedEvent } from 'ag-grid-community';
import MarkerClusterer from '@google/markerclusterer';
import {OverlappingMarkerSpiderfier} from 'ts-overlapping-marker-spiderfier';
// import {Client} from "@googlemaps/google-maps-services-js";
const MAPS_API_KEY = process.env.VUE_APP_MAPS_API_KEY;

const CALLBACK_NAME = 'gmapsCallback';

let initialized = !!window.google;
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
    VCard, VContainer, VImg, VCardActions, VCardText, VCardTitle, VSwitch, VDataTable, VChip, AgGridVue, VList, VListItemTitle, VListGroup, VListItem, VListItemIcon, VListItemGroup
  },
  name: 'tmw-order-info',
  directives: { Resize }
})

export default class OrderinfoPage extends Vue {

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


  headers: DataTableHeader[] = [];
  items = [];
  pickupStart = `${new Date().getFullYear()}-0${new Date().getMonth()}-01`;
  pickupEnd = '';
  loading = true;
  get themeClass() {
    return this.$vuetify.theme.dark ? 'ag-theme-alpine-dark' : 'ag-theme-alpine'
  }
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
  geoCoder: google.maps.Geocoder;

  map: google.maps.Map<HTMLElement>;
  onResize() {
    this.windowSize = { x: window.innerWidth, y: window.innerHeight };
  }

  onBtExport() {
    let exportParams: CsvExportParams = {
      fileName: 'test',
      processCellCallback: function (params) {
        if (!params.value) return ''
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
  beforeMount() {
    // this.themeClass = this.$vuetify.theme.dark ? 'ag-theme-alpine-dark' : 'ag-theme-alpine'
  }
  async mounted() {
    this.gridApi = this.gridOptions.api;
    this.gridOptions.onRowClicked
    await this.GetOrders();
    this.loadMap();
  }
  // @Watch('pickupStart')
  // onPickupChanged(){
  //   this.GetOrders();

  // }
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


spiderfier:OverlappingMarkerSpiderfier;
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
                OIpage.spiderfier.addMarker(ConsignMarker,(event)=>{
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
                OIpage.spiderfier.addMarker(OriginMarker,(event)=>{
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
      OIpage.spiderfier.addListener('format', function(marker, status) {
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

  onSelectionChanged(event:SelectionChangedEvent){
    let OIpage = this;
    debugger
    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(OIpage.map);
    var selectedRows = OIpage.gridApi.getSelectedRows();
    directionsService.route(
      {
        origin: {
          query: `${selectedRows[0]["ORIGIN CITY"]}, ${selectedRows[0]["ORIGIN STATE"]}`,
        },
        destination: {
          query: `${selectedRows[0]["CONSIGNEE CITY"]}, ${selectedRows[0]["CONSIGNEE STATE"]}`,
        },
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (response, status) => {
        if (status === "OK") {
          directionsRenderer.setDirections(response);
        } else {
          window.alert("Directions request failed due to " + status);
        }
      }
    );
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


