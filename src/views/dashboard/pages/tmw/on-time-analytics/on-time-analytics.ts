
import { PostTmwOrdersDawgRequest } from '@/api/apis/TmwApi';
import { ColDef } from 'ag-grid-community';
import Vue from 'vue';
import Component from 'vue-class-component';
import { VContainer } from 'vuetify/lib';
import { GoogleCharts } from 'google-charts';
import { ApexOptions } from 'apexcharts';
import { Watch } from 'vue-property-decorator';

// import { GChart } from 'vue-google-charts';

@Component({
  components: {
    VContainer,
    // GChart
  },
  name: 'on-time-analytics-',
})


export default class OnTimeAnalytics extends Vue {
  dates = [];
  menu = false
  loading: boolean = true;
  columnDefs: any;
  items: object[];
  chartsLib: any = null;
  google = window.google;
  snackText = 'Date range return no data. Please update the range';
  snackbar = false;
  get dateRangeText() {
    return this.dates.join(' ~ ')
  }

  // @Watch('dates')
  onDatesChanged(val) {

    if (val && val.length && val.length === 2) {
      this.GetOrders();
    }
  }

  mounted() {
    this.GetOrders();
  }
dtdChart:ApexCharts;
costChart:ApexCharts;
  private async GetOrders() {
    let ota = this;
    let user = JSON.parse(localStorage.getItem('user'));
    let params: PostTmwOrdersDawgRequest = {
      body: {
        tmwCodes: user.tmwCodes,
        pickupRange: this.dates
      }
    }

    let response: any = await this.tmwApi.postTmwOrdersDawg(params);
    if (response /* && response.length */) {

      this.items = response.rangeResult;
      if(!this.dates.length){
        this.dates = [response.dateRange.start,response.dateRange.end];
      }
     // this.items.length * 5
     if(this.items.length){
     this.calculate();     
      this.createCharts();
      this.loading = false;
     }else{
      this.snackbar =true;
     }
      // google.charts.load('current', { 'packages': ['timeline', 'line'] });
      // google.charts.setOnLoadCallback(ota.loadChart);
    }
  }
/*
  // loadChart(args) {
  //   let ota = this;

  //   let dtdchart = new google.visualization.Timeline(document.getElementById('dtdChart'));
  //   dtdchart.draw(ota.dtdtChartData, ota.dtdChartOptions);
  //   let chart = new (google.charts as any).Line(document.getElementById('costChart'));
  //   chart.draw(ota.costChartData, (google.charts as any).Line.convertOptions(ota.costChartOptions));
  // }

  // dt: google.visualization.DataTable;
  // onChartReady (chart, google) {
  //   this.chartsLib = google
  // }
  // get dtdtChartData() {



  //   this.dt = new google.visualization.DataTable();
  //   this.dt.addColumn('string', 'Consignee');
  //   this.dt.addColumn('date', 'Pickup');
  //   this.dt.addColumn('date', 'ARRCONS');
  //   if (window.google) {
  //     this.dt.addRows([...this.items.map((val) => { return val['ARRCONS'] && val['PICKUP'] !== '2020-03-23' ? [val['CONSIGNEE NAME'], new Date(val['PICKUP']), new Date(val['ARRCONS'])] : null }).filter((v) => v)])

  //     return this.dt;
  //   }

  //   return this.dt;

  // }

  // get costChartData() {



  //   this.dt = new google.visualization.DataTable();
  //   this.dt.addColumn('date', 'Pickup');
  //   this.dt.addColumn('number', 'Total');
  //   if (window.google) {
  //     this.dt.addRows([...this.items.map((val) => { return val['PICKUP'] !== '2020-03-23' ? [new Date(val['PICKUP']), val['TOTAL CHARGES']] : null }).filter(x => x)])

  //     return this.dt;
  //   }

  //   return this.dt;
  //   // console.log([['Pickup'], this.items.map((val) => { return val['TOTAL CHARGES'] })])
  //   // return [
  //   //   ['Pickup', 'Total'],
  //   //   ...this.items.map((val) => { return [val['PICKUP'],val['TOTAL CHARGES']] })
  //   // ]
  // }

  // get dtdChartOptions() {

  //   return {
  //     title: 'Door to Door',
  //     hAxis: { title: 'Date' },
  //     vAxis: { title: 'Amount' },
  //     curveType: 'function',
  //     legend: 'none',
  //     // trendlines: { 0: {} }
  //     timeline: {
  //       groupByRowLabel: true
  //     },

  //     height: 500,
  //     width: 1700,
  //   }

  // }
  // get costChartOptions() {

  //   return {
  //     title: 'Charges (by pickup)',
  //     hAxis: { title: 'Date', logScale: true },
  //     vAxis: { title: 'Amount', logScale: true },
  //     // curveType: 'function',
  //     legend: 'none',
  //     width: 1700,
  //     height: 500,
  //     // trendlines: { 0: {
  //     //   type: 'linear',
  //     //   color: 'green',
  //     //   lineWidth: 3,
  //     //   opacity: 0.3,
  //     //   showR2: true,
  //     //   visibleInLegend: true
  //     // } }

  //   }

  // }

  */

  costSeries = null;
  dtdSeries = null;
  private createCharts() {
    if(!this.dtdChart){
     
      this.setDTDSeries();
      this.dtdChartOptions.series = this.dtdSeries;
      this.dtdChart = new ApexCharts(document.querySelector("#dtdChart"), this.dtdChartOptions);
      this.dtdChart.render();      
     // this.dtdChart.updateSeries(this.dtdSeries, true)
    }else{
      this.setDTDSeries();
      if(this.dtdSeries){

        this.dtdChart.updateSeries(this.dtdSeries);
        this.dtdChart.updateOptions({height:this.items.length * 5})
      }
      else{
        this.dtdChart.hideSeries('Information')
      }
    }
    if(!this.costChart){
      this.setCostSeries();
      this.costChartOptions.series = this.costSeries;
      this.costChart = new ApexCharts(document.querySelector("#costChart"), this.costChartOptions);
      this.costChart.render();      
    //  this.costChart.updateSeries(this.dtdSeries, true)
    }else{
      this.setCostSeries();
      this.costChart.updateSeries(this.costSeries);
      this.costChart.updateOptions({height:this.items.length * 5})
    }
    
  }

  setDTDSeries() {
    let data = [...this.items.map((val) => {
      return val['ARRCONS'] && val['PICKUP'] !== '2020-03-23' ? {
        x: val['CONSIGNEE NAME'],
        y: [
          new Date(val['PICKUP']).getTime(),
          new Date(val['ARRCONS']).getTime()
        ]
      } : null
    }).filter(x => x)]
    if(data.length){
      debugger
      this.dtdSeries = [{
        name: 'Information', data: data
      }];

    }
    else{
      debugger
      this.dtdSeries = null
this.dtdChart.hideSeries('Information')

    }
  }
  
 

   dtdChartOptions: ApexOptions ={
     
      title: {
        text: 'Door to Door',
        align: 'left'
      },
      noData:{text:'Nothing to show'},
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
  
   costChartOptions: ApexOptions ={
    
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

  calculate(){
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
    
  }

  totalLoads = '0';
  calcTotalLoads() {
    this.totalLoads = this.items.length.toString();
  }

  highCost = '0';
  calcHighCost() {
    this.highCost = Math.max(...this.items.map((val) => { return val['TOTAL CHARGES'] })).toLocaleString(window.navigator.language, { minimumFractionDigits: 2, maximumFractionDigits: 2, style: 'currency', currency: this.items.find((val) => { return val['CURRENCY'] })['CURRENCY'] });;

  }
  lowCost = '0';
  calcLowCost() {
    this.lowCost = Math.min(...this.items.map((val) => {
      return parseInt(val['TOTAL CHARGES']) > 0 ? val['TOTAL CHARGES'] : null
    }).filter(function (val) {
      return val !== null
    })).toLocaleString(window.navigator.language, { minimumFractionDigits: 2, maximumFractionDigits: 2, style: 'currency', currency: this.items.find((val) => { return val['CURRENCY'] })['CURRENCY'] });

  }
  highMiles = '0';
  calcHighMiles() {
    this.highMiles = Math.max(...this.items.map((val) => { return val['DISTANCE'] })).toLocaleString(window.navigator.language, ({ minimumFractionDigits: 2, maximumFractionDigits: 2, style: 'unit', unit: 'mile' } as any));

  }
  lowMiles = '0';
  calcLowMiles() {
    this.lowMiles = Math.min(...this.items.map((val) => {
      return parseInt(val['DISTANCE']) > 0 ? val['DISTANCE'] : null
    }).filter(function (val) {
      return val !== null
    })).toLocaleString(window.navigator.language, ({ minimumFractionDigits: 2, maximumFractionDigits: 2, style: 'unit', unit: 'mile' } as any));

  }

  highPallets = '0';
  calcHighPallets() {
    this.highPallets = Math.max(...this.items.map((val) => { return val['PALLET'] })).toLocaleString(window.navigator.language, ({ minimumFractionDigits: 2, maximumFractionDigits: 2 } as any));

  }
  lowPallets = '0';
  calcLowPallets() {
    this.lowPallets = Math.min(...this.items.map((val) => {
      return parseInt(val['PALLET']) > 0 ? val['PALLET'] : null
    }).filter(function (val) {
      return val !== null
    })).toLocaleString(window.navigator.language, ({ minimumFractionDigits: 2, maximumFractionDigits: 2 } as any));

  }
  highWeight = '0';
  calcHighWeight() {
    this.highWeight = Math.max(...this.items.map((val) => { return val['WEIGHT'] })).toLocaleString(window.navigator.language, ({ minimumFractionDigits: 2, maximumFractionDigits: 2, style: 'unit', unit: 'pound' } as any));

  }
  lowWeight = '0';
  calcLowWeight() {
    this.lowWeight = Math.min(...this.items.map((val) => {
      return parseInt(val['WEIGHT']) > 0 ? val['WEIGHT'] : null
    }).filter(function (val) {
      return val !== null
    })).toLocaleString(window.navigator.language, ({ minimumFractionDigits: 2, maximumFractionDigits: 2, style: 'unit', unit: 'pound' } as any));

  }

  highCases = '0';
  calcHighCases() {
    this.highCases = Math.max(...this.items.map((val) => { return val['CS'] })).toLocaleString(window.navigator.language, ({ minimumFractionDigits: 2, maximumFractionDigits: 2 } as any));

  }

  lowCases = '0';
  calcLowCases() {
    this.lowCases = Math.min(...this.items.map((val) => {
      return parseInt(val['CS']) > 0 ? val['CS'] : null
    }).filter(function (val) {
      return val !== null
    })).toLocaleString(window.navigator.language, ({ minimumFractionDigits: 2, maximumFractionDigits: 2 } as any));

  }

  totalCost = '0';
  calcTotalCost() {

    this.totalCost = `${this.sum('TOTAL CHARGES').toLocaleString(window.navigator.language, { minimumFractionDigits: 2, maximumFractionDigits: 2, style: 'currency', currency: this.items.find((val) => { return val['CURRENCY'] })['CURRENCY'] })}`;
  }

  averageWeight = '0';
  calcAverageWeight() {
    this.averageWeight = (this.sum('WEIGHT') / this.items.length).toLocaleString(window.navigator.language, ({ minimumFractionDigits: 2, maximumFractionDigits: 2, style: 'unit', unit: 'pound' } as any));
  }
  averageCases = '0';
  calcAverageCases() {
    this.averageCases = (this.sum('CS') / this.items.length).toLocaleString(window.navigator.language, ({ minimumFractionDigits: 2, maximumFractionDigits: 2 } as any));
  }
  totalPallets = '0';
  calcTotalPallets() {
    this.totalPallets = this.sum('PALLET').toLocaleString(window.navigator.language, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  totalDistance = '0';
  calcTotalDistance() {
    this.totalDistance = this.sum('DISTANCE').toLocaleString(window.navigator.language, ({ minimumFractionDigits: 2, maximumFractionDigits: 2, style: 'unit', unit: 'mile' } as any));
  }

  sum(key): number {
    return this.items.reduce((a, b) => a + (b[key] || 0), 0);
  }
}


