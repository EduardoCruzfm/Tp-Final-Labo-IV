import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DatabaseService } from '../../services/database.service';
import { UsuarioService } from '../../services/usuario.service';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-mostrar-especialidades',
  standalone: true,
  imports: [CommonModule,NavbarComponent],
  templateUrl: './mostrar-especialidades.component.html',
  styleUrl: './mostrar-especialidades.component.css'
})
export class MostrarEspecialidadesComponent {
  especialidades: string[] = [];
  especialistasDisponiblesFiltro: any[] = [""];
  // tipoUsuarioPefil: string;
  tipoUsuario: any;

  imagenes: Array<{ valor: string, imagen: string }> = [ 
    { valor: 'Cardiologia', imagen: 'image/cardiologia.png' }, 
    { valor: 'kinesiologo', imagen: 'image/kineosologia.png' }, 
    { valor: 'Neurologia', imagen: 'image/neurologia.png' }, 
    { valor: 'default', imagen: 'image/default.png' } 
  ]


  constructor( private db: DatabaseService,private router: Router,private usuarioService: UsuarioService) {
    // this.tipoUsuarioPefil = this.usuarioService.getUsuarioPerfil();
    // this.tipoUsuario = this.usuarioService.getUsuario();
  }

  ngOnInit(): void {
    this.cargarEspecialistas();    
  }

  cargarEspecialistas() {
    this.db.traerUsuario('especialistas').subscribe((response) => {
      this.especialistasDisponiblesFiltro = response;
      this.carga(); 
    });
  }

  carga() {
    this.especialidades = [];
    this.especialistasDisponiblesFiltro.forEach((especialista) => {
      if (Array.isArray(especialista.especialidad)) {
        especialista.especialidad.forEach((esp: any) => {
          if (!this.especialidades.includes(esp)) {
            this.especialidades.push(esp);
          }
        });
      }
    });

    console.log('Especialidades cargadas:', this.especialidades);
  }

  getImagenEspecialidad(especialidad: string): string {
    const imagen = this.imagenes.find(img => img.valor.toLowerCase() === especialidad.toLowerCase());
    return imagen ? imagen.imagen : 'image/default.png';
  }

  seleccionarEspecialidad(especialidad: string): void {
    // Redirigir a una ruta específica o realizar una acción
    console.log('Especialidad seleccionada:', especialidad);

    //SEtear especialidad en el storage
    const turno = {especialidad : especialidad }
    this.usuarioService.setTurno(turno);

  
    // Ejemplo de navegación a una ruta específica con la especialidad seleccionada
    this.router.navigate(['/mostrar-pefil-especialistas']);
  }
  

}
