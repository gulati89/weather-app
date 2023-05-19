import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, catchError, tap, throwError } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { WeatherService } from '../shared/services/weather.service';
import { WeatherType } from '../shared/models/weather.model';
import { LoggerService } from '../shared/services/logger.service';


@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss'],
})
export class WeatherComponent implements OnInit, OnDestroy {
  cityInput!: string;
  weatherDetails: any;
  cityList: any;
  weatherType!: WeatherType;
  errorMsg!: string;
  searchForm!: FormGroup;
  Math: any;

  unsubscribe: Subject<boolean> = new Subject<boolean>();

  constructor(private weatherService: WeatherService, private formBuilder: FormBuilder, 
    private loggerService: LoggerService) { }

  ngOnInit(): void {
    this.Math = Math;
    this.cityList = this.weatherService.cityList;
    this.buildForm();
  }

  buildForm() {
    this.searchForm = this.formBuilder.group({
      cityName: ['', Validators.required]
    })
  }

  setCurrentDate() {
    const date = new Date();
    this.weatherDetails.date =
      date.toDateString() + ', ' + date.toLocaleTimeString();
  }

  getWeatherDetails() {
    const city = this.searchForm.get('cityName')?.value;
    const params = 'q=' + city + '&units=metric';
    this.weatherService
      .getWeatherData(params)
      .pipe(tap((data) => this.loggerService.info("Fetching weather info: ", data)),
      catchError((error) => {
        return throwError(() => {
          this.loggerService.error("Error: "+ error);
          this.errorMsg = 'Invalid city';
        })
      }),
      takeUntil(this.unsubscribe))
      .subscribe((response: WeatherType) => {
        this.weatherDetails = response;
        this.setCurrentDate();
        this.weatherService.addCityToList(city, this.weatherDetails);
      });
  }

  handleSearch() {
    this.weatherDetails = null;
    this.errorMsg = '';
    if(this.searchForm.valid) {
      this.getWeatherDetails();
    } 
  }

  getCityDetails(cityObj: any) {
    this.weatherService.removeActiveFromCityList();
    this.weatherDetails = cityObj.details;
    cityObj.active = true;
  }

  setFirstCity() {
    this.cityList[0].active = true;
    this.weatherDetails = this.cityList[0].details;
    this.cityInput = this.cityList[0].key;
  }

  removeCity(event: any, cityObj: any) {
    event.preventDefault();
    if (this.cityList.length === 1) {
      this.weatherDetails = null;
    } else {
      if (cityObj.active) {
        this.setFirstCity();
      }
    }
    this.weatherService.removeCityFromList(cityObj.key);
  }

  ngOnDestroy() {
    this.unsubscribe.next(true);
    this.unsubscribe.complete();
  }
}
