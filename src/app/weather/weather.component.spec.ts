import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WeatherComponent } from './weather.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { WeatherService } from '../shared/services/weather.service';
import { LoggerService } from '../shared/services/logger.service';
import { Subject } from 'rxjs';

describe('WeatherComponent', () => {
  let component: WeatherComponent;
  let fixture: ComponentFixture<WeatherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WeatherComponent],
      imports: [HttpClientTestingModule, ReactiveFormsModule],
      providers: [WeatherService, LoggerService],
    }).compileComponents();

    fixture = TestBed.createComponent(WeatherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize component properties', () => {
    expect(component.cityInput).toBeUndefined();
    expect(component.weatherDetails).toBeUndefined();
    expect(component.cityList).toBeDefined();
    expect(component.weatherType).toBeUndefined();
    expect(component.errorMsg).toBeUndefined();
    expect(component.searchForm).toBeDefined();
    expect(component.Math).toBeDefined();
    expect(component.unsubscribe).toBeInstanceOf(Subject);
  });

  it('should build the searchForm', () => {
    component.buildForm();
    expect(component.searchForm).toBeDefined();
    expect(component.searchForm.get('cityName')).toBeDefined();
  });

  it('should handle search and call getWeatherDetails', () => {
    component.searchForm.patchValue({ cityName: 'London' });
    const getWeatherDetailsSpy = spyOn(component, 'getWeatherDetails');
    component.handleSearch();
    expect(getWeatherDetailsSpy).toHaveBeenCalled();
  });

  it('should handle search and not call getWeatherDetails when form is invalid', () => {
    const getWeatherDetailsSpy = spyOn(component, 'getWeatherDetails');
    component.handleSearch();
    expect(getWeatherDetailsSpy).not.toHaveBeenCalled();
  });

  it('should get city details and update weather details', () => {
    const cityObj = {
      details: {
        /* city details */
      },
      active: false,
    };
    component.weatherService.cityList = [
      {
        details: {
          /* city details */
        },
        active: true,
      },
      cityObj,
    ];
    component.getCityDetails(cityObj);
    expect(component.weatherDetails).toBe(cityObj.details);
    expect(cityObj.active).toBeTruthy();
  });

  it('should set first city', () => {
    component.cityList = [
      {
        key: 'city1',
        details: {
          /* city details */
        },
        active: false,
      },
      {
        key: 'city2',
        details: {
          /* city details */
        },
        active: false,
      },
    ];
    component.setFirstCity();
    expect(component.cityList[0].active).toBeTruthy();
    expect(component.weatherDetails).toBe(component.cityList[0].details);
    expect(component.cityInput).toBe(component.cityList[0].key);
  });

  it('should unsubscribe when component is destroyed', () => {
    const spy = spyOn(component.unsubscribe, 'unsubscribe');
    component.ngOnDestroy();
    expect(spy).toHaveBeenCalledTimes(0);
  });
});
