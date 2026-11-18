import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    // Layout público con header y footer
    loadComponent: () =>
      import('./public/layouts/public-layout/public-layout.component').then(
        m => m.PublicLayoutComponent
      ),
    children: [
      // HOME
      {
        path: '',
        loadComponent: () =>
          import('./public/pages/home/home.component').then(m => m.HomeComponent),
      },

      // PRODUCTOS - Redirección por defecto
      {
        path: 'productos',
        redirectTo: 'productos/airwork',
        pathMatch: 'full',
      },

      // PRODUCTOS - Ruta dinámica para las marcas
      {
        path: 'productos/:id',
        loadComponent: () =>
          import('./public/pages/productos/productos.component').then(
            m => m.ProductosComponent
          ),
      },

      // SERVICIOS
      {
        path: 'servicios',
        loadComponent: () =>
          import('./public/pages/servicios/servicios.component').then(
            m => m.ServiciosComponent
          ),
      },

      // NOSOTROS
      {
        path: 'nosotros',
        loadComponent: () =>
          import('./public/pages/nosotros/nosotros.component').then(
            m => m.NosotrosComponent
          ),
      },

      // CONTACTO
      {
        path: 'contacto',
        loadComponent: () =>
          import('./public/pages/contacto/contacto.component').then(
            m => m.ContactoComponent
          ),
      },
    ],
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('./admin/layouts/admin-layout/admin-layout.component').then(
        m => m.AdminLayoutComponent
      ),
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./admin/pages/dashboard/dashboard.component').then(
            m => m.DashboardComponent
          ),
      },
    ],
  },
  // Redirección de rutas desconocidas al home
  { path: '**', redirectTo: '' },
];
