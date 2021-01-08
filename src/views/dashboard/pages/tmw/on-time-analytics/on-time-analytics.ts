
import { PostTmwOrdersDawgRequest } from '@/api/apis/TmwApi';
import Vue from 'vue';
import Component from 'vue-class-component';
import { VContainer, VSlideXTransition, VChip,VSpeedDial } from 'vuetify/lib';
import { ApexOptions } from 'apexcharts';
import { Watch } from 'vue-property-decorator';
import { OrdersByDateRange } from '@/api/models';
import { object } from 'joi';

@Component({
  components: {
    VContainer,
    VSlideXTransition,
    VChip,
    VSpeedDial
  },
  name: 'on-time-analytics-',
})
export default class OnTimeAnalytics extends Vue {
  dates = [];
  fab=false;
  compareDates = [];
  menu = false
  loading: boolean = true;
  columnDefs: any;
  items: any[];
  chartsLib: any = null;
  google = window.google;
  snackText = 'Date range return no data. Please update the range';
  snackbar = false;
  dtdChart: ApexCharts;
  costChart: ApexCharts;
  costSeries = null;
  dtdSeries = null;  
  unitTypes = {
    weight: 'pound',
    distance: 'mile',
  }
  allKpis = ['loads', ...this.$currencyFields, ...this.$numericFields]

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
    tooltip: {
      custom: this.toolTipFun
    },
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

  costChartOptions: ApexOptions = {
    theme: { mode: this.themeDark ? 'dark' : 'light' },
    chart: {

      type: 'line',
      stacked: false,
      height: 450,
      zoom: {
        type: 'xy',
        enabled: true,
        autoScaleYaxis: true
      },
      toolbar: {
        autoSelected: 'zoom'
      }
    },
    // series:this.costSeries,
    yaxis: {
      labels: {
        formatter: function (val) {
          return val.toLocaleString(window.navigator.language, { minimumFractionDigits: 2, maximumFractionDigits: 2, style: 'currency', currency: 'USD' });
        },
      },
      title: {
        text: 'Charges'
      },
    },


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
      labels: { show: false },
    }
    // xaxis: {
    //   categories: [...this.items.map((val) => { return val['PICKUP'] !== '2020-03-23' ? new Intl.DateTimeFormat(window.navigator.language).format(new Date(val['PICKUP'])): null }).filter(x => x)],
    // }
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

  toolTipFun({ series, seriesIndex, dataPointIndex, w }) {

    let fbNum = w.globals.labels[dataPointIndex].split('-')[0].trim();
    let dataRow = this.items.filter((val) => {
      return val['FB#'].trim() === fbNum;
    })


    return (
      '<div class="arrow_box">' +
      "<span>" +
      w.globals.labels[dataPointIndex] +
      ": " +
      series[seriesIndex][dataPointIndex] +
      "</span>" +
      "</div>"
    );

  }

  setDateFilter(val) {
    // let month = new Date().getMonth() +1;
    // let year = new Date().getFullYear();
    // let day = new Date().getDate();
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

  mounted() {
    this.GetOrders();
  }

  @Watch('themeDark')
  onThemeChanged(val) {
    if (this.dtdChart) this.dtdChart.updateOptions({ theme: { mode: val ? 'dark' : 'light' } }, true);
    if (this.costChart) this.costChart.updateOptions({ theme: { mode: val ? 'dark' : 'light' } }, true);
  }

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
    detention: ['fas fa-stopwatch', 'grey lighten-1']
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
    return ` ${prefix} ${this.getAggregateValueAsString(str, style, type, 2, this.unitTypes[str])}`;

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
    let oldValue = this.getAggregateValue(str, 'Total', true);
    let newValue = this.getAggregateValue(str, 'Total');
    let diff = oldValue - newValue;
    let perC = diff / oldValue;
    Math.abs(perC).toLocaleString(navigator.language, { style: 'percent' });
    if (oldValue === 0) {
      return `Increase of ${this.getAggregateValueAsString(str, style, 'Total', 2, this.unitTypes[str])}`;
    }
    return `${oldValue > newValue ? 'Decrease' : 'Increase'} of ${Math.abs(perC).toLocaleString(navigator.language, { style: 'percent' })}`//this.getAggregateValueAsString(str,style,'Total', 2,this.unitTypes[str]);

  }

  res: OrdersByDateRange = null;
  private async GetOrders() {
    let ota = this;
    let user = JSON.parse(localStorage.getItem('user'));
    let params: PostTmwOrdersDawgRequest = {
      body: {
        tmwCodes: user.tmwCodes,
        pickupRange: ota.dates
      }
    }

    ota.res = await ota.$tmwApi.postTmwOrdersDawg(params);

    if (ota.res && ota.res.rangeResult && ota.res.rangeResult.length) {

      ota.items = ota.res.rangeResult;
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
        ota.createCharts();
        ota.loading = false;

        // [...ota.numericFields,...ota.currencyFields].forEach((val)=>{
        //   ['Total','Min','Max','Average'].forEach((op:any)=>{
        //     if(ota[`${op.toLowerCase()}${val.toLowerCase().trim().replace(' ','')}_compare`] === Infinity){
        //       debugger
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
    if (!this.costChart) {
      this.setCostSeries();
      this.costChartOptions.series = this.costSeries;
      this.costChart = new ApexCharts(document.querySelector("#costChart"), this.costChartOptions);
      this.costChart.render();
      //  this.costChart.updateSeries(this.dtdSeries, true)
    } else {
      this.setCostSeries();
      this.costChart.updateSeries(this.costSeries);
      this.costChart.updateOptions({ height: this.items.length * 5 })
    }

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
        name: `${this.res.pickupRange.start} to ${this.res.pickupRange.end}`,
        data: [
          ...this.items.map((val) => {
            return val['ARRCONS'] ?
              {                
                x: val['CONSIGNEE NAME'],
                y: parseInt(val['TOTAL CHARGES'])
              }
              : null         
          }).filter(x => x)]
      },
      {
        name: `${this.res.compareRange.start} to ${this.res.compareRange.end}`,
        data: [
          ...this.res.compareResult.map((val) => {
            return val['ARRCONS'] ?
              {
                x: val['CONSIGNEE NAME'],//new Date(val['ARRCONS']).toLocaleDateString(),
                y: parseInt(val['TOTAL CHARGES'])
              }
              : null
          }).filter(x => x)]
      },
    ]

  }

  private getFieldValuesAsArray(field, comparison = false) {
    if (comparison) {
      return this.res.compareResult.map((val) => { return val[field.toUpperCase()]; });
    }
    return this.items.map((val) => { return val[field.toUpperCase()]; });
  }

  private getNonZeroFieldValuesAsArray(field, comparison = false) {
    let arr;
    if (comparison) {
      arr = this.res.compareResult.map((val) => {
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
          if (field === 'loads') return this.items.length.toString();
          return this.sum(field).toLocaleString(window.navigator.language, numberFormatOptions)

        case 'Max':
          return Math.max(...this.getFieldValuesAsArray(field)).toLocaleString(window.navigator.language, numberFormatOptions);

        case 'Min':
          return Math.min(...this.getNonZeroFieldValuesAsArray(field)).toLocaleString(window.navigator.language, numberFormatOptions);

        case 'Average':
          return (this.sum(field) / this.items.length).toLocaleString(window.navigator.language, numberFormatOptions)

        default:
          break;
      }
    } catch (error) {
      console.error(`An error occured while calculating ${aggregateType} for  ${field}`);
    }
    return 'Error'
  }

  getAggregateValue(field: string, aggregateType: 'Total' | 'Min' | 'Max' | 'Average', comparison = false) {
    // let numberFormatOptions: Intl.NumberFormatOptions | any = { minimumFractionDigits: precision, maximumFractionDigits: precision, style: style || 'decimal' }
    // if (style === 'currency') {
    //   numberFormatOptions.currency = this.getCurrencyCode();
    // }

    // if (style === 'unit' && unit) {
    //   numberFormatOptions.unit = unit;
    // }
    try {

      switch (aggregateType) {
        case 'Total':
          if (field === 'loads') {
            return comparison ? this.res.compareResult.length : this.items.length
          }
          return this.sum(field, comparison)

        case 'Max':
          return Math.max(...this.getFieldValuesAsArray(field, comparison))

        case 'Min':
          return Math.min(...this.getNonZeroFieldValuesAsArray(field, comparison))

        case 'Average':
          let len = comparison ? this.res.compareResult.length : this.items.length
          return (this.sum(field, comparison) / len)

        default:
          break;
      }
    } catch (error) {
      console.error(`An error occured while calculating ${aggregateType} for  ${field}`);
      throw error;
    }
    //return 'Error'
  }
  // getComparisonAggregateValue(field: string, aggregateType: 'Total' | 'Min' | 'Max' | 'Average') {
  //   // let numberFormatOptions: Intl.NumberFormatOptions | any = { minimumFractionDigits: precision, maximumFractionDigits: precision, style: style || 'decimal' }
  //   // if (style === 'currency') {
  //   //   numberFormatOptions.currency = this.getCurrencyCode();
  //   // }

  //   // if (style === 'unit' && unit) {
  //   //   numberFormatOptions.unit = unit;
  //   // }
  //   try {

  //     switch (aggregateType) {
  //       case 'Total':
  //         return this.sum(field, true)
  //         break;
  //       case 'Max':
  //         return Math.max(...this.getFieldValuesAsArray(field, true))

  //       case 'Min':
  //         return Math.min(...this.getNonZeroFieldValuesAsArray(field, true))

  //       case 'Average':
  //         return (this.sum(field) / this.res.compareResult.length)

  //       default:
  //         break;
  //     }
  //   } catch (error) {
  //     console.error(`An error occured while calculating ${aggregateType} for  ${field}`);
  //   }
  //   return 'Error'
  // }
  sum(key, comparison = false): number {
    if (comparison) {
      return (this.res.compareResult as any[]).reduce((a, b) => a + (b[key.toUpperCase()] || 0), 0);
    }
    return this.items.reduce((a, b) => a + (b[key.toUpperCase()] || 0), 0);
  }

  totalCost=0;
  costPer(val){
    if(this.totalCost === 0){
      this.totalCost = this.sum('total charges');
    }
    let cp = 0; 
    switch (val) {
      case 'Mile': 
      cp = this.totalCost / this.sum('Distance')       
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

    let numberFormatOptions: Intl.NumberFormatOptions | any = { minimumFractionDigits: 2, maximumFractionDigits: 2, style: 'currency', currency:this.getCurrencyCode() }
  
    return cp.toLocaleString(window.navigator.language, numberFormatOptions)

  }
  
  currencyCode: string = null;
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


