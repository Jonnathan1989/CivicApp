import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'splash',
    pathMatch: 'full'
  },
  {
    path: 'splash',
    loadComponent: () => import('./pages/splash/splash.page').then(m => m.SplashPage)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then(m => m.LoginPage)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.page').then(m => m.RegisterPage)
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then(m => m.HomePage)
  },
  {
    path: 'nuevo-reporte',
    loadComponent: () => import('./pages/nuevo-reporte/nuevo-reporte.page').then( m => m.NuevoReportePage)
  },
  {
    path: 'mis-reportes',
    loadComponent: () => import('./pages/mis-reportes/mis-reportes.page').then( m => m.MisReportesPage)
  },
  {
    path: 'mapa',
    loadComponent: () => import('./pages/mapa/mapa.page').then( m => m.MapaPage)
  },
  {
    path: 'detalle-reporte',
    loadComponent: () => import('./pages/detalle-reporte/detalle-reporte.page').then( m => m.DetalleReportePage)
  },
  {
    path: 'perfil',
    loadComponent: () => import('./pages/perfil/perfil.page').then( m => m.PerfilPage)
  },
  {
    path: 'panel-funcionario',
    loadComponent: () => import('./pages/panel-funcionario/panel-funcionario.page').then( m => m.PanelFuncionarioPage)
  },
  {
    path: 'detalle-gestion',
    loadComponent: () => import('./pages/detalle-gestion/detalle-gestion.page').then( m => m.DetalleGestionPage)
  },
];