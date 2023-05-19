import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { WeatherType } from '../models/weather.model';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  private rootURL: string = environment.config.apiUrl;
  private apiKey: string = environment.config.apiKey;

  cityList: any = [];

  constructor(private httpClient: HttpClient) {}

  //API call to get Weather data
  getWeatherData(params?: any): Observable<any> {
    return this.httpClient
      .get<WeatherType>(this.rootURL + params + '&appid=' + this.apiKey)
      .pipe(retry(1), catchError(this.handleError));
  }

  private handleError(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      errorMessage = 'Error:' + error.error.message;
    } else {
      // server-side error
      errorMessage =
        'Error Code:' + error.status + '\nMessage:' + error.message;
    }
    console.log(errorMessage);
    return throwError(() => {
      return errorMessage;
    })
  }

  addCityToList(city: string, details: any) {
    this.removeActiveFromCityList();
    this.cityList.push({ key: city, active: true, details });
  }
  
  removeCityFromList(city: string) {
    const index = this.cityList.findIndex((ele: any) => {
        return ele.key === city;
    })
    this.cityList.splice(index, 1);
  }

  removeActiveFromCityList() {
    this.cityList.forEach((ele: any) => { ele.active = false });
  }

}
