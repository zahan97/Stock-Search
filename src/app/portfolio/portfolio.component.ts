import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { MainserviceService } from '../mainservice.service';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css']
})
export class PortfolioComponent implements OnInit {
  tickers :any
  costs :any
  quantity :any
  compdesc = []
  latsp = []
  closeResult = '';
  values = '0.00'
  available :boolean = true
  spin_it :boolean = true

  constructor(private router : Router, private http:HttpClient, private modalService: NgbModal, private _mains: MainserviceService) { }

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

  ngOnInit(): void {

    let sid = document.getElementById('src')
    let wid = document.getElementById('watch')
    let pid = document.getElementById('port')

    sid.style.border = 'none'
    wid.style.border = 'none'
    pid.style.border = 'white solid'
    document.getElementById('plink').style.color = 'white'
    document.getElementById('wlink').removeAttribute('style')
    document.getElementById('slink').removeAttribute('style')

    if(localStorage.getItem('port_tickers') == null || localStorage.getItem('port_tickers').length == 2) {
      this.available = false
    } else {
      this.tickers = JSON.parse(localStorage.getItem('port_tickers'))
      this.costs = JSON.parse(localStorage.getItem('port_cost'))
      this.quantity = JSON.parse(localStorage.getItem('port_quantity'))

      
      for(let i = 0; i<this.tickers.length; ++i){
        this._mains.send_dp(this.tickers[i]).subscribe((data) => this.compdesc[i] = data)

        this._mains.send_lp(this.tickers[i]).subscribe((data) => this.latsp[i] = data)
      }

      setTimeout(() => { this.spin_it = false }, 1000);
    }
  }

  onKey(value, lp) {
    if(value == ''){
      this.values = '0.00'
    }
    
    this.values = this.putco((value*lp).toFixed(2));
  }

  putco(x:any){
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }
  
  buyit(ticker, quan, lp) {
    let index = 0
    for(let i = 0; i<this.tickers.length; ++i){
      if(this.tickers[i] == ticker){
        index = i;
        break;
      }
    }

    this.costs[index] = (Number(this.costs[index]) + Number(quan)*Number(lp)).toFixed(2)
    this.quantity[index] = (Number(this.quantity[index]) + Number(quan)).toString()

    localStorage.removeItem('port_cost')
    localStorage.removeItem('port_quantity')
    localStorage.setItem('port_cost',JSON.stringify(this.costs))
    localStorage.setItem('port_quantity',JSON.stringify(this.quantity))

    for(let i = 0; i<this.tickers.length; ++i){
      this._mains.send_dp(this.tickers[i]).subscribe((data) => this.compdesc[i] = data)

      this._mains.send_lp(this.tickers[i]).subscribe((data) => this.latsp[i] = data)
    }

    this.modalService.dismissAll()
  }

  sellit(ticker, quan, lp) {
    let index = 0
    for(let i = 0; i<this.tickers.length; ++i){
      if(this.tickers[i] == ticker){
        index = i;
        break;
      }
    }

    let avgcost = Number(this.costs[index])/Number(this.quantity[index])

    this.quantity[index] = (Number(this.quantity[index]) - Number(quan)).toString()

    if(this.quantity[index] == 0){
      this.tickers.splice(index, 1)
      this.costs.splice(index, 1)
      this.quantity.splice(index, 1)
      document.getElementById(ticker).style.display = 'none'
      
      if(this.tickers.length != 0){
        localStorage.setItem('port_tickers',JSON.stringify(this.tickers))
      } else {
        localStorage.removeItem('port_tickers')
        localStorage.removeItem('port_cost')
        localStorage.removeItem('port_quantity')
        this.available = false
        this.modalService.dismissAll()
        return
      }
    } else {
      
      this.costs[index] = (Number(this.costs[index]) - Number(quan)*avgcost).toFixed(2)
    }


    localStorage.removeItem('port_cost')
    localStorage.removeItem('port_quantity')
    localStorage.setItem('port_cost',JSON.stringify(this.costs))
    localStorage.setItem('port_quantity',JSON.stringify(this.quantity))
    

    for(let i = 0; i<this.tickers.length; ++i){
      this._mains.send_dp(this.tickers[i]).subscribe((data) => this.compdesc[i] = data)

      this._mains.send_lp(this.tickers[i]).subscribe((data) => this.latsp[i] = data)
    }
    this.modalService.dismissAll()
  }

  getDetails(t){
    this.router.navigate(['/details', t])
  }

  numm(vs :string){
    return Number(vs)
  }
}
