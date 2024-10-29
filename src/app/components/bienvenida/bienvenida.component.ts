import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { CommonModule, ViewportScroller } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { RouterModule } from '@angular/router';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service'; 
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-bienvenida',
  standalone: true,
  imports: [NavbarComponent,RouterModule, SweetAlert2Module,CommonModule],
  templateUrl: './bienvenida.component.html',
  styleUrl: './bienvenida.component.css'
})
export class BienvenidaComponent {
  userLoggedIn: boolean = false; 
  userEmail: string | null = null; 
  tipoUsuario: string | any = null;


  constructor(private authService: AuthService, private viewportScroller: ViewportScroller, private router: Router, private route: ActivatedRoute) {
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
        this.viewportScroller.scrollToPosition([0, 0]);
      }
    });
  } 

    ngOnInit(): void {
      // Recuperar los parámetros de la ruta
      this.route.queryParams.subscribe(params => {
        this.tipoUsuario = params['tipo'];
      });
    }

  async onLinkClick(event: MouseEvent, path: string) {
    event.preventDefault(); // Evita la acción predeterminada del enlace

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
          <a href="/registro">Registrarse</a>
        </div>
      `
      });
      console.log('Validación fallida');
    }
  }

  validateUser() {
    return this.userLoggedIn;
  }

  async navigateTo() {
      // La validación
      const isValid = this.validateUser();

      if (isValid) {
        this.router.navigate(['/turnos'],{ queryParams: { tipo: this.tipoUsuario } }); 
      } else {
  
        await Swal.fire({
          icon: 'warning',
          title: 'Oops...',
          text: 'Debe registrarse para poder solicitar un turno!',
          footer: `
          <div style="display: flex; flex-direction: column;">
            <a href="/login">Iniciar Sesión</a>
            <a href="/registro">Registrarse</a>
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
