import { Component, OnInit } from '@angular/core';
import { City } from 'src/model/cityDetails';
import { CurrentWeather } from 'src/model/currentWeather';
import { WeatherServiceService } from 'src/services/weather-service.service';
import 'chart.js';
import { ChartOptions, LinearScale, TimeScale } from 'chart.js';
import Chart from 'chart.js/auto';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCoffee, faSearchLocation } from '@fortawesome/free-solid-svg-icons';

interface ForecastByDay {
  date: string;
  temperature: number;
  weatherDescription: string;
  weatherIcon: string;
}

@Component({
  selector: 'app-weather-dashboard',
  // standalone: true,
  // imports: [FontAwesomeModule],
  templateUrl: './weather-dashboard.component.html',
  styleUrls: ['./weather-dashboard.component.css']
})
export class WeatherDashboardComponent implements OnInit {
  faSeacrh = faSearchLocation;
  public chart: any;
  lineChart: any;
  date : any
  hourlyTemperatureData: any[];
  city: string
  cityName: any
  cityDetails: City[]
  forecastData: any[];
  forecastDataByDay: ForecastByDay[] = [];
  currentWeather: CurrentWeather

  latitude: number
  longitude: number
  pressure: number;
  humidity: number;
  main: string;
  weatherIcon : string;
  temperature: number;
  minTemperature: number;
  maxTemperature: number;
  wind: any;
  notFound: boolean = false;
  country: string;
  id: number;
  feels_like: number;

  constructor(private api: WeatherServiceService) {}

  ngOnInit(): void {
    this.date = new Date
  }

  fetchHourlyWeatherData(): void {
    const city = this.city; // Replace with your city
    this.api.getHourlyWeather(city).subscribe(data => {
      console.log(data)
      this.hourlyTemperatureData = data.list.map(item => {
        const date = new Date(item.dt * 1000); // Convert Unix timestamp to milliseconds and create Date object
        const hours = date.getHours(); // Get hours
        const minutes = date.getMinutes(); // Get minutes
        const timeString = `${hours}:${minutes}`; // Construct time string
        return {
          timeString : `${hours}:${minutes}`,
          temperature: item.main.temp
        };

      });
      // if () {
        
      // }
      this.createChart()
    });
  }


  createChart() {

    if (this.chart) {
      // Destroy the existing chart instance
      this.chart.destroy();
    }

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
        scales : {
          x : {
            grid : {
              display : false
            } 
          }
        }
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
        this.fetchHourlyWeatherData();

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
        this.weatherIcon = this.currentWeather.weather[0].icon
        this.wind = this.currentWeather.wind.speed
        this.id = this.currentWeather.id
        const temperatureInKelvin = this.currentWeather.main.temp; // Assuming temperature is returned by the API
        const minTemperatureInKelvin = this.currentWeather.main.temp_min; // Assuming temperature is returned by the API
        const maxTemperatureInKelvin = this.currentWeather.main.temp_max; // Assuming temperature is returned by the API
        const feelsLike = this.currentWeather.main.feels_like
        this.temperature = this.api.convertKelvinToCelsius(temperatureInKelvin);
        this.minTemperature = this.api.convertKelvinToCelsius(minTemperatureInKelvin);
        this.maxTemperature = this.api.convertKelvinToCelsius(maxTemperatureInKelvin);
        this.feels_like = this.api.convertKelvinToCelsius(feelsLike)
        console.log('Temperature in Celsius:', this.temperature);
        this.getForecast()
      }

    })
  }


  getForecast() {
    this.api.getForecast(this.latitude, this.longitude).subscribe((data: any) => {
      if (data && data.list && data.list.length > 0) {
        this.forecastData = data.list;
        this.forecastDataByDay = this.groupForecastByDay(this.forecastData).slice(1);
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
          weatherIcon: forecast.weather[0].icon,
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
        return "assets/sun.png"; // clear sky day
      case '01n':
        return "assets/crescent-moon.png"; // clear sky night
      case '02d':
        return "assets/sun cloud.png";
      case '02n':
        return "assets/moon.png";
      case '03d':
        return "assets/cloudsScattered.png";
      case '03n':
        return "assets/cloudsScattered.png";
      case '04d':
        return "assets/weather.png";
      case '04n':
        return "assets/weather.png"; // clouds
      case '09d':
        return "assets/shower.png";
      case '09n':
        return "assets/shower.png";
      case '10d':
        return "assets/sun-shower.png";
      case '10n':
        return "assets/night.png";// rain
      case '11d':
        return "assets/thunderstorm.png";
      case '11n':
        return "assets/thunderstorm.png"; // thunderstorm
      case '13d':
        return "assets/snowflake.png";
      case '13n':
        return "assets/snowflake.png"; // snow
      case '50d':
        return "assets/mist day.png";
      case '50n':
        return "assets/mist night.png"; // snow
      default:
        return 'fas fa-question'; // default icon for unknown weather
    }
  }

  getBackgroundImageUrl(): string {
    switch (this.main) {
      case "Snow":
        return "assets/snow.png";
      case "Clouds":
        return "assets/clouds.png";
      case "Fog":
        return "assets/fog.png";
      case "Rain":
        return "assets/kid.png";
      case "Clear":
        return "assets/clear-sky.png";
      case "Thunderstorm":
        return "assets/thunderstorm.png";
      case "Mist":
        return "assets/mist.png";
      case "Smoke":
        return "assets/smoke.png";
      case "Haze":
        return "assets/haze.png";
      case "Dust":
        return "assets/dust-storm.png";
      case "Fog":
        return "assets/fog.png";
      case "Ash":
        return "assets/fire.png";
      case "Tornado":
        return "assets/tornado.png";
      default:
        return "assets/output-onlinegiftools.gif";
    }
  }

}
