
import { PostTmwOrdersDawgRequest } from '@/api/apis/TmwApi';
import Vue from 'vue';
import Component from 'vue-class-component';
import { VContainer } from 'vuetify/lib';
import { ApexOptions } from 'apexcharts';
import { Watch } from 'vue-property-decorator';
import { Model5 } from '@/api/models';

@Component({
  components: {
    VContainer
  },
  name: 'on-time-analytics-',
})
export default class OnTimeAnalytics extends Vue {
  dates = [];
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
  isDark = this.$vuetify.theme.dark;
 

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
      text: 'Charges (by CONSIGNEE)',
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
      labels:{show:false},
    }
    // xaxis: {
    //   categories: [...this.items.map((val) => { return val['PICKUP'] !== '2020-03-23' ? new Intl.DateTimeFormat(window.navigator.language).format(new Date(val['PICKUP'])): null }).filter(x => x)],
    // }
  }

  get dateRangeText() {
    return this.dates.join(' ~ ')
  }
  get compareRangeText(){
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
    this.dtdChart.updateOptions({ theme: { mode: val ? 'dark' : 'light' } }, true);
    this.costChart.updateOptions({ theme: { mode: val ? 'dark' : 'light' } }, true);
  }

  res: Model5 = null;
  private async GetOrders() {
    let ota = this;
    let user = JSON.parse(localStorage.getItem('user'));
    let params: PostTmwOrdersDawgRequest = {
      body: {
        tmwCodes: user.tmwCodes,
        pickupRange: ota.dates
      }
    }

    ota.res = await ota.tmwApi.postTmwOrdersDawg(params);

    if (ota.res && ota.res.rangeResult && ota.res.rangeResult.length) {

      ota.items = ota.res.rangeResult;
      if (!ota.dates.length) {
        ota.dates = [ota.res.pickupRange.start, ota.res.pickupRange.end];
      }
      if (!ota.compareDates.length) {
        ota.compareDates = [ota.res.compareRange.start, ota.res.compareRange.end];
      }else{
        if(ota.compareDates[0] !== ota.res.compareRange.start){
          ota.compareDates = [ota.res.compareRange.start, ota.res.compareRange.end];
        }
      }

      if (ota.items.length) {
        // ota.calculate();
        ota.createCharts();
        ota.loading = false;
      } else {
        ota.snackbar = true;
      }
    }
  }

  private createCharts() {
    if (!this.dtdChart) {

      this.setDTDSeries();
      this.dtdChartOptions.series = this.dtdSeries;
      this.dtdChart = new ApexCharts(document.querySelector("#dtdChart"), this.dtdChartOptions);
      this.dtdChart.render();
      // this.dtdChart.updateSeries(this.dtdSeries, true)
    } else {
      this.setDTDSeries();
      if (this.dtdSeries) {

        this.dtdChart.updateSeries(this.dtdSeries);
        this.dtdChart.updateOptions({ height: this.items.length * 5 })
      }
      else {
        this.dtdChart.hideSeries('Information')
      }
    }
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
        name:`${this.res.pickupRange.start} to ${this.res.pickupRange.end}`,
        data: [
          ...this.items.map((val) => {
            return val['ARRCONS']?//val["TOTAL CHARGES"]
            {
                // x: new Intl.DateTimeFormat(window.navigator.language).format(new Date(val['PICKUP'])),
                x: val['CONSIGNEE NAME'],//new Date(val['ARRCONS']).toLocaleDateString(),

                y: parseInt(val['TOTAL CHARGES'])
              }
              :null

            
            // return val['PICKUP'] !== '2020-03-23' ?

            //   {
            //     // x: new Intl.DateTimeFormat(window.navigator.language).format(new Date(val['PICKUP'])),
            //     x: new Date(val['PICKUP']).getTime(),

            //     y: val['TOTAL CHARGES']
            //   }

            //   : null
          }).filter(x => x)]
      },
      {
        name:`${this.res.compareRange.start} to ${this.res.compareRange.end}`,
        data: [
          ...this.res.compareResult.map((val) => {
            return val['ARRCONS']?//val["TOTAL CHARGES"]
            {
                // x: new Intl.DateTimeFormat(window.navigator.language).format(new Date(val['PICKUP'])),
              
                x: val['CONSIGNEE NAME'],//new Date(val['ARRCONS']).toLocaleDateString(),
                y: parseInt(val['TOTAL CHARGES'])
              }
              :null

            
            // return val['PICKUP'] !== '2020-03-23' ?

            //   {
            //     // x: new Intl.DateTimeFormat(window.navigator.language).format(new Date(val['PICKUP'])),
            //     x: new Date(val['PICKUP']).getTime(),

            //     y: val['TOTAL CHARGES']
            //   }

            //   : null
          }).filter(x => x)]
      },
    ]
    
  }

  // calculate() {
  //   this.calcAverageCases();
  //   this.calcTotalPallets();
  //   this.calcTotalLoads();
  //   this.calcAverageWeight();
  //   this.calcHighCases();
  //   this.calcHighCost();
  //   this.calcHighMiles();
  //   this.calcHighPallets();
  //   this.calcHighWeight();
  //   this.calcLowCases();
  //   this.calcLowCost();
  //   this.calcLowMiles();
  //   this.calcLowPallets();
  //   this.calcLowWeight();
  //   this.calcTotalCost();
  //   this.calcTotalDistance();
  //   this.calcLowFuel();
  //   this.calcHighFuel();
  //   this.calcTotalFuel();
  //  // this.calcLowLumper()
  //   this.calcHighLumper()
  //   this.calcTotalLumper()
  //   this.calcLowLumperAdmin()
  //   this.calcHighLumperAdmin()
  //   this.calcTotalLumperAdmin()
  //   this.calcLowLineHaul()
  //   this.calcHighLineHaul()
  //   this.calcTotalLineHaul()

  //   this.calcLowMisc()
  //   this.calcHighMisc()
  //   this.calcTotalMisc()

  //   this.calcLowNyc()
  //   this.calcHighNyc()
  //   this.calcTotalNyc()

  //   this.calcLowDetention()
  //   this.calcHighDetention()
  //   this.calcTotalDetention()
  //   this.calcLowAfterHours()
  //   this.calcHighAfterHours()
  //   this.calcTotalAfterHours()
  //   this.calcTotalCompareLoads()
  //   // this.calcLow()
  //   // this.calcHigh()
  //   // this.calcTotal()
  // }

  private getFieldValuesAsArray(field) {
    return this.items.map((val) => { return val[field]; });
  }

  private getNonZeroFieldValuesAsArray(field) {
    return this.items.map((val) => {
      return parseInt(val[field]) > 0 ? val[field] : null;
    }).filter(function (val) {
      return val !== null;
    });
  }

  getAggregateValue(field: string, style: string, aggregateType: 'Total' | 'Min' | 'Max' | 'Average', precision: number = 2, unit?: string) {
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
          return this.sum(field).toLocaleString(window.navigator.language, numberFormatOptions)
          break;
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

  get LowLumper() {
    //this.lowLumper = 
    return this.getAggregateValue('LUMPER', 'currency', 'Min')
  }

  get HighLumper() {
    return this.getAggregateValue('LUMPER', 'currency', 'Max')
  }

  get TotalLumper() {
    return this.getAggregateValue('LUMPER', 'currency', 'Total')
  }

  get LowLumperAdmin() {
    return this.getAggregateValue('LUMPER ADMIN', 'currency', 'Min')
  }

  get HighLumperAdmin() {
    return this.getAggregateValue('LUMPER ADMIN', 'currency', 'Max')
  }
 
  get TotalLumperAdmin() {
    return this.getAggregateValue('LUMPER ADMIN', 'currency', 'Total')
  }

  get LowLineHaul() {
    return this.getAggregateValue('LINEHAUL', 'currency', 'Min')
  }
 
  get HighLineHaul() {
    return this.getAggregateValue('LINEHAUL', 'currency', 'Max')
  }
 
  get TotalLineHaul() {
    return this.getAggregateValue('LINEHAUL', 'currency', 'Total')
  }

  get LowMisc() {
    return this.getAggregateValue('MISC', 'currency', 'Min')
  }

  get HighMisc() {
    return this.getAggregateValue('MISC', 'currency', 'Max')
  }

  get TotalMisc() {
    return this.getAggregateValue('MISC', 'currency', 'Total')
  }

  get LowNyc() {
    return this.getAggregateValue('NYC', 'currency', 'Min')
  }

  get HighNyc() {
    return this.getAggregateValue('NYC', 'currency', 'Max')
  }

  get TotalNyc() {
    return this.getAggregateValue('NYC', 'currency', 'Total')
  }

  get LowDetention() {
    return this.getAggregateValue('DETENTION', 'currency', 'Min')
  }

  get HighDetention() {
    return this.getAggregateValue('DETENTION', 'currency', 'Max')
  }

  get TotalDetention() {
    return this.getAggregateValue('DETENTION', 'currency', 'Total')
  }


  get LowAfterHours() {
    return this.getAggregateValue('AFTERHOURS', 'currency', 'Min')
  }

  get HighAfterHours() {
    return this.getAggregateValue('AFTERHOURS', 'currency', 'Max')
  }

  get TotalAfterHours() {
    return this.getAggregateValue('AFTERHOURS', 'currency', 'Total')
  }

  get TotalLoads() {
    return this.items.length.toString();
  }

  get TotalCompareLoads() {
    return this.res.compareResult.length.toString();
  }

  get TotalFuel() {
    return this.getAggregateValue('FUEL', 'currency', 'Total')
  }

  get HighFuel() {
    return this.getAggregateValue('FUEL', 'currency', 'Max')
  }

  get LowFuel() {
    return this.getAggregateValue('FUEL', 'currency', 'Min')
  }


  get HighCost() {
    return this.getAggregateValue('TOTAL CHARGES', 'currency', 'Max');
  }

  get LowCost() {
    return this.getAggregateValue('TOTAL CHARGES', 'currency', 'Min');
  }


  get HighMiles() {
    return this.getAggregateValue('DISTANCE', 'unit', 'Max', 0, 'mile');
  }


  get LowMiles() {
    return this.getAggregateValue('DISTANCE', 'unit', 'Min', 0, 'mile');
  }


  get HighPallets() {
    return this.getAggregateValue('PALLET', '', 'Max', 0);
  }


  get LowPallets() {
    return this.getAggregateValue('PALLET', '', 'Min', 0);
  }


  get HighWeight() {
    return this.getAggregateValue('WEIGHT', 'unit', 'Max', 2, 'pound');
  }


  get LowWeight() {
    return this.getAggregateValue('WEIGHT', 'unit', 'Min', 2, 'pound');
  }


  get HighCases() {
    return this.getAggregateValue('CS', '', 'Max', 0);
  }


  get LowCases() {
    return this.getAggregateValue('CS', '', 'Min', 0);
  }


  get TotalCost() {
    return this.getAggregateValue('TOTAL CHARGES', 'currency', 'Total');
  }


  get AverageWeight() {
    return this.getAggregateValue('WEIGHT', 'unit', 'Average', 2, 'pound');
  }


  get AverageCases() {
    return this.getAggregateValue('CS', '', 'Average');
  }


  get TotalPallets() {
    return this.getAggregateValue('PALLET', '', 'Total', 0);
  }


  get TotalDistance() {
    return this.getAggregateValue('DISTANCE', 'unit', 'Total', 2, 'mile');
  }

  sum(key): number {
    return this.items.reduce((a, b) => a + (b[key] || 0), 0);
  }
}


