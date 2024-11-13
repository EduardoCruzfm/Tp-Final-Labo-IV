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
    path: 'registro-administrador',
    loadComponent: () =>
      import('./components/registro/registro-administrador/registro-administrador.component').then(
        (m) => m.RegistroAdministradorComponent
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
  {
    path: 'usuario-detalle',
    loadComponent: () =>
      import('./components/seccion-usuarios/perfiles/usuario-detalle/usuario-detalle.component').then(
        (m) => m.UsuarioDetalleComponent
      ),
  },
  {
    path: 'turnos',
    loadComponent: () =>
      import('./components/turnos/turnos.component').then(
        (m) => m.TurnosComponent
      ),
  },
  {
    path: 'mis-turnos',
    loadComponent: () =>
      import('./components/mis-turnos/mis-turnos.component').then(
        (m) => m.MisTurnosComponent
      ),
  },
  {
    path: 'mis-turnos-especilista',
    loadComponent: () =>
      import('./components/mis-turnos-especialista/mis-turnos-especialista.component').then(
        (m) => m.MisTurnosEspecialistaComponent
      ),
  },
  {
    path: 'mostrar-especialidades',
    loadComponent: () =>
      import('./components/mostrar-especialidades/mostrar-especialidades.component').then(
        (m) => m.MostrarEspecialidadesComponent
      ),
  },
  {
    path: 'mostrar-pefil-especialistas',
    loadComponent: () =>
      import('./components/mostrar-pefil-especialistas/mostrar-pefil-especialistas.component').then(
        (m) => m.MostrarPefilEspecialistasComponent
      ),
  },
  {
    path: 'solicitar-turno',
    loadComponent: () =>
      import('./components/solicitar-turno/solicitar-turno.component').then(
        (m) => m.SolicitarTurnoComponent
      ),
  },
  {
    path: 'historia-clinica',
    loadComponent: () =>
      import('./components/historia-clinica/historia-clinica.component').then(
        (m) => m.HistoriaClinicaComponent
      ),
  },
  {
    path: 'estadisticas',
    loadComponent: () =>
      import('./components/estadisticas/estadisticas.component').then(
        (m) => m.EstadisticasComponent
      ),
  },
  
];
