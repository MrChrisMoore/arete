
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

      type: 'scatter',
      stacked: false,
      height: 350,
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
    // {
    //   height: 350,
    //   type: 'line',
    //   zoom: {
    //     enabled: false
    //   }
    // },
    dataLabels: {
      enabled: false
    },
    // stroke: {
    //   curve: 'straight'
    // },
    title: {
      text: 'Charges (by pickup)',
      align: 'left'
    },
    // grid: {
    //   row: {
    //     colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
    //     opacity: 0.5
    //   },
    // },
    xaxis: {
      type: 'datetime',

    },
    // xaxis: {
    //   categories: [...this.items.map((val) => { return val['PICKUP'] !== '2020-03-23' ? new Intl.DateTimeFormat(window.navigator.language).format(new Date(val['PICKUP'])): null }).filter(x => x)],
    // }
  }

  get dateRangeText() {
    return this.dates.join(' ~ ')
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
    this.dtdChart.updateOptions({ theme: { mode: val ? 'dark' : 'light' } },true);
    this.costChart.updateOptions({ theme: { mode: val ? 'dark' : 'light' } },true);
  }

  res:Model5 =null;
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

      if (ota.items.length) {
        ota.calculate();
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
        name: 'Information',
        data: [
          ...this.items.map((val) => {
            return val['PICKUP'] !== '2020-03-23' ?

              {
                // x: new Intl.DateTimeFormat(window.navigator.language).format(new Date(val['PICKUP'])),
                x: new Date(val['PICKUP']).getTime(),

                y: val['TOTAL CHARGES']
              }

              : null
          }).filter(x => x)]
      }]
  }

  calculate() {
    this.calcAverageCases();
    this.calcTotalPallets();
    this.calcTotalLoads();
    this.calcAverageWeight();
    this.calcHighCases();
    this.calcHighCost();
    this.calcHighMiles();
    this.calcHighPallets();
    this.calcHighWeight();
    this.calcLowCases();
    this.calcLowCost();
    this.calcLowMiles();
    this.calcLowPallets();
    this.calcLowWeight();
    this.calcTotalCost();
    this.calcTotalDistance();
    this.calcLowFuel();
    this.calcHighFuel();
    this.calcTotalFuel();
   // this.calcLowLumper()
    this.calcHighLumper()
    this.calcTotalLumper()
    this.calcLowLumperAdmin()
    this.calcHighLumperAdmin()
    this.calcTotalLumperAdmin()
    this.calcLowLineHaul()
    this.calcHighLineHaul()
    this.calcTotalLineHaul()

    this.calcLowMisc()
    this.calcHighMisc()
    this.calcTotalMisc()

    this.calcLowNyc()
    this.calcHighNyc()
    this.calcTotalNyc()

    this.calcLowDetention()
    this.calcHighDetention()
    this.calcTotalDetention()
    this.calcLowAfterHours()
    this.calcHighAfterHours()
    this.calcTotalAfterHours()
    this.calcTotalCompareLoads()
    // this.calcLow()
    // this.calcHigh()
    // this.calcTotal()
  }

  //lowLumper = '0';
 get LowLumper() {
    //this.lowLumper = 
 return  this.getAggregateValue('LUMPER', 'currency', 'Min')
  }
  highLumper = '0';
  calcHighLumper() {
    this.highLumper = this.getAggregateValue('LUMPER', 'currency', 'Max')
  }
  totalLumper = '0';
  calcTotalLumper() {
    this.totalLumper = this.getAggregateValue('LUMPER', 'currency', 'Total')
  }
  lowLumperAdmin = '0';
  calcLowLumperAdmin() {
    this.lowLumperAdmin = this.getAggregateValue('LUMPER ADMIN', 'currency', 'Min')
  }
  highLumperAdmin = '0'
  calcHighLumperAdmin() {
    this.highLumperAdmin = this.getAggregateValue('LUMPER ADMIN', 'currency', 'Max')
  }
  totalLumperAdmin = '0'
  calcTotalLumperAdmin() {
    this.totalLumperAdmin = this.getAggregateValue('LUMPER ADMIN', 'currency', 'Total')
  }
  lowLineHaul = '0'
  calcLowLineHaul() {
    this.lowLineHaul = this.getAggregateValue('LINEHAUL', 'currency', 'Min')
  }
  highLineHaul = '0'
  calcHighLineHaul() {
    this.highLineHaul = this.getAggregateValue('LINEHAUL', 'currency', 'Max')
  }
  totalLineHaul = '0'
  calcTotalLineHaul() {
    this.totalLineHaul = this.getAggregateValue('LINEHAUL', 'currency', 'Total')
  }
  lowMisc = '0';
  calcLowMisc() {
    this.lowMisc = this.getAggregateValue('MISC', 'currency', 'Min')
  }
  highMisc = '0';
  calcHighMisc() {
    this.highMisc = this.getAggregateValue('MISC', 'currency', 'Max')
  }
  totalMisc = '0';
  calcTotalMisc() {
    this.totalMisc = this.getAggregateValue('MISC', 'currency', 'Total')
  }
  lowNyc = '0';
  calcLowNyc() {
    this.lowNyc = this.getAggregateValue('NYC', 'currency', 'Min')
  }
  highNyc = '0';
  calcHighNyc() {
    this.lowNyc = this.getAggregateValue('NYC', 'currency', 'Max')
  }
  totalNyc = '0';
  calcTotalNyc() {
    this.lowNyc = this.getAggregateValue('NYC', 'currency', 'Total')
  }
  lowDetention = '0';
  calcLowDetention() {
    this.lowDetention = this.getAggregateValue('DETENTION', 'currency', 'Min')
  }
  highDetention = '0';
  calcHighDetention() {
    this.highDetention = this.getAggregateValue('DETENTION', 'currency', 'Max')
  }
  totalDetention = '0';
  calcTotalDetention() {
    this.totalDetention = this.getAggregateValue('DETENTION', 'currency', 'Total')
  }

  lowAfterHours = '0';
  calcLowAfterHours() {
    this.lowAfterHours = this.getAggregateValue('AFTERHOURS', 'currency', 'Min')
  }
  highAfterHours = '0';
  calcHighAfterHours() {
    this.highAfterHours = this.getAggregateValue('AFTERHOURS', 'currency', 'Max')
  }
  totalAfterHours = '0';
  calcTotalAfterHours() {
    this.totalAfterHours = this.getAggregateValue('AFTERHOURS', 'currency', 'Total')
  }



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

  totalLoads = '0';
  calcTotalLoads() {
    this.totalLoads = this.items.length.toString();
  }
  totalCompareLoads = '0';
  calcTotalCompareLoads() {
    this.totalCompareLoads = this.res.compareResult.length.toString();
  }

  totalFuel = '0';
  calcTotalFuel() {
    this.totalFuel = this.getAggregateValue('FUEL', 'currency', 'Total')
  }
  highFuel = '0';
  calcHighFuel() {
    this.highFuel = this.getAggregateValue('FUEL', 'currency', 'Max')
  }
  lowFuel = '0';
  calcLowFuel() {
    this.lowFuel = this.getAggregateValue('FUEL', 'currency', 'Min')
  }

  highCost = '0';
  calcHighCost() {
    this.highCost = this.getAggregateValue('TOTAL CHARGES', 'currency', 'Max');
  }
  lowCost = '0';
  calcLowCost() {
    this.lowCost = this.getAggregateValue('TOTAL CHARGES', 'currency', 'Min');
  }

  highMiles = '0';
  calcHighMiles() {
    this.highMiles = this.getAggregateValue('DISTANCE', 'unit', 'Max', 0, 'mile');
  }

  lowMiles = '0';
  calcLowMiles() {
    this.lowMiles = this.getAggregateValue('DISTANCE', 'unit', 'Min', 0, 'mile');
  }

  highPallets = '0';
  calcHighPallets() {
    this.highPallets = this.getAggregateValue('PALLET', '', 'Max', 0);
  }

  lowPallets = '0';
  calcLowPallets() {
    this.lowPallets = this.getAggregateValue('PALLET', '', 'Min', 0);
  }

  highWeight = '0';
  calcHighWeight() {
    this.highWeight = this.getAggregateValue('WEIGHT', 'unit', 'Max', 2, 'pound');
  }

  lowWeight = '0';
  calcLowWeight() {
    this.lowWeight = this.getAggregateValue('WEIGHT', 'unit', 'Min', 2, 'pound');
  }

  highCases = '0';
  calcHighCases() {
    this.highCases = this.getAggregateValue('CS', '', 'Max', 0);
  }

  lowCases = '0';
  calcLowCases() {
    this.lowCases = this.getAggregateValue('CS', '', 'Min', 0);
  }

  totalCost = '0';
  calcTotalCost() {
    this.totalCost = this.getAggregateValue('TOTAL CHARGES', 'currency', 'Total');
  }

  averageWeight = '0';
  calcAverageWeight() {
    this.averageWeight = this.getAggregateValue('WEIGHT', 'unit', 'Average', 2, 'pound');
  }

  averageCases = '0';
  calcAverageCases() {
    this.averageCases = this.getAggregateValue('CS', '', 'Average');
  }

  totalPallets = '0';
  calcTotalPallets() {
    this.totalPallets = this.getAggregateValue('PALLET', '', 'Total', 0);
  }

  totalDistance = '0';
  calcTotalDistance() {
    this.totalDistance = this.getAggregateValue('DISTANCE', 'unit', 'Total', 2, 'mile');
  }

  sum(key): number {
    return this.items.reduce((a, b) => a + (b[key] || 0), 0);
  }
}


