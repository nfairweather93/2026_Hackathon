import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Results } from './results/results';

export const routes: Routes = [
  {
    path: '',
    component: Home
  },
  {
    path: 'results/:name',
    component: Results
  }
];