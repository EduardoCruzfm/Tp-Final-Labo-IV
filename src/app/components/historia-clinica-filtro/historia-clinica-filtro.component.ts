import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { DatabaseService } from '../../services/database.service';
import { UsuarioService } from '../../services/usuario.service';
import { trigger, transition, style, animate } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';



@Component({
  selector: 'app-historia-clinica-filtro',
  standalone: true,
  imports: [NavbarComponent,CommonModule],
  templateUrl: './historia-clinica-filtro.component.html',
  styleUrl: './historia-clinica-filtro.component.css',
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
export class HistoriaClinicaFiltroComponent {

  tipoUsuarioPefil: any;
  turnos: any;
  listaPacientes: any;
  mostrarLogin: boolean = true; 

  constructor( private db: DatabaseService, private usuarioService: UsuarioService,  private router: Router) {
    this.tipoUsuarioPefil = this.usuarioService.getUsuarioPerfil();
    console.log(this.tipoUsuarioPefil);  
  }
  
  
  async ngOnInit(){
    await this.cargarTurnos();

    if (this.turnos) {
      this.filtrarPacientes();
    }

    console.log('Lista de Usuarios únicos:', this.listaPacientes);
  }

  cargarTurnos(): Promise<void> {
    return new Promise((resolve) => {
      this.db.traerUsuario('turnos').subscribe((response) => {
        this.turnos = response;
        console.log(this.turnos);
        resolve();
      });
    });
  }

  filtrarPacientes() {
    this.listaPacientes = [];

    // Recorrer los turnos y agregar pacientes únicos
    this.turnos.forEach((turno: any) => {
      const paciente = turno.paciente;

      // Verificar si el paciente ya existe en la lista
      if (turno.estado === "finalizado" && !this.listaPacientes.some((usuario :any) => usuario.id === paciente.id ) ) {
        this.listaPacientes.push(paciente);
      }
    });
  }


  verHistorialPaciente(usuario: any) {
    // Lógica para redirigir al historial del paciente
    // Por ejemplo, puedes usar un servicio de router para navegar a otra ruta
    this.usuarioService.setPacienteHistorial(usuario);
    this.router.navigate(['/historia-clinica']);
    console.log("--->>   ",usuario);
  }

}
