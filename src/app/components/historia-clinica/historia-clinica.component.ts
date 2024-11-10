import { Component } from '@angular/core';
import { DatabaseService } from '../../services/database.service';
import { AuthService } from '../../services/auth.service';
import { UsuarioService } from '../../services/usuario.service';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';


@Component({
  selector: 'app-historia-clinica',
  standalone: true,
  imports: [CommonModule,NavbarComponent],
  templateUrl: './historia-clinica.component.html',
  styleUrl: './historia-clinica.component.css'
})
export class HistoriaClinicaComponent {
  tipoUsuarioPefil: any;
  turnos: any;
  turnosFiltrado: any;
  usuarioHistorial:any
  usuarioEspecialista:any
  turnoSeleccionado: any = null; // Para almacenar el turno actual que tiene la reseña


  constructor( private db: DatabaseService,private auth: AuthService, private usuarioService: UsuarioService) {
    this.tipoUsuarioPefil = this.usuarioService.getUsuarioPerfil();
    console.log(this.tipoUsuarioPefil);
  }
  
  
  async ngOnInit(){
     await this.cargarTurnos();
    if (this.turnos) {
      
      if (this.tipoUsuarioPefil === 'administradores') {
        this.turnosFiltrado = this.turnos;
        //obtener el seteo
        this.usuarioHistorial = this.usuarioService.getPacienteHistorial();
        console.log("usuario paciente historial   ",this.usuarioHistorial)
        
        
        this.turnosFiltrado = this.turnos.filter((turno:any) => 
          turno.paciente.id === this.usuarioHistorial.id && turno.estado === "finalizado");
      }
      else if (this.tipoUsuarioPefil === 'pacientes') {
        this.usuarioHistorial = this.usuarioService.getUsuario();
        console.log("usuario paciente   ",this.usuarioHistorial)
        this.turnosFiltrado = this.turnos.filter((turno:any) => 
          turno.paciente.id === this.usuarioHistorial.id && turno.estado === "finalizado" );
        
      }else if(this.tipoUsuarioPefil === 'especialistas'){
        this.usuarioEspecialista = this.usuarioService.getUsuario();
        this.turnosFiltrado = this.turnos.filter((turno:any) => 
          turno.idEspecialista === this.usuarioEspecialista.id && turno.estado === "finalizado");
      }
      console.log("Turnos filtrados -> ",this.turnosFiltrado)
    }
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


  mostrarResenia(turno: any) {
    this.turnoSeleccionado = turno;
    console.log("Turno",  turno);
}

cancelarAccion(){
  this.turnoSeleccionado = null; // Cancelar la acción sin guardar
}

}
