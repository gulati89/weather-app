import { Component, OnInit } from '@angular/core';
import { Subject, tap } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { WeatherService } from '../shared/services/weather.service';
import { WeatherType } from '../shared/models/weather.model';


@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss'],
})
export class WeatherComponent implements OnInit {
  cityInput!: any;
  weatherDetails: any;
  cityList: any;
  weatherType!: WeatherType;
  Math: any;

  unsubscribe: Subject<boolean> = new Subject<boolean>();

  constructor(private weatherService: WeatherService) {
    this.Math = Math;
    this.cityList = this.weatherService.cityList;
  }

  ngOnInit(): void {}

  setCurrentDate() {
    const date = new Date();
    this.weatherDetails.date =
      date.toDateString() + ', ' + date.toLocaleTimeString();
  }

  handleSearch(city: string) {
    const params = 'q=' + city + '&units=metric';
    this.weatherService
      .getWeatherData(params)
      .pipe(tap((data) => console.log('tap data',data)),
      takeUntil(this.unsubscribe))
      .subscribe((response: WeatherType) => {
        this.weatherDetails = response;
        this.setCurrentDate();
        this.weatherService.addCityToList(city, this.weatherDetails);
      });
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
