import Vue from 'vue';
import Component from 'vue-class-component';
import { VCard, VCardTitle, VCardText, VChip, VCardSubtitle, VTabs, VContainer, VSkeletonLoader, VTooltip, VList, VListItem, VListItemSubtitle, VListItemTitle } from 'vuetify/lib'
import { Prop } from 'vue-property-decorator';
import { SelectionChangedEvent,PaginationChangedEvent,GridReadyEvent,GridOptions,GridApi,SideBarModule,MenuModule, ClientSideRowModelModule, ColumnsToolPanelModule, FiltersToolPanelModule, RowGroupingModule, StatusBarModule,RangeSelectionModule, ColDef,  ExcelExportParams, ExcelExportModule } from '@ag-grid-enterprise/all-modules'
import {AgGridVue} from '@ag-grid-community/vue';
import { object } from 'joi';

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
    VCard, VCardTitle, VCardText, VChip, VCardSubtitle, VTabs, VContainer, VSkeletonLoader, VTooltip, VList, VListItem, VListItemSubtitle,AgGridVue, VListItemTitle
  },
  name: 'single-order-page',
})

export default class SingleOrderPage extends Vue {
  @Prop({ default: {}, type: Object }) TMWOrder!: any;
  // @Prop({ default: {}, type: Object }) Additional!: any;
  currentTab = null;
//  docurl = `http://192.168.9.10/cgi-bin/img-docfind.pl?qtype=Search%20On%20One%20Index&reftype=ORD&refnum=${this.TMWOrder['FB#']}`
  columnDefs: ColDef[] = [];
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
  gridOptions: GridOptions = {/* onDisplayedColumnsChanged:this.onDisplayedColumnsChanged, */ onColumnVisible:this.onColumnVisible};
  hidden=[];
  onColumnVisible(e){
   this.hidden.push(e.columns[0].colId);
   console.log(this.hidden.join("','"));
   
    
  }
  sideBar = {
    toolPanels: ['columns', 'filters'],
    // hiddenByDefault:true
};
modules =[SideBarModule,MenuModule, ClientSideRowModelModule,ColumnsToolPanelModule,ExcelExportModule, FiltersToolPanelModule,RangeSelectionModule, RowGroupingModule,StatusBarModule]
  tabs = [
    { tab: 'Shipping', content: this.TMWOrder },
    { tab: 'Stats', content: this.getOrderStats() },
    { tab: 'Warehouse', content: 'Loading' },
    { tab: 'Documents', content: 'Document Links' }
  ];
  get themeClass() {
    return this.$vuetify.theme.dark ? 'ag-theme-alpine-dark' : 'ag-theme-alpine'
  }
  loading = this.$store.state;
  async getOrderHeader(id) {
    let response = await this.$tmwApi.getTmwOrderHeaderId({ id: id })
    if (response && response.length) {
      

     
     Object.keys(response[0]).forEach(k=>{
      let colDef:ColDef = {
        headerName:k,
        field:k
      } 
      this.columnDefs.push(colDef)
     });
     this.loading = false
      //  this.orderHeader = response[0];
      this.tabs[2].content = response;
      // return response[0];
    }

  }
  onSelectionChanged(event:SelectionChangedEvent){
    // TODO: Get detail lines
  }
  getOrderStats() {
    let costPerPound = this.TMWOrder['TOTAL CHARGES'] / this.TMWOrder['WEIGHT'];
    let costPerCase = this.TMWOrder['TOTAL CHARGES'] / this.TMWOrder['CASES'];
    let costPerMile = this.TMWOrder['TOTAL CHARGES'] / this.TMWOrder['DISTANCE'];
    let costPerPallet = this.TMWOrder['TOTAL CHARGES'] / this.TMWOrder['PALLET'];
    return { costPerCase, costPerMile, costPerPound, costPerPallet }
    // return`
    //     Cost Per Pound: ${costPerPound} 
    //     Cost Per Case: ${costPerCase} 
    //     Cost Per Mile: ${costPerMile} 
    // `;
  }
  map: google.maps.Map<HTMLElement>;
  geoCoder: google.maps.Geocoder;
  mounted() {

    this.loadMap();
    this.getDocList();
  }
  shouldI(tab) {
    if (tab === 'Warehouse') {
      this.getOrderHeader(this.TMWOrder.WHS_NO)
    }
  }

  async loadMap() {
    let SOpage = this;

    await gmapsInit();
    SOpage.map = new google.maps.Map(document.getElementById('order_info_map_canvas'));
    SOpage.geoCoder = new google.maps.Geocoder();
    //OIpage.spiderfier = new OverlappingMarkerSpiderfier(OIpage.map, {});

    SOpage.geoCoder.geocode({ region: 'us', address: 'United States' }, (result, status) => {
      SOpage.map.setCenter(result[0].geometry.location);
      SOpage.map.fitBounds(result[0].geometry.viewport);
      this.addMarker();

    });

  }

  private addMarker() {
    let SOpage = this;

    let map = SOpage.map;
    if (!map) {
      SOpage.loadMap();
      return;
    }
    SOpage.geoCoder.geocode({ region: 'US', address: `${SOpage.TMWOrder['CONSIGNEE ZIP']}` }, (results, status1) => {
      if (results) {
        results.forEach((res) => {
          new google.maps.Marker({ position: res.geometry.location, map: SOpage.map, icon: 'http://maps.google.com/mapfiles/kml/pushpin/red-pushpin.png' })
        })
        // let markers = results.map(x => {
        //   if (x && x.geometry && x.geometry.location) {
        //     // let marker = new google.maps.Marker({
        //     //   position: x.geometry.location,
        //     //   map
        //     // });

        //   }
        // })
      }
    });
    SOpage.geoCoder.geocode({ region: 'US', address: `${SOpage.TMWOrder['ORIGIN CITY']},${SOpage.TMWOrder['ORIGIN STATE']}` }, (results, status1) => {
      if (results) {
        results.forEach((res) => {
          new google.maps.Marker({ position: res.geometry.location, map: SOpage.map, icon: 'http://maps.google.com/mapfiles/kml/pushpin/wht-pushpin.png' })
        })
        // let markers = results.map(x => {
        //   if (x && x.geometry && x.geometry.location) {
        //     // let marker = new google.maps.Marker({
        //     //   position: x.geometry.location,
        //     //   map
        //     // });

        //   }
        // })
      }
    })


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

  get details() {
    let sop = this;
    let keys = [];

    if (this.$props.TMWOrder) {

      keys = Object.keys(this.$props.TMWOrder).filter((v) => {
        return v && ['CONSIGNEE NAME', 'CONSIGNEE STATE', 'CONSIGNEE CITY', 'CONSIGNEE ZIP', 'ORIGIN CITY', 'ORIGIN STATE', 'CURRENCY', 'LEAD TIME', 'DETAIL_LINE_ID', 'ARRCONS', 'DEPCONS', 'ARRSHIP', 'DEPSHIP', 'FB#', 'CURRENT_STATUS'].indexOf(v) === -1
      });
    }
    let it = {}

    keys.forEach(key => {
      if (sop.$props.TMWOrder[key]) {
        it[key] = sop.$props.TMWOrder[key];
        if (this.$dateFields.indexOf(key.toLowerCase()) !== -1) {
          it[key] = this.$options.filters['toDateString'](sop.$props.TMWOrder[key]);
        }
        if (this.$currencyFields.indexOf(key.toLowerCase()) !== -1) {
          it[key] = this.$options.filters['toCurrency'](sop.$props.TMWOrder[key]);
        }
        if (this.$numericFields.indexOf(key.toLowerCase()) !== -1) {
          switch (key.toLowerCase()) {
            case 'weight':
              it[key] = this.$options.filters['toWeight'](sop.$props.TMWOrder[key]);
              break;
            case 'distance':
              it[key] = this.$options.filters['toMiles'](sop.$props.TMWOrder[key]);
              break;
            default:
              it[key] = this.$options.filters['toString'](sop.$props.TMWOrder[key]);
              break;
          }
        }
      }

    });

    return it
  }
  docInfo = null;
  hasdocs =false;
  async getDocList() {
    let response = await this.$tmwApi.getTmwDocsIdsId({ id: this.TMWOrder['FB#'] }).catch(res =>{
      
    });

    if (response && response.length) {
      this.hasdocs = true;
      this.docInfo = response;
      this.docInfo.forEach(element => {
        // let split = element.hdr_intdocid.match(/.{1,2}/g);
        // let path = split.join('/');
        element['path'] =`${process.env.VUE_APP_API_URL}/tmw/docs/${element.hdr_intdocid}`
      });
    }
  }

  async getDoc(item){
   
   let res:any =await this.$tmwApi.getTmwDocsId({id:item.hdr_intdocid}).catch(err =>{
     debugger
   });
    if(res){
debugger
      // var blob = new Blob([res], { type: 'image/tif' });
      // var link = document.createElement('a');
      // link.href = window.URL.createObjectURL(blob);
      // link.download = 'test.tif';

      // document.body.appendChild(link);

      // link.click();

      // document.body.removeChild(link);

      // var blob = new Blob([res], {type: 'image/tif'});

      // //downloading the file depends on the browser
      // //IE handles it differently than chrome/webkit
      // if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      //     window.navigator.msSaveOrOpenBlob(blob, 'test.tif');
      // } else {
      //     var objectUrl = URL.createObjectURL(blob);
      //     window.open(objectUrl);
      // }
      // let src = `data:image/tiff;base64, ${res}`
      // let el = document.getElementById('docimg');
      // el.setAttribute('src',src);
      // el.removeAttribute('style')

    }


  }

}


