import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { WeatherService } from './weather.service';
import { environment } from 'src/environments/environment';
import { WeatherType } from '../models/weather.model';

describe('WeatherService', () => {
  let weatherService: WeatherService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [WeatherService],
    });
    weatherService = TestBed.inject(WeatherService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(weatherService).toBeTruthy();
  });

  it('should make HTTP GET request to retrieve weather data', () => {
    const params = 'q=London&units=metric';
    const mockWeatherData: WeatherType = {
      coord: { lon: 15.111, lat: 18.111 },
      weather: [],
      base: '',
      main: {
        temp: 17,
        feels_like: 15,
        temp_min: 12,
        temp_max: 20,
        pressure: 25,
        humidity: 30,
      },
      visibility: 0,
      wind: { speed: 1.2, deg: 40, gust: 221 },
      dt: 0,
      sys: { country: 'india', type: 1, id: 2, sunrise: 22, sunset: 11 },
      timezone: 0,
      clouds: { all: 220 },
      id: 0,
      name: '',
      cod: 0,
    };

    weatherService.getWeatherData(params).subscribe((data) => {
      expect(data).toEqual(mockWeatherData);
    });

    const req = httpMock.expectOne(
      `${environment.config.apiUrl}${params}&appid=${environment.config.apiKey}`
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockWeatherData);
  });

  it('should add city to the city list', () => {
    const city = 'London';
    const details = {
      /* city details */
    };
    const expectedCityObj = { key: city, active: true, details };

    weatherService.addCityToList(city, details);
    expect(weatherService.cityList).toContain(expectedCityObj);
  });

  it('should remove city from the city list', () => {
    weatherService.cityList = [
      {
        key: 'London',
        active: true,
        details: {
          /* city details */
        },
      },
      {
        key: 'Paris',
        active: false,
        details: {
          /* city details */
        },
      },
      {
        key: 'New York',
        active: false,
        details: {
          /* city details */
        },
      },
    ];

    weatherService.removeCityFromList('Paris');
    expect(weatherService.cityList).toEqual([
      {
        key: 'London',
        active: true,
        details: {
          /* city details */
        },
      },
      {
        key: 'New York',
        active: false,
        details: {
          /* city details */
        },
      },
    ]);
  });

  it('should remove active flag from all cities in the city list', () => {
    weatherService.cityList = [
      {
        key: 'London',
        active: true,
        details: {
          /* city details */
        },
      },
      {
        key: 'Paris',
        active: true,
        details: {
          /* city details */
        },
      },
      {
        key: 'New York',
        active: true,
        details: {
          /* city details */
        },
      },
    ];

    weatherService.removeActiveFromCityList();
    expect(weatherService.cityList).toEqual([
      {
        key: 'London',
        active: false,
        details: {
          /* city details */
        },
      },
      {
        key: 'Paris',
        active: false,
        details: {
          /* city details */
        },
      },
      {
        key: 'New York',
        active: false,
        details: {
          /* city details */
        },
      },
    ]);
  });
});
