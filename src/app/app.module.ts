import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { WeatherDashboardComponent } from './dashboard/weather-dashboard/weather-dashboard.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgxUiLoaderHttpModule, NgxUiLoaderModule } from "ngx-ui-loader";

@NgModule({
  declarations: [
    AppComponent,
    WeatherDashboardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    FontAwesomeModule,
    NgxUiLoaderModule,
    NgxUiLoaderHttpModule.forRoot({
      showForeground : true
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
