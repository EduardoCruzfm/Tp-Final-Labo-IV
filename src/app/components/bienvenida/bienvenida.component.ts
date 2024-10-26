import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { ViewportScroller } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { RouterModule } from '@angular/router';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service'; 

@Component({
  selector: 'app-bienvenida',
  standalone: true,
  imports: [NavbarComponent,RouterModule, SweetAlert2Module],
  templateUrl: './bienvenida.component.html',
  styleUrl: './bienvenida.component.css'
})
export class BienvenidaComponent {
  userLoggedIn: boolean = false; // Estado de autenticación
  userEmail: string | null = null; 

  constructor(private authService: AuthService, private viewportScroller: ViewportScroller, private router: Router) {
    // Suscribirse a los cambios de estado de autenticación
    this.authService.userLoggedIn$.subscribe((isLoggedIn) => {
      this.userLoggedIn = isLoggedIn;
    });

    // Suscribirse a los cambios de correo del usuario
    this.authService.userEmail$.subscribe((email) => {
      this.userEmail = email;
    });

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.viewportScroller.scrollToPosition([0, 0]); // Desplaza al inicio de la página
      }
    });
  } 

  async onLinkClick(event: MouseEvent, path: string) {
    event.preventDefault(); // Evita la acción predeterminada del enlace

    // La validación
    const isValid = this.validateUser();

    if (isValid) {
      this.router.navigate([path]);
    } else {

      await Swal.fire({
        icon: 'warning',
        title: 'Oops...',
        text: 'Debe registrarse para poder juagar!',
        footer: `
        <div style="display: flex; flex-direction: column;">
          <a href="/login">Iniciar Sesión</a>
          <a href="/register">Registrarse</a>
        </div>
      `
      });
      console.log('Validación fallida');
    }
  }

  validateUser() {
    return this.userLoggedIn;
  }

  async navigateToChat() {
      // La validación
      const isValid = this.validateUser();

      if (isValid) {
        this.router.navigate(['/chat']); // Asegúrate de que '/chat' sea la ruta correcta
      } else {
  
        await Swal.fire({
          icon: 'warning',
          title: 'Oops...',
          text: 'Debe registrarse para poder chatear!',
          footer: `
          <div style="display: flex; flex-direction: column;">
            <a href="/login">Iniciar Sesión</a>
            <a href="/register">Registrarse</a>
          </div>
        `
        });
        console.log('Validación fallida');
      }
    
  }

  scrollToSection(sectionId: string) {
    this.router.navigate([], { fragment: sectionId }).then(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
}
