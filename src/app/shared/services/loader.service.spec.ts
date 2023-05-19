import { TestBed } from '@angular/core/testing';
import { LoaderService } from './loader.service';

describe('LoaderService', () => {
  let loaderService: LoaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoaderService],
    });
    loaderService = TestBed.inject(LoaderService);
  });

  it('should create the service', () => {
    expect(loaderService).toBeTruthy();
  });

  describe('isLoading', () => {
    it('should emit true when show() is called', () => {
      loaderService.isLoading.subscribe((value) => {
        expect(value).toBeTrue();
      });
      loaderService.show();
    });

    it('should emit false when hide() is called', () => {
      loaderService.isLoading.subscribe((value) => {
        expect(value).toBeFalse();
      });
      loaderService.hide();
    });
  });
});