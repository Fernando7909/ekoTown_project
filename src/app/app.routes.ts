import { Routes } from '@angular/router';
import { importProvidersFrom } from '@angular/core';  // Necesario para cargar componentes standalone
import { InicioComponent } from './components/inicio/inicio.component';  // Verifica que este sea un componente standalone
import { SearchComponent } from './components/search/search.component';  // Verifica que este sea un componente standalone

export const routes: Routes = [
  { 
    path: '', 
    loadComponent: () => import('./components/inicio/inicio.component').then(m => m.InicioComponent) 
  },   // Carga perezosa (lazy load) del componente de inicio
  { 
    path: 'search', 
    loadComponent: () => import('./components/search/search.component').then(m => m.SearchComponent) 
  },  // Carga perezosa (lazy load) del componente de búsqueda
  { path: '**', redirectTo: '', pathMatch: 'full' }  // Redirige rutas desconocidas a la página de inicio
];
