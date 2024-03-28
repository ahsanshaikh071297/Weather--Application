import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WeatherServiceService {
  private apiKey = '49dd824433e8dc17f2ff6d8bf2fd0ac4';
  private cityUrl = 'http://api.openweathermap.org/geo/1.0';
  private weatherUrl = 'https://api.openweathermap.org/data/2.5';

  // http://api.openweathermap.org/geo/1.0/direct?q=London&limit=5&appid={API key}

  constructor(private http: HttpClient) { }

  getCityDetail(city: string): Observable<any> {
    return this.http.get(`${this.cityUrl}/direct?q=${city}&limit=5&appid=${this.apiKey}`);
  }

  getWeather(lat: number, lon : number): Observable<any> {
    return this.http.get(`${this.weatherUrl}/weather?lat=${lat}&lon=${lon}&appid=${this.apiKey}`);
  }

  getForecast(lat: number, lon : number): Observable<any> {
    return this.http.get(`${this.weatherUrl}/forecast?lat=${lat}&lon=${lon}&appid=${this.apiKey}`);
  }

  getHourlyWeather(city: string): Observable<any> {
    const url = `${this.weatherUrl}/forecast?q=${city}&appid=${this.apiKey}&units=metric`;
    return this.http.get(url);
  }



  

  convertKelvinToCelsius(kelvin: number): number {
    const celsius = kelvin - 273.15;
    return +celsius.toFixed(2); 
  }
}
