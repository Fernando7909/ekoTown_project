import { Routes } from '@angular/router';

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
  {
    path: 'carrito',
    loadComponent: () => import('./pages/carrito/carrito').then(m => m.CarritoComponent), // Nueva ruta para el carrito
  },
  { 
    path: 'blogs/manage', 
    loadComponent: () => import('./pages/blog/blogs-manage/blogs-manage.component').then(m => m.BlogsManageComponent) 
  },
  { 
    path: 'blogs/public', 
    loadComponent: () => import('./pages/blog/blogs-public/blogs-public.component').then(m => m.BlogsPublicComponent) 
  },
  { 
    path: 'blogs/public/:id', 
    loadComponent: () => import('./pages/blog/blogs-public/blogs-public-detail/blogs-public-detail.component').then(m => m.BlogsPublicDetailComponent)
  },
  { 
    path: '**', 
    redirectTo: '', 
    pathMatch: 'full' 
  } 
];
