import { Component } from '@angular/core';
import { DatabaseService } from '../../services/database.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-mis-turnos-especialista',
  standalone: true,
  imports: [FormsModule,CommonModule],
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

  constructor( private db: DatabaseService,private auth: AuthService) {
      this.cargarTurnos();
  }

  cargarTurnos() {
    const currentUser = this.auth.getCurrentUser();
    
    if (currentUser) {
      
      this.db.traerUsuario('turnos').subscribe((response) => {
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
      
      // Resetear el turno y estado en proceso
      this.turnoSeleccionado = null;
      this.estadoEnProceso = '';
    }
    //ACA DEBERIA MODIFICAR LA DISPONIBILIDAD DEL ESPECIALISTA      modificar el turno del del especialista con un estado
  }
  
  
}
