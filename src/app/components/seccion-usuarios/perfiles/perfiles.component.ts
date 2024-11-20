import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatabaseService } from '../../../services/database.service';
import { Router } from '@angular/router';
import { UsuarioService } from '../../../services/usuario.service';
import { NavbarComponent } from '../../navbar/navbar.component';
import { HoverHighlightDirective } from '../../../directives/hover-highlight.directive';



@Component({
  selector: 'app-perfiles',
  standalone: true,
  imports: [CommonModule,NavbarComponent,HoverHighlightDirective],
  templateUrl: './perfiles.component.html',
  styleUrl: './perfiles.component.css'
})
export class PerfilesComponent {
  listaUsuarios: any[] = [];

  constructor(private db: DatabaseService, private router: Router,private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.db.traerUsuario('administradores').subscribe((response) => {
      this.listaUsuarios = this.listaUsuarios.concat(response); 
      console.log('Administradores:', this.listaUsuarios);
    });

    this.db.traerUsuario('pacientes').subscribe((response) => {
      this.listaUsuarios = this.listaUsuarios.concat(response); 
      console.log('Pacientes:', this.listaUsuarios);
    });

    this.db.traerUsuario('especialistas').subscribe((response) => {
      this.listaUsuarios = this.listaUsuarios.concat(response); 
      console.log('Especialistas:', this.listaUsuarios);
    });
  }

  verHistorialPaciente(usuario: any) {
    // Lógica para redirigir al historial del paciente
    // Por ejemplo, puedes usar un servicio de router para navegar a otra ruta
    this.usuarioService.setPacienteHistorial(usuario);
    this.router.navigate(['/historia-clinica']);
    console.log("--->>   ",usuario);
  }
  
  //Ver perfil del usuario
  verDetalleUsuario(usuario: any) {
    // this.router.navigate(['/usuario-detalle'], { state: { usuario } }); // ver esto
  }
}
