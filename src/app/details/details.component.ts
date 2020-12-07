import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { MainserviceService } from '../mainservice.service';
import { DailychartService } from '../dailychart.service';

import * as Highcharts from 'highcharts/highstock';
import IndicatorsCore from 'highcharts/indicators/indicators';
import vbp from 'highcharts/indicators/volume-by-price';
IndicatorsCore(Highcharts)
vbp(Highcharts);

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css'],
})
export class DetailsComponent implements OnInit , OnDestroy {

  public ticker :any
  public compdesc :any
  public latsp :any
  public nw :any
  public tsp :any
  public interval:any
  public star_fil :boolean = false
  closeResult = ''
  show_walert = false
  show_rwalert = false
  show_palert = false
  spinner :boolean = true
  sss :string
  wrong :boolean = false

  tickers :any
  costs :any
  quantity :any
  values = '0.00'
  openco :boolean = true

  daily :Array<any>
  ohlc = []
  vol = []
  loaded2 :boolean = false
  chart_color :string
  updateFlag :boolean
  main_data = []
  temp_c :string = ''
  loaded :boolean = false
  interval2 :any
  Highcharts: typeof Highcharts
  chartOptions: Highcharts.Options 
  chartOptions_big: Highcharts.Options
  
  constructor(private route:ActivatedRoute, private http:HttpClient, private modalService: NgbModal, private _mains: MainserviceService, private _chartservice: DailychartService) {
    this.compdesc = []
    this.latsp = []
    this.nw = []
    this.tsp = new Date()

    let t = this.route.snapshot.paramMap.get('ticker')
    this.ticker = t.toUpperCase()
    
    this.daily = []
    this.ticker = this.route.snapshot.paramMap.get('ticker').toUpperCase()
    this.chart_color = ''
    this.updateFlag = false
    this.Highcharts = Highcharts

    this._mains.send_lp(this.ticker).subscribe(
      (data: Array<any>) => {
        if(data.length == 0){
          this.spinner = false
          this.wrong = true
          //console.log('Invalid Ticker')
        } else {
          this.latsp = data
          let temp = new Date()
          
          let send_sec = Number(temp.getSeconds())
          if(send_sec < 10)
              this.sss = '0'+send_sec.toString()
          else
              this.sss = send_sec.toString()

          if(data[0].last - data[0].prevClose > 0)
              this.temp_c = 'green'
            else if(data[0].last - data[0].prevClose == 0)
              this.temp_c = 'black'
            else
              this.temp_c = 'red'

          if(temp.getHours() == 6 && temp.getMinutes() > 30 && temp.getDay() != 6 && temp.getDay() != 0 ){
            this.openco = true
          } else {
            if(temp.getHours() >= 6  && temp.getHours() < 13 && temp.getDay() != 6 && temp.getDay() != 0 )
              this.openco = true
            else
              this.openco = false
          }
          
          this._chartservice.send_now(this.ticker).subscribe(
            (data) => {
              this.main_data = data['daily']

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
            this.spinner = false
            }
          )
        }//else
        
      }
    )

    this._chartservice.send_old(this.ticker).subscribe(
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

  open(content) {
    this.values = '0.00'
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    if (this.interval) {
     clearInterval(this.interval);
     //console.log('cleared')
   }
  }

  putco(x:any){
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }

  ngOnInit(): void {
    document.getElementById('src').style.border = 'none'
    document.getElementById('slink').removeAttribute('style')

    document.getElementById('watch').style.border = 'none'
    document.getElementById('wlink').removeAttribute('style')

    document.getElementById('port').style.border = 'none'
    document.getElementById('plink').removeAttribute('style')

    this._mains.send_dp(this.ticker).subscribe(
      (data) => this.compdesc = data
    )

    this._mains.send_news(this.ticker).subscribe(
      (data) => this.nw = data
    )


    if(localStorage.getItem('tickers') != null && JSON.parse(localStorage.getItem('tickers')).length != 0){
      let tpp = JSON.parse(localStorage.getItem('tickers'))
      
      if(tpp.includes(this.ticker) == true){
        this.star_fil = true
      }
      else {
        this.star_fil = false 
      }
    }

    if(localStorage.getItem('port_tickers') == null){
      localStorage.setItem('port_tickers', '[]')
      localStorage.setItem('port_quantity', '[]')
      localStorage.setItem('port_cost', '[]')
    }

    this.tickers = JSON.parse(localStorage.getItem('port_tickers'))
    this.costs = JSON.parse(localStorage.getItem('port_cost'))
    this.quantity = JSON.parse(localStorage.getItem('port_quantity'))
    
    let dt = new Date()
    //if(dt.getHours() = 13 || dt.getDay() == 6 || dt.getDay() == 7 )

    
    this.interval = setInterval(()=>{
      this.tsp = new Date()

      let tp:boolean
      if(this.tsp.getHours() == 6 && this.tsp.getMinutes() > 30 && this.tsp.getDay() != 6 && this.tsp.getDay() != 0 ){
        tp = true
      } else {
        if(this.tsp.getHours() >= 6  && this.tsp.getHours() < 13 && this.tsp.getDay() != 6 && this.tsp.getDay() != 0 )
          tp = true
        else
         tp = false
      }

      if(tp == true){
      this._chartservice.send_now(this.ticker).subscribe(
        (data) => {
          this.main_data = data['daily']
          //console.log('updated')
          this._mains.send_lp(this.ticker).subscribe(
            (data) => {
              this.latsp = data
              if(data[0].last - data[0].prevClose > 0)
                this.temp_c = 'green'
              else if(data[0].last - data[0].prevClose == 0)
                this.temp_c = 'black'
              else
                this.temp_c = 'red'
              
              let temp = new Date()
              let send_sec = Number(temp.getSeconds())
              if(send_sec < 10)
                this.sss = '0'+send_sec.toString()
              else
                this.sss = send_sec.toString()
  
              this.chartOptions.series[0]['data'] = this.main_data
              this.chartOptions.series[0]['color'] = this.temp_c
              this.updateFlag = true
              //console.log('chart_updated')
            }
          )
  
        }
      )
      }
    }, 15000)
  

  }

  walert_close(){
    this.show_walert= false
    this.show_rwalert= false
    this.show_palert= false
  }

  star_click(fill:string) {
    if(fill == 'empty'){
      this.star_fil = true

      this.show_walert = true
      this.show_rwalert = false
      setTimeout(()=>{this.show_walert = false}, 5000)

      if(localStorage.getItem('tickers') == null){
        let temp = [this.ticker]
        localStorage.setItem('tickers', JSON.stringify(temp))
      } else {
        let temp2 = JSON.parse(localStorage.getItem('tickers'))
        temp2.push(this.ticker)
        localStorage.setItem('tickers', JSON.stringify(temp2))
      }
    } else {
      this.star_fil = false
      this.show_rwalert = true
      this.show_walert = false
      setTimeout(()=>{this.show_rwalert = false}, 5000)

      let temp3 = JSON.parse(localStorage.getItem('tickers'))
      temp3 = temp3.filter(item => item !== this.ticker)
      localStorage.setItem('tickers', JSON.stringify(temp3))
      
    }
  }
  
  onKey(value, lp) {
    if(value == ''){
      this.values = '0.00'
    }
    
    this.values = this.putco((value*lp).toFixed(2));
  }

  buyit(quan, lp) {
    let index = 0

    if(this.tickers.length == 0 || !this.tickers.includes(this.ticker)){
      if(this.tickers.length == 0){
        this.tickers.push(this.ticker)
        this.costs.push((Number(quan)*Number(lp)).toFixed(2))
        this.quantity.push(Number(quan).toString())
      } else {
        let old_quan = {}
        let old_cost = {}

        this.tickers.push(this.ticker)
        this.costs.push((Number(quan)*Number(lp)).toFixed(2))
        this.quantity.push(Number(quan).toString())

        for(let i = 0; i<this.tickers.length; ++i) {
          old_cost[this.tickers[i]] = this.costs[i]
          old_quan[this.tickers[i]] = this.quantity[i]
        }
        
        this.tickers.sort()

        for(let i = 0; i<this.tickers.length; ++i) {
          this.costs[i] = old_cost[this.tickers[i]]
          this.quantity[i] = old_quan[this.tickers[i]]
        }
      }
      
    } else {
      for(let i = 0; i<this.tickers.length; ++i){
        if(this.tickers[i] == this.ticker){
          index = i;
          break;
        }
      }
  
      this.costs[index] = (Number(this.costs[index]) + Number(quan)*Number(lp)).toFixed(2)
      this.quantity[index] = (Number(this.quantity[index]) + Number(quan)).toString()
    }
    
    localStorage.setItem('port_cost',JSON.stringify(this.costs))
    localStorage.setItem('port_quantity',JSON.stringify(this.quantity))
    localStorage.setItem('port_tickers', JSON.stringify(this.tickers))
    this.modalService.dismissAll()
    this.show_palert = true
    setTimeout(()=>{this.show_palert = false}, 5000)
  }

}
