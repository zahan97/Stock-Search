import { Component, OnDestroy, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts/highstock';
import { ActivatedRoute } from '@angular/router';

import IndicatorsCore from 'highcharts/indicators/indicators';
import { DailychartService } from '../dailychart.service';
import { MainserviceService } from '../mainservice.service';
IndicatorsCore(Highcharts)

@Component({
  selector: 'app-smallchart',
  templateUrl: './smallchart.component.html',
  styleUrls: ['./smallchart.component.css']
})
export class SmallchartComponent implements OnInit, OnDestroy {
  daily :Array<any>
  chart_color :string
  ticker :string
  updateFlag :boolean
  main_data = []
  temp_c :string = ''
  loaded :boolean = false
  interval :any
  Highcharts: typeof Highcharts
  
  chartOptions: Highcharts.Options 

  constructor(private route:ActivatedRoute, private _chartservice:DailychartService, private _mains:MainserviceService) {
    this.daily = []
    this.ticker = this.route.snapshot.paramMap.get('ticker').toUpperCase()
    this.chart_color = ''
    this.updateFlag = false
    this.Highcharts = Highcharts

    this._chartservice.send_now(this.ticker).subscribe(
      (data) => {
        this.main_data = data['daily']

        this._mains.send_lp(this.ticker).subscribe(
          (data) => {
            if(data[0].last - data[0].prevClose > 0)
              this.temp_c = 'green'
            else if(data[0].last - data[0].prevClose == 0)
              this.temp_c = 'black'
            else
              this.temp_c = 'red'

              this.chartOptions = { 
                rangeSelector:{
                  enabled: false
                },
                title: {
                  text: this.route.snapshot.paramMap.get('ticker')
                },
                series: [{
                  data: this.main_data,
                  type: 'line',
                  color: this.temp_c,
                  name: this.route.snapshot.paramMap.get('ticker').toUpperCase()
                }]
              }
      
              this.loaded = true
          }
        )

      }
    )

   }

  ngOnInit(): void {
    this.interval = setInterval(()=>{
      this._chartservice.send_now(this.ticker).subscribe(
        (data) => {
          this.main_data = data['daily']
  
          this._mains.send_lp(this.ticker).subscribe(
            (data) => {
              if(data[0].last - data[0].prevClose > 0)
                this.temp_c = 'green'
              else if(data[0].last - data[0].prevClose == 0)
                this.temp_c = 'black'
              else
                this.temp_c = 'red'
  
              this.chartOptions.series[0]['data'] = this.main_data
              this.chartOptions.series[0]['color'] = this.temp_c
              this.updateFlag = true
              console.log('chart_updated')
            }
          )
  
        }
      )
    }, 15000) 
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    if (this.interval) {
      clearInterval(this.interval);
      console.log('chart_cleared')
    }
  }

}
