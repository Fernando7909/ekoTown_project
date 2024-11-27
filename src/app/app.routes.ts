import { Routes } from '@angular/router';
import { importProvidersFrom } from '@angular/core';  // Necesario para cargar componentes standalone
import { InicioComponent } from './components/inicio/inicio.component';  // Verifica que este sea un componente standalone
import { SearchComponent } from './components/search/search.component';  // Verifica que este sea un componente standalone
import { AreaPersonalUsuariosPage } from './pages/area-personal-usuarios/area-personal-usuarios';

export const routes: Routes = [
  { 
    path: '', 
    loadComponent: () => import('./components/inicio/inicio.component').then(m => m.InicioComponent) 
  },
     
  { 
    path: 'search', 
    loadComponent: () => import('./components/search/search.component').then(m => m.SearchComponent) 
  },

  { 
    path: 'loginregister', 
    loadComponent: () => import('./components/loginregister/loginregister.component').then(m => m.LoginregisterComponent) 
  },
  
  { 
    path: 'area-personal-usuarios', 
    loadComponent: () => import('./pages/area-personal-usuarios/area-personal-usuarios').then(m => m.AreaPersonalUsuariosPage) 
  }, 

  { path: '**', redirectTo: '', pathMatch: 'full' 

  } 
];
