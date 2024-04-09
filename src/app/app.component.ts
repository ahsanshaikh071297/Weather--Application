import { Component, OnInit } from '@angular/core';
import { City } from 'src/model/cityDetails';
import { CurrentWeather } from 'src/model/currentWeather';
import { WeatherServiceService } from 'src/services/weather-service.service';
import 'chart.js';
import { ChartOptions, LinearScale, TimeScale } from 'chart.js';
import Chart from 'chart.js/auto';
import { NgxUiLoaderService } from 'ngx-ui-loader';

interface ForecastByDay {
  date: string;
  temperature: number;
  weatherDescription: string;
  weatherIcon: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'weather-forecast';
  city: string
  cityName: any
  cityDetails: City[]
  forecastData: any[];
  forecastDataByDay: ForecastByDay[] = [];
  currentWeather: CurrentWeather
  lineChart: any;
  hourlyTemperatureData: any[];

  latitude: number
  longitude: number
  pressure: number;
  humidity: number;
  main: string;
  temperature: number;
  minTemperature: number;
  maxTemperature: number;
  wind: any;
  notFound: boolean = false;
  country: string;
  id: number;
  mapUrl: string;
  public chart: any;

  constructor(private api: WeatherServiceService, private ngxService: NgxUiLoaderService) {
    const apiKey = '49dd824433e8dc17f2ff6d8bf2fd0ac4'; // Replace with your OpenWeatherMap API key
    const layer = 'clouds_new';
    const zoom = 10;
    const x = 0;
    const y = 0;
    this.mapUrl = `https://tile.openweathermap.org/map/${layer}/${zoom}/${x}/${y}.png?appid=${apiKey}`;
  }

  ngOnInit(): void {
    // this.getCityDetails(this.city)
    // this.getLocation()
    console.log(this.mapUrl)
    // this.fetchHourlyWeatherData();
    // this.createChart()

  }

  // fetchHourlyWeatherData(): void {
  //   const city = 'Mumbai'; // Replace with your city
  //   this.api.getHourlyWeather(city).subscribe(data => {
  //     console.log(data)
  //     this.hourlyTemperatureData = data.list.map(item => {
  //       const date = new Date(item.dt * 1000); // Convert Unix timestamp to milliseconds and create Date object
  //       const hours = date.getHours(); // Get hours
  //       const minutes = date.getMinutes(); // Get minutes
  //       const timeString = `${hours}:${minutes}`; // Construct time string
  //       return {
  //         timeString : `${hours}:${minutes}` ,
  //         temperature: item.main.temp
  //       };

  //     });
  //     this.createChart()
  //   });
  // }


  createChart() {

    this.chart = new Chart("MyChart", {
      type: 'line', //this denotes tha type of chart

      data: {// values on X-Axis
        labels: this.hourlyTemperatureData.map(item => item.timeString),
        datasets: [
          {
            label: 'Temperature (°C)',
            data: this.hourlyTemperatureData.map(item => item.temperature),
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 2,
            fill: true
          },
        ]
      },
      options: {
        aspectRatio: 2.5,
        responsive : true,
      }

    });
  }




  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.getWeather();
      }, (error) => {
        console.error('Error getting location:', error);
      });
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }

  getCityDetails(city: string) {
    this.api.getCityDetail(city).subscribe((data: any[]) => {
      console.log(data); // Log the data returned by the API for debugging
      this.cityDetails = data
      if (this.cityDetails.length > 0) {
        // Access the English name from the local_names object
        const englishName = data[0].local_names['en'];
        this.cityName = englishName
        console.log('English Name:', englishName);
        this.latitude = this.cityDetails[0].lat
        this.longitude = this.cityDetails[0].lon
        this.country = this.cityDetails[0].country
        console.log(this.latitude, this.longitude)
        this.getWeather()

      }
      else {
        this.notFound = true
      }
    });
  }

  getWeather() {
    this.api.getWeather(this.latitude, this.longitude).subscribe(response => {
      this.currentWeather = response
      console.log(this.currentWeather)

      if (this.currentWeather != null) {
        this.notFound = false
        this.pressure = this.currentWeather.main.pressure
        this.humidity = this.currentWeather.main.humidity
        this.main = this.currentWeather.weather[0].main
        this.wind = this.currentWeather.wind.speed
        this.id = this.currentWeather.id
        const temperatureInKelvin = this.currentWeather.main.temp; // Assuming temperature is returned by the API
        const minTemperatureInKelvin = this.currentWeather.main.temp_min; // Assuming temperature is returned by the API
        const maxTemperatureInKelvin = this.currentWeather.main.temp_max; // Assuming temperature is returned by the API
        this.temperature = this.api.convertKelvinToCelsius(temperatureInKelvin);
        this.minTemperature = this.api.convertKelvinToCelsius(temperatureInKelvin);
        this.maxTemperature = this.api.convertKelvinToCelsius(temperatureInKelvin);
        console.log('Temperature in Celsius:', this.temperature);
        this.getForecast()
      }

    })
  }


  getForecast() {
    this.api.getForecast(this.latitude, this.longitude).subscribe((data: any) => {
      if (data && data.list && data.list.length > 0) {
        this.forecastData = data.list;
        this.forecastDataByDay = this.groupForecastByDay(this.forecastData);
      }
    });
  }

  groupForecastByDay(forecastData: any[]): ForecastByDay[] {
    const forecastByDayMap = new Map<string, ForecastByDay>();

    forecastData.forEach(forecast => {
      const date = forecast.dt_txt.split(' ')[0];
      if (!forecastByDayMap.has(date)) {
        const forecastByDay: ForecastByDay = {
          date: date,
          temperature: this.api.convertKelvinToCelsius(forecast.main.temp),
          weatherDescription: forecast.weather[0].description,
          weatherIcon: forecast.weather[0].icon
        };
        forecastByDayMap.set(date, forecastByDay);
        console.log(forecastByDay)
      }
    });

    return Array.from(forecastByDayMap.values());
  }

  getDayOfWeek(dateString: string): string {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const date = new Date(dateString);
    return daysOfWeek[date.getDay()];
  }

  getFormattedTime(unixTimestamp: number): string {
    const date = new Date(unixTimestamp * 1000); // Convert UNIX timestamp to milliseconds
    return date.toLocaleTimeString();
  }

  getWeatherIconClass(weatherIcon: string): string {
    switch (weatherIcon) {
      case '01d':
        return 'fas fa-sun'; // clear sky day
      case '01n':
        return 'fas fa-moon'; // clear sky night
      case '02d':
      case '02n':
      case '03d':
      case '03n':
      case '04d':
      case '04n':
        return 'fas fa-cloud'; // clouds
      case '09d':
      case '09n':
      case '10d':
      case '10n':
        return 'fas fa-cloud-showers-heavy'; // rain
      case '11d':
      case '11n':
        return 'fas fa-bolt'; // thunderstorm
      case '13d':
      case '13n':
        return 'fas fa-snowflake'; // snow
      default:
        return 'fas fa-question'; // default icon for unknown weather
    }
  }

  getBackgroundImageUrl(): string {
    switch (this.main) {
      case "Snow":
        return "https://mdbgo.io/ascensus/mdb-advanced/img/snow.gif";
      case "Clouds":
        return "https://mdbgo.io/ascensus/mdb-advanced/img/clouds.gif";
      case "Fog":
        return "https://mdbgo.io/ascensus/mdb-advanced/img/fog.gif";
      case "Rain":
        return "https://mdbgo.io/ascensus/mdb-advanced/img/rain.gif";
      case "Clear":
        return "https://mdbgo.io/ascensus/mdb-advanced/img/clear.gif";
      case "Thunderstorm":
        return "https://mdbgo.io/ascensus/mdb-advanced/img/thunderstorm.gif";
      default:
        return "https://mdbgo.io/ascensus/mdb-advanced/img/clear.gif";
    }
  }






}
