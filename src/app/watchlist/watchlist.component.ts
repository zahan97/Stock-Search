import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.css']
})
export class WatchlistComponent implements OnInit {

  public tickers :any
  compdesc = []
  latsp = []
  available :boolean = true
  spin_it :boolean = true

  constructor(private router : Router, private http:HttpClient) { }

  ngOnInit(): void {

    let sid = document.getElementById('src')
    let wid = document.getElementById('watch')
    let pid = document.getElementById('port')

    sid.style.border = 'none'
    pid.style.border = 'none'
    wid.style.border = 'white solid'
    document.getElementById('wlink').style.color = 'white'
    document.getElementById('slink').removeAttribute('style')
    document.getElementById('plink').removeAttribute('style')

    if(localStorage.getItem('tickers') != null && JSON.parse(localStorage.getItem('tickers')).length != 0){
      this.spin_it = true
      this.tickers = JSON.parse(localStorage.getItem('tickers'))
      this.tickers.sort()
      for(let i = 0; i<this.tickers.length; ++i){
        let resp_desc = this.http.get("https://enduring-victor-294122.wn.r.appspot.com/compdesc?symbol="+ this.tickers[i])
        resp_desc.subscribe((data) => this.compdesc[i] = data)

        let resp_latsp = this.http.get("https://enduring-victor-294122.wn.r.appspot.com/latsp?symbol="+ this.tickers[i])
        resp_latsp.subscribe((data) => this.latsp[i] = data)
        setTimeout(() => { this.spin_it = false }, 1000);
      }
    
    } else{
      this.available = false
    }

  }

  putco(x:any){
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }
  
  remove_it(ticker:string) {
    let li = JSON.parse(localStorage.getItem('tickers'))
    li = li.filter(item => item !== ticker)
    localStorage.setItem('tickers', JSON.stringify(li))
    document.getElementById(ticker).style.display = 'none'
    if(li.length == 0){
      this.available = false
    } else {
        this.tickers = JSON.parse(localStorage.getItem('tickers'))
        this.tickers.sort()
        for(let i = 0; i<this.tickers.length; ++i){
          let resp_desc = this.http.get("https://enduring-victor-294122.wn.r.appspot.com/compdesc?symbol="+ this.tickers[i])
          resp_desc.subscribe((data) => this.compdesc[i] = data)

          let resp_latsp = this.http.get("https://enduring-victor-294122.wn.r.appspot.com/latsp?symbol="+ this.tickers[i])
          resp_latsp.subscribe((data) => this.latsp[i] = data)
        }
    }
  }

  getDetails(t){
    this.router.navigate(['/details', t])
  }

}
