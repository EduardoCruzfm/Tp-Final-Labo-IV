import { Component } from '@angular/core';
import { DatabaseService } from '../../services/database.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-mis-turnos',
  standalone: true,
  imports: [CommonModule,FormsModule ],
  templateUrl: './mis-turnos.component.html',
  styleUrl: './mis-turnos.component.css'
})
export class MisTurnosComponent {
  turnos: any[] = [];
  filteredTurnos: any[] = [];
  searchTerm: string = '';

  turnoEnCancelacion: any | null = null; // Turno que está siendo cancelado
  comentarioCancelacion: string = ''; // Comentario de cancelación
  turnoSeleccionado: any = null; // Para almacenar el turno actual que tiene la reseña
  calificacion: number = 0; // o el tipo adecuado que estés usando
  comentario: string = ""; // o el tipo adecuado

  constructor( private db: DatabaseService,) {
      this.cargarTurnos();
  }

  cargarTurnos() {
    this.db.traerUsuario('turnos').subscribe((response) => {
      this.turnos = response;
      this.filteredTurnos = response;
      console.log(this.turnos);
    });
  }

  // -----
  cancelarTurno(turno: any) {
    this.turnoEnCancelacion = turno;
    this.comentarioCancelacion = ''; // Resetear el comentario al abrir el modal
    this.turnoSeleccionado = null; // para que desaparesca
  }

  confirmarCancelacion() {
    if (this.turnoEnCancelacion) {
      this.turnoEnCancelacion.estado = 'cancelado';  // Marcar el turno como cancelado
      this.turnoEnCancelacion.comentario = this.comentarioCancelacion; // Guardar el comentario
      this.db.modificarUsuario(this.turnoEnCancelacion,'turnos');
      console.log(this.turnoEnCancelacion);

      //ACA DEBERIA MODIFICAR LA DISPONIBILIDAD DEL ESPECIALISTA      modificar el turno del del especialista con un estado

      this.turnoEnCancelacion = null; // Resetear el turno en proceso de cancelación
    }

  }

  cancelarAccion() {
    this.turnoEnCancelacion = null; // Cancelar la acción sin guardar
    this.comentarioCancelacion = ''; // Limpiar el comentario
  }
  //----------

  filtrarTurnos() {
    const term = this.searchTerm.toLowerCase();
    this.filteredTurnos = this.turnos.filter(turno => {
      const matchesEspecialidad = turno.especialidad.toLowerCase().includes(term);
      const especialistaNombreCompleto = `${turno.especialista.nombre} ${turno.especialista.apellido}`.toLowerCase();
      const matchesEspecialista = especialistaNombreCompleto.includes(term);
      return matchesEspecialidad || matchesEspecialista;
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

  // En tu componente MisTurnosComponent
  isComentarioVacio(comentario: any): boolean {
    return comentario && Object.keys(comentario).length === 0;
  }


  enviarEncuesta(turno: any) {
    // turno.comentario = `Encuesta: ${this.calificacion} - Comentario: ${this.comentario}`
    turno.comentario = { encuesta: this.calificacion, comentario: this.comentario};
    this.db.modificarUsuario(turno,'turnos');
    console.log('encuesta' ,turno);
}



  //Para especialista
  marcarComoRealizado(turno: any) {
    turno.estado = 'realizado';
  }
  
}
