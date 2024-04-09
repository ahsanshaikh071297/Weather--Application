# WeatherForecast

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.1.0.

# Overview
This project is a Weather Forecast web application that provides current weather statistics for a searched city, as well as a graphical representation of temperature trends using Chart.js. It also offers a 5-day forecast to help users plan ahead. The application fetches weather data from the OpenWeatherMap weather API.

# Features
Current Weather Stats: Users can search for a city and view current weather statistics, including temperature, humidity, wind speed, etc.
Graphical Temperature Trends: The application displays a graphical representation of temperature trends for the upcoming hours using Chart.js, allowing users to visualize temperature changes over time.
5-Day Forecast: Users can also view a 5-day forecast to plan their activities in advance, with information on expected temperature, weather conditions, etc.
Loading Indicator: Implemented an NGXUI Loader to show a loading indicator during API calls, providing visual feedback to users while fetching data.
Weather Icons: Displays weather icons corresponding to the current weather conditions, enhancing the user interface and providing visual cues.

# Technologies Used
Angular: Frontend development framework used to build the web application.
RapidAPI: Weather API used to fetch current weather data and forecasts.
Chart.js: JavaScript library used for creating interactive and customizable charts for temperature trends.
NGXUI Loader: Angular library for displaying loading indicators during API calls.
HTML, CSS, TypeScript: Languages used for building the frontend components and logic.

# Usage
Search for City: Enter the name of the city you want to check the weather for in the search bar and press Enter.
View Current Stats: The application will display the current weather statistics for the searched city, including temperature, humidity, wind speed, etc.
Temperature Graph: You can also view a graphical representation of temperature trends for the upcoming hours, helping you visualize temperature changes over time.
5-Day Forecast: Scroll down to view the 5-day forecast, which provides information on expected temperature, weather conditions, etc.

# Contributions
Contributions to this project are welcome. If you find any bugs or have suggestions for improvement, please open an issue or submit a pull request on GitHub.

# Acknowledgements
Special thanks to OpenWeatherMap for providing the weather API, Chart.js for the graphical representation of temperature trends, NGXUI Loader for the loading indicator, and the Angular community for their valuable contributions.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
