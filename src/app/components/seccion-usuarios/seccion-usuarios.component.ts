import { Component } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-seccion-usuarios',
  standalone: true,
  imports: [],
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

}
