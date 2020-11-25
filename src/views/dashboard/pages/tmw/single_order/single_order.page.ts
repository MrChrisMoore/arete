import Vue from 'vue';
import Component from 'vue-class-component';
import { VCard, VCardTitle, VCardText } from 'vuetify/lib'
import { Prop } from 'vue-property-decorator';

@Component({
  components: {
    VCard, VCardTitle, VCardText
  },
  name: 'single-order-page',
})

export default class SingleOrderPage extends Vue {
  @Prop({ default: {}, type: Object }) TMWOrder!: any;
  @Prop({ default: {}, type: Object }) Additional!: any;
  currentTab = null;
  orderTabs = [
    { tab: 'Shipping', content: this.TMWOrder },
    { tab: 'Additional Shipping', content: this.Additional },
    { tab: 'Warehouse', content: 'Tab 2 Content' }
  ]

  get details() {
    let sop = this;
    let keys = [];
    if (this.$props.TMWOrder) {

      keys = Object.keys(this.$props.TMWOrder).filter((v) => {
        return v && ['CONSIGNEE NAME', 'CONSIGNEE STATE', 'CONSIGNEE CITY', 'CONSIGNEE ZIP', 'ORIGIN CITY', 'ORIGIN STATE', 'CURRENCY', 'LEAD TIME', 'ARRCONS', 'DEPCONS', 'ARRSHIP','DEPSHIP'].indexOf(v) === -1
      });
    }
    let it = {}

    keys.forEach(k => {
      if (sop.$props.TMWOrder[k])
        it[k] = sop.$props.TMWOrder[k]


    })

    return it
  }

}


