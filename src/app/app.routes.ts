import { Routes } from '@angular/router';
import { InicioComponent } from './pages/inicio/inicio.component';
import { NavbarComponent } from './pages/navbar/navbar.component';

export const routes: Routes = [
  { path: '', component: InicioComponent },
  { path: '', component: NavbarComponent},
];
