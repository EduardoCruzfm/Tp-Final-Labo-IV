import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';


@Component({
  selector: 'app-seccion-usuarios',
  standalone: true,
  imports: [NavbarComponent],
  templateUrl: './seccion-usuarios.component.html',
  styleUrl: './seccion-usuarios.component.css'
})
export class SeccionUsuariosComponent {

  constructor(private router: Router) { }
   
  seleccionarPendientes() {
    this.router.navigate(['/pendientes']);   // Podra generar usuarios pacientes - especialista y admin
  }

  seleccionarPerfiles() {
    this.router.navigate(['/perfiles']);
  }

  registrarPacientes() {
    this.router.navigate(['/registro-pacientes']);
  }

  registrarEspecialistas() {
    this.router.navigate(['/registro-especialistas']);
  }

  registrarAdministradores() {
    this.router.navigate(['/registro-administrador']);
  }

}
