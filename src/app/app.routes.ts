import { Routes } from '@angular/router';
// import { importProvidersFrom } from '@angular/core';
// import { InicioComponent } from './components/inicio/inicio.component'; 
// import { SearchComponent } from './components/search/search.component'; 
// import { AreaPersonalUsuariosPage } from './pages/area-personal-usuarios/area-personal-usuarios';
// import { AreaPersonalBmPage } from './pages/area-personal-bm/area-personal-bm';


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
  
  { 
    path: 'area-personal-bm', 
    loadComponent: () => import('./pages/area-personal-bm/area-personal-bm').then(m => m.AreaPersonalBmPage) 
  },

  { 
    path: 'inside-store/:storeId', 
    loadComponent: () => import('./pages/insideStore/insideStore').then(m => m.InsideStoreComponent) 
  },

  {
    path: 'crud-productos',
    loadComponent: () => import('./pages/crudProductos/crudProductos').then((m) => m.CrudProductosComponent),
  },

  { path: '**', 
    redirectTo: '', 
    pathMatch: 'full' 
  } 
];
