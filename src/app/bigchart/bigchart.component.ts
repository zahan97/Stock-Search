import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DailychartService } from '../dailychart.service';

import * as Highcharts from 'highcharts/highstock';
import IndicatorsCore from 'highcharts/indicators/indicators';
import vbp from 'highcharts/indicators/volume-by-price';

IndicatorsCore(Highcharts)
vbp(Highcharts);

 
@Component({
  selector: 'app-bigchart',
  templateUrl: './bigchart.component.html',
  styleUrls: ['./bigchart.component.css']
})
export class BigchartComponent implements OnInit {
  updateFlag :boolean
  Highcharts: typeof Highcharts
  ticker :string
  loaded2 :boolean = false
  ohlc = []
  vol = []
  
  chartOptions_big :Highcharts.Options
  
  constructor(private route:ActivatedRoute, private http:HttpClient, private _dailych:DailychartService) {
    this.Highcharts = Highcharts
    this.updateFlag = false
    this.ticker = this.route.snapshot.paramMap.get('ticker').toUpperCase()
    
    _dailych.send_old(this.ticker).subscribe(
      (data) => {
        this.ohlc = data['ohlc']
        this.vol = data['volume']

        this.chartOptions_big = {
          rangeSelector:{
            selected: 2
          },
          title:{
            text: this.route.snapshot.paramMap.get('ticker')
          },
          subtitle:{
            text: 'With SMA and Volume by Price technical indicators'
          },
                   
          yAxis:[{
            startOnTick: false,
            endOnTick: false,
            labels: {align: 'right', x: -3},
            title: {text: 'OHLC'},
            height: '60%',
            lineWidth: 2,
            resize: {enabled: true}
          }, {
            labels: {align: 'right', x: -3},
            title: {text: 'Volume'},
            top: '65%',
            height: '35%',
            offset: 0,
            lineWidth: 2
          }],
      
          tooltip:{
            split:true
          },
      
          plotOptions:{
            series:{
              dataGrouping:{
                units:[['week', [1]], ['month', [1,2,3,4,6]]]
              }
            }
          },
      
          series: [{
            type: 'candlestick',
            name: this.route.snapshot.paramMap.get('ticker'),
            id: 'aapl',
            zIndex: 2,
            data: this.ohlc//[[1540746000000, 108.11, 108.7, 101.63, 103.85], [1540832400000, 103.66, 104.38, 100.11, 103.73], [1540918800000, 105.44, 108.14, 105.39, 106.81]]
          }, {
            type:'column',
            name: 'Volume',
            id:'volume',
            data: this.vol, //[[1540746000000, 55162001], [1540832400000, 65350878], [1540918800000, 51062383]],
            yAxis: 1
          }, {
            type:'vbp',
            linkedTo:'aapl',
            params:{volumeSeriesID:'volume'},
            dataLabels:{enabled:false},
            zoneLines:{enabled:false}
          }, {
            type:'sma',
            linkedTo:'aapl',
            zIndex:1,
            marker:{enabled:false}
          }]
          
        }
        this.loaded2 = true
      }
    )
    
   }

  ngOnInit(): void {
  }

}
