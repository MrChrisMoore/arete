import Vue from 'vue';
import Component from 'vue-class-component';
import { VCard, VCardTitle, VCardText, VChip, VCardSubtitle, VTabs, VContainer,VSkeletonLoader } from 'vuetify/lib'
import { Prop } from 'vue-property-decorator';
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
    VCard, VCardTitle, VCardText, VChip, VCardSubtitle, VTabs, VContainer,VSkeletonLoader
  },
  name: 'single-order-page',
})

export default class SingleOrderPage extends Vue {
  @Prop({ default: {}, type: Object }) TMWOrder!: any;
  // @Prop({ default: {}, type: Object }) Additional!: any;
  currentTab = null;


  tabs = [
    { tab: 'Shipping', content: this.TMWOrder },
    { tab: 'Stats', content: this.getOrderStats() },  
    { tab: 'Warehouse', content: 'Loading' } ,
    { tab: 'Documents', content: 'Document Links' }
  ];
  // orderTabs = ;

  // get detailContent() {

  //   let content ={}
  //    Object.keys(this.TMWOrder).forEach(k =>{
  //     if(this.TMWOrder[k]  && ['CONSIGNEE NAME', 'CONSIGNEE STATE', 'CONSIGNEE CITY', 'FB#','CONSIGNEE ZIP', 'ORIGIN CITY', 'ORIGIN STATE', 'CURRENCY', 'LEAD TIME', 'ARRCONS', 'DEPCONS', 'ARRSHIP', 'DEPSHIP'].indexOf(k) === -1 )content[k] = this.TMWOrder[k];
  //   });
  //   for (var key in this.Additional) {
  //     if (this.Additional.hasOwnProperty(key)) {
  //       let theKey = key.replaceAll('_', ' ').replace(/acc/ig, '').trim();        
  //       if (!this.TMWOrder.hasOwnProperty(theKey) &&
  //         !this.TMWOrder.hasOwnProperty(theKey.toUpperCase()) && this.Additional[key] && 
  //         (theKey.toLowerCase().indexOf('consignee') === -1 && theKey.toLowerCase().indexOf('origin')  === -1 ) &&
  //         [ 'detail line id', 'bill to code', 'revenue group','carrier id','carrier name', 'fb#', 'site id', 'freightbill'].indexOf(theKey.toLowerCase()) === -1) {
  //         content[theKey] = this.Additional[key];
  //       }
  //     }
  //   }
  //   for (var key in content) {

  //     if (this.$dateFields.indexOf(key.toLowerCase()) !== -1) {
  //       content[key] = this.$options.filters['toDateString'](content[key]);
  //     }
  //     if (this.$currencyFields.indexOf(key.toLowerCase()) !== -1) {
  //       content[key] = this.$options.filters['toCurrency'](content[key]);
  //     }
  //     if (this.$numericFields.indexOf(key.toLowerCase()) !== -1) {
  //       switch (key.toLowerCase()) {
  //         case 'weight':
  //           content[key] = this.$options.filters['toWeight'](content[key]);
  //           break;
  //         case 'distance':
  //           content[key] = this.$options.filters['toMiles'](content[key]);
  //           break;
  //         default:
  //           content[key] = this.$options.filters['toString'](content[key]);
  //           break;
  //       }
  //     }

  //   }

  // return content

  // }
  loading =true;
  async getOrderHeader(id){
    let response = await this.$tmwApi.getTmwOrderHeaderId({id:id})
    if(response && response.length ){
      setTimeout(() => {
        
        this.loading = false
      }, 2000);
    //  this.orderHeader = response[0];
      this.tabs[2].content = response[0];
      // return response[0];
    }
   
  }
  getOrderStats() {
    let costPerPound = this.TMWOrder['TOTAL CHARGES'] / this.TMWOrder['WEIGHT'];
    let costPerCase = this.TMWOrder['TOTAL CHARGES'] / this.TMWOrder['CASES'];
    let costPerMile = this.TMWOrder['TOTAL CHARGES'] / this.TMWOrder['DISTANCE'];
    return {costPerCase, costPerMile,costPerPound}
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
  }
  shouldI(tab){
    if(tab === 'Warehouse'){
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
      // this.addMarker();

    });

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

}


