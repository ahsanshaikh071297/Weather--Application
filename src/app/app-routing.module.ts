import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WeatherDashboardComponent } from './dashboard/weather-dashboard/weather-dashboard.component';

const routes: Routes = [
  { path: '', component: WeatherDashboardComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
