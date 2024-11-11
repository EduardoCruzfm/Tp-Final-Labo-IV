import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';


@Component({
  selector: 'app-seccion-usuarios',
  standalone: true,
  imports: [NavbarComponent,CommonModule],
  templateUrl: './seccion-usuarios.component.html',
  styleUrl: './seccion-usuarios.component.css',
  animations: [
    trigger('fadeAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('500ms', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('500ms', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class SeccionUsuariosComponent {

  mostrarLogin: boolean = true; 

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
