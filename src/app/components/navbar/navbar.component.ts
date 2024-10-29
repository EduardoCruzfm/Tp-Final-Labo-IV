import { Component, Input, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service'; 
import { DatabaseService } from '../../services/database.service';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  @Input() tipoUsuario: string = ""; 
  userLoggedIn: boolean = false;      
  userEmail: string | null = null; 
  usuarioActual: any | null = "";

  constructor(private authService: AuthService, private router: Router, private db: DatabaseService) {
    // Suscribirse a los cambios de estado de autenticación
    this.authService.userLoggedIn$.subscribe((isLoggedIn) => {
      this.userLoggedIn = isLoggedIn;
    });

    // Suscribirse a los cambios de correo del usuarioActual
    this.authService.userEmail$.subscribe(async (email) => {
      this.userEmail = email;
      if (email && this.tipoUsuario) {
        await this.cargarUsuarioActual();
      } else { 
        console.log("ERROR usuarioActual nulo: " + this.usuarioActual);
      }
    });
  }

  async ngOnChanges(changes: SimpleChanges) {
    if (changes['tipoUsuario'] && this.userEmail) {
      // Si `tipoUsuario` ha cambiado y tenemos el correo, volvemos a cargar el usuario.
      await this.cargarUsuarioActual();
    }
  }

  async cargarUsuarioActual() {
    const user = await this.authService.getCurrentUser(); // Obtener el usuario actual
    if (user) {
      console.log("UID " + user.uid);
      this.usuarioActual = await this.db.obtenerUsuarioPorId(user.uid, this.tipoUsuario);
    }
  }

  home() {
    this.router.navigate(['/bienvenida']).then(() => {
      this.scrollToSection('nav');
    });
  }

  misturnos() {
    this.router.navigate(['/mis-turnos']);
  }

  seccionUsuarios() {
    this.router.navigate(['/seccion-usuarios']);
  }
  miPerfil(usuario: any) {
    this.router.navigate(['/usuario-detalle'],{ state: { usuario } });
  }

  scrollToSection(sectionId: string) {
    this.router.navigate([], { fragment: sectionId }).then(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  cerrarSesion() {
    this.authService.logout().then(() => {
      this.router.navigate(['/bienvenida']); 
    });
  }

  iniciarSesion() {
    this.router.navigate(['/login']); 
  }

  registrarse() {
    this.router.navigate(['/registro']); 
  }
}
