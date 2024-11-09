import { Component, Input, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service'; 
import { DatabaseService } from '../../services/database.service';
import { UsuarioService } from '../../services/usuario.service';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent { 

  tipoUsuarioPefil: string = '';

  userLoggedIn: boolean = false;      
  userEmail: string | null = null; 
  usuarioActual: any | null = "";

  constructor(private authService: AuthService, private router: Router, private db: DatabaseService,private usuarioService: UsuarioService) {
    // Suscribirse a los cambios de estado de autenticación
    this.authService.userLoggedIn$.subscribe((isLoggedIn) => {
      this.userLoggedIn = isLoggedIn;
    });

    // Suscribirse a los cambios de correo del usuarioActual
    this.authService.userEmail$.subscribe(async (email) => {
      this.userEmail = email;
    });

    this.tipoUsuarioPefil = this.usuarioService.getUsuarioPerfil();
    
  }
  
  async ngOnInit(): Promise<void> {
    // Recuperar el perfil del usu
    await this.cargarUsuarioActual();
    this.usuarioService.setUsuario(this.usuarioActual );
    this.tipoUsuarioPefil = this.usuarioService.getUsuarioPerfil();
    this.usuarioActual = this.usuarioService.getUsuario();

    console.log("tipoUsuarioPefil", this.tipoUsuarioPefil)
    console.log("usuarioActual ", this.usuarioActual)
  }
  
  async cargarUsuarioActual() {
    const user = await this.authService.getCurrentUser(); // Obtener el usuario actual
    if (user) {
      console.log("UID " + user.uid);
      this.usuarioActual = await this.db.obtenerUsuarioPorId(user.uid, this.tipoUsuarioPefil); // <-----
      
    }
  }

  home() { 

    switch (this.usuarioActual.perfil) {
      case 'paciente':
        this.router.navigate(['/bienvenida']).then(() => {
          this.scrollToSection('nav');
        });
        
        break;
      case 'especialista':
        this.router.navigate(['/bienvenida']).then(() => {
          this.scrollToSection('nav');
        });
        
        break;
      case 'administrador':
        this.router.navigate(['/bienvenida']).then(() => {
          this.scrollToSection('nav');
        });
        break;
    
    }
    
  }

  misturnos() {

    if (this.tipoUsuarioPefil == 'pacientes') {
      this.router.navigate(['/mis-turnos']); // paciente
    }
    else if (this.tipoUsuarioPefil == 'especialistas') {
      this.router.navigate(['/mis-turnos-especilista']); // para el especialista crear******
    }
  }
  // misturnos() {

  //   if (this.tipoUsuario == 'pacientes') {
  //     this.router.navigate(['/mis-turnos']); // paciente
  //   }
  //   else if (this.tipoUsuario == 'especialistas') {
  //     this.router.navigate(['/mis-turnos-especilista']); // para el especialista crear******
  //   }
  // }

  seccionUsuarios() {
    this.router.navigate(['/seccion-usuarios']);
  }
  miPerfil(usuario: any) {
    this.usuarioService.setUsuario(usuario); 
    this.router.navigate(['/usuario-detalle']);
    // this.router.navigate(['/usuario-detalle'],{ state: { usuario } });
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
      this.usuarioService.clearUsuario();
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
