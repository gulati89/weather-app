import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
	{ path: '',  redirectTo: 'home', pathMatch: 'full' },
	{ path: 'home', loadChildren: () => import('./weather/weather.module').then(m => m.WeatherModule) },
	{ path: '**', redirectTo: 'home' }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
