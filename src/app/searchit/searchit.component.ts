import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { debounceTime, map, startWith, switchMap, tap, finalize } from 'rxjs/operators';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-searchit',
  templateUrl: './searchit.component.html',
  styleUrls: ['./searchit.component.css']
})
export class SearchitComponent implements OnInit {
  @ViewChild('tickersym') tickersym: ElementRef;
  myControl = new FormControl();

  options: any;
  filteredOptions: any;
  isLoading = false;

  constructor(private router : Router, private http:HttpClient) { }

  ngOnInit(): void {

    this.myControl.valueChanges
      .pipe(
        debounceTime(400),
        tap(() => {
          this.isLoading = true
          setTimeout(() => { this.isLoading = false }, 700);
        }),
        switchMap((value) => value !== '' && value != null ? this.http.get("https://enduring-victor-294122.wn.r.appspot.com/autocomplete?symbol="+value) : '[]')
      ).subscribe(values => this.filteredOptions = values)
  }

  getDetails(){
    const ticker = this.tickersym.nativeElement.value.toUpperCase()
    if (ticker != '')
      this.router.navigate(['/details', ticker])
  }

}

