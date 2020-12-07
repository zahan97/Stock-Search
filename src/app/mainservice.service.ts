import { HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MainserviceService {

  constructor(private http:HttpClient) { }

  send_dp(ticker:String){
    return this.http.get("https://enduring-victor-294122.wn.r.appspot.com/compdesc?symbol="+ticker)
  }

  send_lp(ticker:string){
    return this.http.get("https://enduring-victor-294122.wn.r.appspot.com/latsp?symbol="+ticker)
  }

  send_news(ticker:string){
    return this.http.get("https://enduring-victor-294122.wn.r.appspot.com/news?symbol="+ticker)
  }
}
