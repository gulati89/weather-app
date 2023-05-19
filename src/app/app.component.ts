import { Component, ChangeDetectorRef, AfterContentChecked  } from '@angular/core';
import { LoaderService } from './shared/services/loader.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'weather-app';

  isLoading: Subject<boolean> = this.loaderService.isLoading;
  
  constructor(public cdref: ChangeDetectorRef, private loaderService: LoaderService) { }

  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }
}
