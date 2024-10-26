import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', redirectTo: 'bienvenida', pathMatch: 'full' }, // Redirige la ruta raíz a "login"
  {
    path: 'login',
    loadComponent: () =>
      import('./components/login/login.component').then(
        (m) => m.LoginComponent
      ),
  },
  {
    path: 'bienvenida',
    loadComponent: () =>
      import('./components/bienvenida/bienvenida.component').then(
        (m) => m.BienvenidaComponent
      ),
  },
  {
    path: 'registro',
    loadComponent: () =>
      import('./components/registro/registro.component').then(
        (m) => m.RegistroComponent
      ),
  },
  {
    path: 'registro-pacientes',
    loadComponent: () =>
      import('./components/registro/registro-pacientes/registro-pacientes.component').then(
        (m) => m.RegistroPacientesComponent
      ),
  },
  {
    path: 'registro-especialistas',
    loadComponent: () =>
      import('./components/registro/registro-especialistas/registro-especialistas.component').then(
        (m) => m.RegistroEspecialistasComponent
      ),
  },
  {
    path: 'seccion-usuarios',
    loadComponent: () =>
      import('./components/seccion-usuarios/seccion-usuarios.component').then(
        (m) => m.SeccionUsuariosComponent
      ),
  },
  {
    path: 'pendientes',
    loadComponent: () =>
      import('./components/seccion-usuarios/pendientes/pendientes.component').then(
        (m) => m.PendientesComponent
      ),
  },
  {
    path: 'perfiles',
    loadComponent: () =>
      import('./components/seccion-usuarios/perfiles/perfiles.component').then(
        (m) => m.PerfilesComponent
      ),
  },
];
