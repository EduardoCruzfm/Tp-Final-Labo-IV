import { Component } from '@angular/core';
import { DatabaseService } from '../../services/database.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { NavbarComponent } from '../navbar/navbar.component';
import { UsuarioService } from '../../services/usuario.service';


@Component({
  selector: 'app-mis-turnos-especialista',
  standalone: true,
  imports: [FormsModule,CommonModule,NavbarComponent],
  templateUrl: './mis-turnos-especialista.component.html',
  styleUrl: './mis-turnos-especialista.component.css'
})
export class MisTurnosEspecialistaComponent {
  turnos: any[] = [];
  filteredTurnos: any[] = [];
  searchTerm: string = '';

  turnoEnCancelacion: any | null = null; // Turno que está siendo cancelado
  comentarioCancelacion: string = ''; // Comentario de cancelación ----------vuela
  turnoSeleccionado: any = null; // Para almacenar el turno actual que tiene la reseña
  calificacion: number = 0; // o el tipo adecuado que estés usando
  comentario: string = ""; // o el tipo adecuado

  resenia: string = '';
  estadoEnProceso: string = ''; // Puede ser 'cancelar', 'aceptar', 'rechazar', etc.
  mensajeModal: string = ''; // Mensaje dinámico para el modal
  especilaista: any
  tipoUsuario: any;

  tipoUsuarioPefil: string = '';
  

  constructor( private db: DatabaseService,private auth: AuthService, private usuarioService: UsuarioService) {
      this.cargarTurnos();
      this.tipoUsuarioPefil = this.usuarioService.getUsuarioPerfil();
    }
    
    async ngOnInit(): Promise<void> {

        const currentUser = this.auth.getCurrentUser();
      if (currentUser) {
        this.especilaista = await this.db.obtenerUsuarioPorId(currentUser.uid,'especialistas');
        this.usuarioService.setUsuario(this.especilaista);
      }
      console.log("especialista",this.especilaista)
  }

  async cargarTurnos() {
    const currentUser = this.auth.getCurrentUser();
    
    if (currentUser) {
      
      await this.db.traerUsuario('turnos').subscribe((response) => {
        // Filtra los turnos que coinciden con el especialista
        this.turnos = response.filter((turno:any) => turno.idEspecialista === currentUser.uid);
        this.filteredTurnos = this.turnos;
        console.log(this.turnos);
      });
    }

  }

  // Método genérico para cambiar el estado de un turno
  cambiarEstadoTurno(turno: any, nuevoEstado: string) {
    this.turnoSeleccionado = turno;
    this.estadoEnProceso = nuevoEstado;
    
    // Ajusta el mensaje para el modal según el estado
    switch (nuevoEstado) {
      case 'cancelar':
        this.mensajeModal = 'Escriba el motivo de la cancelación:';
        break;
      case 'rechazar':
        this.mensajeModal = 'Escriba el motivo del rechazo:';
        break;
      case 'aceptar':
        this.mensajeModal = '¿Está seguro que desea aceptar el turno?';
        break;
        case 'finalizar':
        this.mensajeModal = '¿Está seguro que desea finalizar el turno?';
        break;
    }

    // Restablecer el comentario cada vez que se abra el modal
    this.comentarioCancelacion = '';
  }
  
  
  cancelarAccion() {
    this.turnoSeleccionado = null; // Cancelar la acción sin guardar
    this.comentarioCancelacion = ''; // Limpiar el comentario
  }
  //----------

  filtrarTurnos() {
    const term = this.searchTerm.toLowerCase();
    this.filteredTurnos = this.turnos.filter(turno => {
      const matchesEspecialidad = turno.especialidad.toLowerCase().includes(term);
      const pacienteNombreCompleto = `${turno.paciente.nombre} ${turno.paciente.apellido}`.toLowerCase();
      const matchesPaciente = pacienteNombreCompleto.includes(term);
      return matchesEspecialidad || matchesPaciente;
    });
  }
  
  mostrarResena(turno: any) {
    // Si ya se está mostrando una reseña, la ocultamos
    if (this.turnoSeleccionado === turno) {
      this.turnoSeleccionado = null;
    } else {
      this.turnoEnCancelacion = null;
      this.turnoSeleccionado = turno; // Guardamos el turno seleccionado
    }
  }
  
  enviarResenia(turno: any){
    turno.resenia = this.resenia;
    this.db.modificarUsuario(turno,'turnos');
    console.log('Reseña' ,turno);
  }
  
  confirmarCambioEstado() {
    if (this.turnoSeleccionado) {
      switch (this.estadoEnProceso) {
        case 'cancelar':
          this.turnoSeleccionado.estado = 'cancelado';
          this.turnoSeleccionado.comentario = this.comentarioCancelacion;
          
          if (this.especilaista) {
            const disponibilidadIndex = this.especilaista.disponibilidad.findIndex((disp: any) =>
              disp.dia === this.turnoSeleccionado.fechaHora.dia &&
              disp.mes === this.turnoSeleccionado.fechaHora.mes &&
              disp.anio === this.turnoSeleccionado.fechaHora.anio &&
              disp.horaInicio === this.turnoSeleccionado.fechaHora.horaInicio
              // && !disp.reservado
            );
            if (disponibilidadIndex !== -1) {
              console.log("Horario disponible en el índice:", disponibilidadIndex);
              this.especilaista.disponibilidad[disponibilidadIndex].reservado = true;
              console.log('Especialista  ->: ',this.especilaista);
            } else {
              console.log("Horario no disponible o ya reservado");
            }
          }

          this.db.modificarUsuario(this.especilaista,'especialistas'); // Se deberia actulaizar?

          break;
        case 'rechazar':
          this.turnoSeleccionado.estado = 'rechazado';
          this.turnoSeleccionado.comentario = this.comentarioCancelacion;
          break;
        case 'finalizar':
          this.turnoSeleccionado.estado = 'finalizado';
          break;
        case 'aceptar':
          this.turnoSeleccionado.estado = 'aceptado';
          break;
            // Agrega más casos según los estados que necesites manejar
          }
          
      // Guarda el cambio en la base de datos
      
      this.db.modificarUsuario(this.turnoSeleccionado, 'turnos');
      console.log(this.turnoSeleccionado);
      console.log(this.especilaista);
      
      // Resetear el turno y estado en proceso
      this.turnoSeleccionado = null;
      this.estadoEnProceso = '';
    }
  }
  
  
}
