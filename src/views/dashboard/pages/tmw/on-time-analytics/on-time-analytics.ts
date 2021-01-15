
import { PostTmwOrdersDawgRequest } from '@/api/apis/TmwApi';
import Vue from 'vue';
import Component from 'vue-class-component';
import { VContainer, VSlideXTransition, VChip, VBottomSheet, VAutocomplete, VNavigationDrawer, VSheet, VList, VListItem, VListItemIcon, VListItemAvatar, VListItemSubtitle } from 'vuetify/lib';
import { ApexOptions } from 'apexcharts';
import { Watch } from 'vue-property-decorator';
import { OrdersByDateRange } from '@/api/models';


@Component({
  components: {
    VContainer,
    VSlideXTransition,
    VChip,
    VAutocomplete,
    VNavigationDrawer, VList, VListItem, VListItemIcon, VListItemAvatar, VListItemSubtitle, VBottomSheet, VSheet
  },
  name: 'on-time-analytics-',
})
export default class OnTimeAnalytics extends Vue {

  drawerItems = [
    { title: 'Filter Consignee', icon: 'mdi-filter-plus', class: '' },
    { title: 'Remove Filter', icon: 'mdi-filter-remove', class: '' },
    { title: '30 Days', icon: 'mdi-filter-plus', filter: '30', class: 'd-md-none' },
    { title: '60 Days', icon: 'mdi-filter-plus', filter: '60', class: 'd-md-none' },
    { title: '90 Days', icon: 'mdi-filter-plus', filter: '90', class: 'd-md-none' },
    { title: '180 Days', icon: 'mdi-filter-plus', filter: '180', class: 'd-md-none' },
    { title: 'YTD', icon: 'mdi-filter-plus', filter: 'YTD', class: 'd-md-none' },
  ];
  fabHidden = true;
  drawer = false;
  dates = [];
  fab = false;
  compareDates = [];
  menu = false
  loading: boolean = true;
  columnDefs: any;
  items: any[];
  comparisonItems: any[];
  chartsLib: any = null;
  google = window.google;
  snackText = 'Date range return no data. Please update the range';
  snackbar = false;
  dtdChart: ApexCharts;
  costChart: ApexCharts;
  costSeries: ApexAxisChartSeries = null;
  dtdSeries = null;
  unitTypes = {
    weight: 'pound',
    distance: 'mile',
  }
  allKpis = ['loads', ...this.$currencyFields, ...this.$numericFields, 'cpm', 'cpc', 'cpp', 'cpa'];
  icons = {
    loads: ['fas fa-truck', 'warning'],
    totalcharges: ['fas fa-dollar-sign', 'success'],
    distance: ['fas fa-road', 'black'],
    pallet: ['fas fa-pallet', 'yellow'],
    weight: ['fas fa-weight', 'secondary'],
    cases: ['fas fa-suitcase', 'purple'],
    fuel: ['fas fa-gas-pump', 'grey'],
    linehaul: ['fas fa-truck', 'teal'],
    lumper: ['fas fa-people-carry', 'red'],
    lumperadmin: ['fas fa-clipboard', 'indigo'],
    misc: ['fas fa-tags', 'pink'],
    nyc: ['mdi-food-apple', 'red'],
    afterhours: ['fas fa-hourglass', 'grey darken-1'],
    detention: ['fas fa-stopwatch', 'grey lighten-1'],
    // cpm:['fas fa-road','red'],
    // cpp:['fas fa-weight','red'], 
    // cpa:['fas fa-pallet','red'],
    // cpc:['fas fa-suitcase','red']
  }
  kpiValues = {};
  kpiComparisonValues = {}
  res: OrdersByDateRange = null;
  totalCost = 0;
  totalCostCompare = 0;
  currencyCode: string = null;
  filterSheet = false;

  dtdChartOptions: ApexOptions = {
    theme: { mode: this.themeDark ? 'dark' : 'light' },
    title: {
      text: 'Door to Door',
      align: 'left'
    },
    noData: { text: 'Nothing to show' },
    // series:this.dtdSeries,
    chart: {

      // height: 300,
      type: 'rangeBar'
    },
    plotOptions: {
      bar: ({
        horizontal: true,
        barHeight: '90%',
        rangeBarOverlap: false,
        distributed: true
        //rangeBarGroupRows: true
      } as any)
    },

    fill: {
      type: 'solid',
      opacity: 0.6,
      colors: [function ({ value, seriesIndex, w }) {

        let colors = ["#008FFB", "#00E396", "#FEB019", "#FF4560", "#775DD0",
          "#3F51B5", "#546E7A", "#D4526E", "#8D5B4C", "#F86624",
          "#D7263D", "#1B998B", "#2E294E", "#F46036", "#E2C044"]
        return colors[Math.floor(Math.random() * 14)]
      }]
    },
    // tooltip: {
    //   custom: this.toolTipFun
    // },
    // stroke: {
    //   width: 1
    // },
    // fill: {
    //   type: 'solid',
    //   opacity: 0.6
    // },
    xaxis: {
      type: 'datetime'
    }
  }
  filterField = 'CONSIGNEE NAME';
  filterValue = [];
  chartField = 'TOTAL CHARGES';
  costChartOptions: ApexOptions = {
    theme: { mode: this.themeDark ? 'dark' : 'light' },
    tooltip: {
      custom: this.toolTipFun
    },

    chart: {
      id: 'costChart',

      stacked: false,
      height: 450,
      zoom: {
        type: 'xy',
        enabled: true,
        // autoScaleYaxis: true
      },
      toolbar: {
        autoSelected: 'zoom'
      }
    },
    yaxis: [
      {
        forceNiceScale: true,
        min: 0,
        max: 10000,
        seriesName: 'Selected Range',
        title: {
          text: "Selected Range"
        },
        // logarithmic:true
      },
      {
        forceNiceScale: true,
        min: 0,
        max: 10000,
        seriesName: 'Comparison Range',
        opposite: true,
        title: {
          text: "Comparison Range"
        },
        // logarithmic:true
      }
    ],
    // series:this.costSeries,
    // yaxis: {

    //   forceNiceScale:true,
    //   labels: {
    //     formatter:this.labelFormatter,

    //     //  function (val) {
    //     //   if(!val) return'';
    //     //   let t = this;
    //     //   debugger
    //     //   // console.log(val);
    //     //  // if(['misc', 'total charges', 'lumper admin', 'nyc', 'lumper', 'linehaul', 'fuel','detention','afterhours'].indexOf(this.chartField.toLowerCase()) !== -1){

    //     //     return val.toLocaleString(window.navigator.language, { minimumFractionDigits: 2, maximumFractionDigits: 2, style: 'currency', currency: 'USD' });
    //     // /////  }else{
    //     //     return val.toString()
    //     //  // }
    //     // },
    //   },
    //   title: {
    //     text: 'Charges'
    //   },
    // },


    dataLabels: {
      enabled: false
    },
    // stroke: {
    //   curve: 'straight'
    // },
    title: {
      text: 'Charges',
      align: 'left'
    },
    // grid: {
    //   row: {
    //     colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
    //     opacity: 0.5
    //   },
    // },
    xaxis: {
      type: 'category',
      //tickAmount: 10,
      labels: { show: false, rotate: 0 },
      // type: 'datetime',
      // tickAmount: 10,
      // labels: {
      //   datetimeFormatter: {
      //     year: 'yyyy',
      //     month: 'MMM \'yy',
      //     day: 'dd MMM',
      //     hour: 'HH:mm'
      //   }
      // }
    }
    // xaxis: {
    //   categories: [...this.items.map((val) => { return val['PICKUP'] !== '2020-03-23' ? new Intl.DateTimeFormat(window.navigator.language).format(new Date(val['PICKUP'])): null }).filter(x => x)],
    // }
  }

  setMax() {


    let y = this.costChartOptions.yaxis[0];
    let y1 = this.costChartOptions.yaxis[1];
    y.max = this.getAggregateValue(this.chartField, 'Max', false);//+1000;
    y1.max = this.getAggregateValue(this.chartField, 'Max', true);//+ 1000;
    ApexCharts.exec('costChart', 'updateOptions', { yaxis: [y, y1] });

  }

  labelFormatter(val) {
    if (!val) return '';
    let t = this;

    // console.log(val);
    if (this.$currencyFields.indexOf(this.chartField.toLowerCase()) !== -1) {

      return val.toLocaleString(window.navigator.language, { minimumFractionDigits: 2, maximumFractionDigits: 2, style: 'currency', currency: 'USD' });
    } else {
      return val.toString()
    }
  }

  get dateRangeText() {
    return this.dates.join(' ~ ')
  }

  get compareRangeText() {
    return this.compareDates.join(' ~ ');
  }

  get themeDark() {
    return this.$store.state.themeDark;
  }

  getFilterList(field) {
    return this.items.map(v => { return v[field] })
  }


  toolTipFun({ series, seriesIndex, dataPointIndex, w }) {

    //let fbNum = w.globals.labels[dataPointIndex].split('-')[0].trim();
    // let dataRow = this.items.filter((val) => {
    //   return val['FB#'].trim() === fbNum;
    // })

    // return (` <v-tooltip
    // top
    // >

    // <span>${ w.globals.labels[dataPointIndex]}</span>
    // </v-tooltip>`)
    return (
      '<div class="arrow_box" style="color:black;">' +
      '<span style="color:black;">' +
      // w.globals.labels[dataPointIndex] +
      // ": " +
      series[seriesIndex][dataPointIndex] +
      "</span>" +
      "</div>"
    );

  }

  filter(val) {
    this.setDateFilter(val);
    this.drawer = false;
  }

  setChartField(val) {
    this.chartField = val.toUpperCase();
    let y = this.costChartOptions.yaxis[0];
    let y1 = this.costChartOptions.yaxis[1];

    y.max = this.getAggregateValue(this.chartField, 'Max', false);
    y1.max = this.getAggregateValue(this.chartField, 'Max', true);
    y.title = { text: val.toUpperCase() }

    ApexCharts.exec('costChart', 'updateOptions', { title: { text: val.toUpperCase() }, yaxis: [y, y1] })

    this.setCostSeries();
  }
  filterItems(reset:boolean) {
    this.loading = true;
    this.filterSheet = false;
    if(!reset){

      this.items = this.res.rangeResult.filter(v => { return  this.filterValue.indexOf(v[this.filterField]) !== -1 });
      this.comparisonItems = this.res.compareResult.filter(v => { return   this.filterValue.indexOf(v[this.filterField]) !== -1 })
    }else{
      this.items = this.res.rangeResult;
      this.comparisonItems = this.res.compareResult;
      this.filterValue =[];
    }

    this.loading = false;
    if(this.items.length > 1){

       this.setCostSeries();
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
        start = `${startDate.getFullYear()}-${startDate.getMonth() + 1}-${startDate.getDate()}`
        break;
      case '60':
        startDate = new Date(new Date().setDate(new Date().getDate() - 60));
        start = `${startDate.getFullYear()}-${startDate.getMonth() + 1}-${startDate.getDate()}`
        break;
      case '90':
        startDate = new Date(new Date().setDate(new Date().getDate() - 90));
        start = `${startDate.getFullYear()}-${startDate.getMonth() + 1}-${startDate.getDate()}`
        break;
      case '180':
        startDate = new Date(new Date().setDate(new Date().getDate() - 180))
        start = `${startDate.getFullYear()}-${startDate.getMonth() + 1}-${startDate.getDate()}`
        break;
      case 'YTD':
        start = `${new Date().getFullYear()}-1-1`
        break;
      default:
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

  mounted() {
    this.GetOrders();
  }

  @Watch('themeDark')
  onThemeChanged(val) {
    if (this.dtdChart) this.dtdChart.updateOptions({ theme: { mode: val ? 'dark' : 'light' } }, true);
    if (this.costChart) this.costChart.updateOptions({ theme: { mode: val ? 'dark' : 'light' } }, true);
  }

  getIcon(str) {
    let icon = this.icons[str.replace(/\s/g, '')];
    return icon ? icon[0] : '';
  }

  getColor(str) {
    let color = this.icons[str.replace(/\s/g, '')];
    return color ? color[1] : '';
  }

  kpiValue(str, type: any = "Total") {
    let style = '';
    if (this.$currencyFields.indexOf(str) >= 0) {
      style = 'currency'
    }
    if (this.unitTypes[str]) {
      style = 'unit'
    }
    if (str === 'loads' && type !== 'Total') return '';
    let prefix = ''
    switch (type) {
      case 'Min':
        prefix = 'Low:';
        break;
      case 'Max':
        prefix = 'High:';
        break;
      case 'Average':
        prefix = 'Avg:'
    }

    let retVal = ` ${prefix} ${this.getAggregateValueAsString(str, style, type, 2, this.unitTypes[str])}`;


    return retVal;

  }

  decreaseBad(kpi) {
    return ['loads', 'weight', 'cases', 'pallet'].indexOf(kpi) > -1;
  }

  kpiComparisonValue(str) {
    let style = '';
    if (this.$currencyFields.indexOf(str) >= 0) {
      style = 'currency'
    }
    if (this.unitTypes[str]) {
      style = 'unit'
    }
    // if(str === 'loads') {}
    let oldValue = this.getAggregateValue(str, 'Total', true);

    let newValue = this.kpiValues[str]['Total']// this.getAggregateValue(str, 'Total');
    let diff = oldValue - newValue;
    let perC = diff / oldValue;
    Math.abs(perC).toLocaleString(navigator.language, { style: 'percent' });
    if (oldValue === 0) {
      return `Increase of ${this.getAggregateValueAsString(str, style, 'Total', 2, this.unitTypes[str])}`;
    }
    return `${oldValue > newValue ? 'Decrease' : 'Increase'} of ${Math.abs(perC).toLocaleString(navigator.language, { style: 'percent' })}`//this.getAggregateValueAsString(str,style,'Total', 2,this.unitTypes[str]);

  }

  private async GetOrders() {
    let ota = this;
    let user = JSON.parse(localStorage.getItem('user'));
    this.fabHidden = true;
    this.loading = true;
    let params: PostTmwOrdersDawgRequest = {
      body: {
        tmwCodes: user.tmwCodes,
        pickupRange: ota.dates
      }
    }

    ota.res = await ota.$tmwApi.postTmwOrdersDawg(params);

    if (ota.res && ota.res.rangeResult && ota.res.rangeResult.length) {

      ota.items = ota.res.rangeResult;
      ota.comparisonItems = ota.res.compareResult;
      if (!ota.dates.length) {
        ota.dates = [ota.res.pickupRange.start, ota.res.pickupRange.end];
      }
      if (!ota.compareDates.length) {
        ota.compareDates = [ota.res.compareRange.start, ota.res.compareRange.end];
      } else {
        if (ota.compareDates[0] !== ota.res.compareRange.start) {
          ota.compareDates = [ota.res.compareRange.start, ota.res.compareRange.end];
        }
      }

      if (ota.items.length) {
        ota.loading = false;
        ota.createCharts();
        setTimeout(() => {
          this.setMax();
          this.fabHidden = false;
        }, 1e3);

        // [...ota.numericFields,...ota.currencyFields].forEach((val)=>{
        //   ['Total','Min','Max','Average'].forEach((op:any)=>{
        //     if(ota[`${op.toLowerCase()}${val.toLowerCase().trim().replace(' ','')}_compare`] === Infinity){
        //       
        //     }
        //    console.log(

        //      ota[`${op.toLowerCase()}${val.toLowerCase().trim().replace(' ','')}_compare`]
        //    );
        //   })
        // })

      } else {
        ota.snackbar = true;
      }
    }
  }

  private createCharts() {
    // if (!this.dtdChart) {

    //   this.setDTDSeries();
    //   this.dtdChartOptions.series = this.dtdSeries;
    //   this.dtdChart = new ApexCharts(document.querySelector("#dtdChart"), this.dtdChartOptions);
    //   this.dtdChart.render();
    //   // this.dtdChart.updateSeries(this.dtdSeries, true)
    // } else {
    //   this.setDTDSeries();
    //   if (this.dtdSeries) {

    //     this.dtdChart.updateSeries(this.dtdSeries);
    //     this.dtdChart.updateOptions({ height: this.items.length * 5 })
    //   }
    //   else {
    //     this.dtdChart.hideSeries('Information')
    //   }
    // }

    this.setCostSeries();
    this.costChartOptions.series = this.costSeries;

    // if (!this.costChart) {

    //  // console.log(document.querySelector("#costChart"));

    // //  this.costChart = new ApexCharts(document.querySelector("#costChart"), this.costChartOptions);

    //   // this.costChart.render();
    //   //  this.costChart.updateSeries(this.dtdSeries, true)
    // } else {
    //   this.setCostSeries();
    //   this.costChart.updateSeries(this.costSeries);
    //   this.costChart.updateOptions({ height: this.items.length * 5 })
    // }

  }

  setDTDSeries() {
    let data = [...this.items.map((val) => {
      return val['DEPSHIP'] && val['ARRCONS'] /* !== '2020-03-23' */ ? {
        x: `${val['FB#']} - ${val['CONSIGNEE NAME']}`,
        y: [
          new Date(val['DEPSHIP']).getTime(),
          new Date(val['ARRCONS']).getTime()
        ]
      } : null
    }).filter(x => x)]
    if (data.length) {
      this.dtdSeries = [{
        name: 'Information', data: data
      }];

    }
    else {
      this.dtdSeries = null
      this.dtdChart.hideSeries('Information')

    }
  }

  setCostSeries() {
    
    this.costSeries = [
      {

        name: `Selected Range`,
        type: this.items.length > 10 ? 'line' : 'column',

        data: [
          ...this.items.map((val) => {

            return val[this.chartField] ?
              {
                x: val['PICKUP'],
                y: parseInt(val[this.chartField])
              }
              : null
          }).filter(x => x)]
      },
      {
        name: `Comparison Range`,
        type: this.comparisonItems.length > 10 ? 'line' : 'column',
        data: [
          ...this.comparisonItems.map((val) => {
            return val[this.chartField] ?
              {
                x: val['PICKUP'],//new Date(val['ARRCONS']).toLocaleDateString(),
                y: parseInt(val[this.chartField])
              }
              : null
          }).filter(x => x)]
      },
    ]

  }

  private getFieldValuesAsArray(field, comparison = false) {
    if (comparison) {
      return this.comparisonItems.map((val) => { return val[field.toUpperCase()]; });
    }
    return this.items.map((val) => { return val[field.toUpperCase()]; });
  }

  private getNonZeroFieldValuesAsArray(field, comparison = false) {
    let arr;
    if (comparison) {
      arr = this.comparisonItems.map((val) => {
        return parseInt(val[field.toUpperCase()]) > 0 ? val[field.toUpperCase()] : null;
      }).filter(function (val) {
        return val !== null;
      });

      return arr && arr.length ? arr : [0];
    }
    arr = this.items.map((val) => {
      return parseInt(val[field.toUpperCase()]) > 0 ? val[field.toUpperCase()] : null;
    }).filter(function (val) {
      return val !== null;
    });
    return arr && arr.length ? arr : [0];
  }

  getAggregateValueAsString(field: string, style: string, aggregateType: 'Total' | 'Min' | 'Max' | 'Average', precision: number = 2, unit?: string) {
    let numberFormatOptions: Intl.NumberFormatOptions | any = { minimumFractionDigits: precision, maximumFractionDigits: precision, style: style || 'decimal' }
    if (style === 'currency') {
      numberFormatOptions.currency = this.getCurrencyCode();
    }

    if (style === 'unit' && unit) {
      numberFormatOptions.unit = unit;
    }
    try {

      switch (aggregateType) {
        case 'Total':
          let total = field === 'loads' ? this.items.length : this.sum(field);
          // if (field === 'loads') return total.toString();
          this.storeKpiValue(field, aggregateType, total);
          //     this.kpiValues[field] = {'Total':total};          
          return field === 'loads' ? total.toString() : total.toLocaleString(window.navigator.language, numberFormatOptions)

        case 'Max':
          let max = Math.max(...this.getFieldValuesAsArray(field))
          // this.kpiValues[field] = {'Max':max};
          this.storeKpiValue(field, aggregateType, max);
          return max.toLocaleString(window.navigator.language, numberFormatOptions);

        case 'Min':
          let min = Math.min(...this.getNonZeroFieldValuesAsArray(field));
          // this.kpiValues[field] = {'Min':min}
          this.storeKpiValue(field, aggregateType, min)
          return min.toLocaleString(window.navigator.language, numberFormatOptions);

        case 'Average':
          let average = this.sum(field) / this.items.length;
          // this.kpiValues[field] = {'Average':average}
          this.storeKpiValue(field, aggregateType, average)
          return average.toLocaleString(window.navigator.language, numberFormatOptions)

        default:
          break;
      }
    } catch (error) {
      console.error(`An error occured while calculating ${aggregateType} for  ${field}`);
    }
    return 'Error'
  }

  storeKpiValue(field, aggregateType, value, comparison?) {
    if (!comparison) {

      if (!this.kpiValues[field]) {
        this.kpiValues[field] = { [aggregateType]: value }
      } else {
        this.kpiValues[field][aggregateType] = value
      }
    } else {

      if (!this.kpiComparisonValues[field]) {
        this.kpiComparisonValues[field] = { [aggregateType]: value }
      } else {
        this.kpiComparisonValues[field][aggregateType] = value
      }
    }

  }

  getAggregateValue(field: string, aggregateType: 'Total' | 'Min' | 'Max' | 'Average', comparison = false) {

    try {
      
      switch (aggregateType) {
        case 'Total':
          let total = 0;
          if (field === 'loads') {
            total = comparison ? this.comparisonItems.length : this.items.length
          } else {

            total = this.sum(field, comparison)
          }
          if (comparison) this.storeKpiValue(field, aggregateType, total, comparison);
          return total

        case 'Max':
          let max = Math.max(...this.getFieldValuesAsArray(field, comparison))
          if (comparison) this.storeKpiValue(field, aggregateType, max, comparison);
          return max;

        case 'Min':
          let min = Math.min(...this.getNonZeroFieldValuesAsArray(field, comparison));
          if (comparison) this.storeKpiValue(field, aggregateType, min, comparison)
          return min

        case 'Average':
          let len = comparison ? this.comparisonItems.length : this.items.length;
          let average = (this.sum(field, comparison) / len);
          if (comparison) this.storeKpiValue(field, aggregateType, average, comparison)
          return average

        default:
          break;
      }
    } catch (error) {
      console.error(`An error occured while calculating ${aggregateType} for  ${field}`);
      throw error;
    }
    //return 'Error'
  }

  sum(key, comparison = false): number {
    if (comparison) {
      return (this.comparisonItems as any[]).reduce((a, b) => a + (b[key.toUpperCase()] || 0), 0);
    }
    return this.items.reduce((a, b) => a + (b[key.toUpperCase()] || 0), 0);
  }

  costPerCompare(val) {
    if (this.totalCostCompare === 0) {
      this.totalCostCompare = this.sum('total charges', true);
    }
    let cp = 0;
    switch (val) {
      case 'Mile':
        cp = this.totalCostCompare / this.sum('Distance', true)
        break;
      case 'Case':
        cp = this.totalCostCompare / this.sum('Cases', true)
        break;
      case 'Pound':
        cp = this.totalCostCompare / this.sum('Weight', true)
        break;
      case 'Pallet':
        cp = this.totalCostCompare / this.sum('Pallet', true)
        break;
    }
    let numberFormatOptions: Intl.NumberFormatOptions | any = { minimumFractionDigits: 2, maximumFractionDigits: 2, style: 'currency', currency: this.getCurrencyCode() }

    return `Compared To ${cp.toLocaleString(window.navigator.language, numberFormatOptions)}`
  }

  costPer(val) {
    if (this.totalCost === 0) {
      this.totalCost = this.sum('total charges');
    }
    let cp = 0;
    switch (val) {
      case 'Mile':
        cp = this.totalCost / this.sum('Distance')
        // this.kpiValues['Distance']['CostPerMile'] = cp;
        break;
      case 'Case':
        cp = this.totalCost / this.sum('Cases')
        break;
      case 'Pound':
        cp = this.totalCost / this.sum('Weight')
        break;
      case 'Pallet':
        cp = this.totalCost / this.sum('Pallet')
        break;

    }

    let numberFormatOptions: Intl.NumberFormatOptions | any = { minimumFractionDigits: 2, maximumFractionDigits: 2, style: 'currency', currency: this.getCurrencyCode() }

    return cp.toLocaleString(window.navigator.language, numberFormatOptions)

  }

  private getCurrencyCode(): string {
    if (!this.currencyCode) {
      try {
        this.currencyCode = this.items.find((val) => { return val['CURRENCY']; })['CURRENCY'];
      } catch (error) {
        console.error(`An error occured attempting to lookup the currency code from the dataset: ${error}`);
        this.currencyCode = 'USD';
      }
    }
    return this.currencyCode;
  }

}


