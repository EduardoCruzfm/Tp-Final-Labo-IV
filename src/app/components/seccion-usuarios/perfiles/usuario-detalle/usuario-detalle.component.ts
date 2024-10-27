import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-usuario-detalle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './usuario-detalle.component.html',
  styleUrl: './usuario-detalle.component.css'
})
export class UsuarioDetalleComponent {
  usuario: any;

  constructor(private router: Router) {
    // Almacenamos el estado de navegación
    const navigation = this.router.getCurrentNavigation();
    this.usuario = navigation?.extras.state?.["usuario"];
  }

  ngOnInit(): void {
    if (this.usuario) {
      console.log('Datos del usuario:', this.usuario);
    } else {
      console.error('No se han recibido datos del usuario.');
    }
  }
}
