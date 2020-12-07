import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { PortfolioComponent } from './portfolio/portfolio.component';
import { WatchlistComponent } from './watchlist/watchlist.component';
import { SearchitComponent } from './searchit/searchit.component';
import { DetailsComponent } from './details/details.component';

import { MatTabsModule } from '@angular/material/tabs'
import { MatAutocomplete, MatAutocompleteModule } from '@angular/material/autocomplete'
import { MatFormField, MatFormFieldControl, MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner'

import { HighchartsChartModule } from 'highcharts-angular';

import { DailychartService } from './dailychart.service';
import { MainserviceService } from './mainservice.service';


@NgModule({
  declarations: [
    AppComponent,
    SearchitComponent,
    WatchlistComponent,
    PortfolioComponent,
    DetailsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatTabsModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    HighchartsChartModule
  ],
  providers: [DailychartService, MainserviceService],
  bootstrap: [AppComponent]
})
export class AppModule { }
