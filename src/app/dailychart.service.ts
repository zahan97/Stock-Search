import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DailychartService {

  constructor(private http:HttpClient) { }

  send_now(ticker:String){
    return this.http.get("https://enduring-victor-294122.wn.r.appspot.com/datanow?symbol="+ticker)
  }

  send_old(ticker:String){
    return this.http.get("https://enduring-victor-294122.wn.r.appspot.com/dataold?symbol="+ticker)
  }
}

