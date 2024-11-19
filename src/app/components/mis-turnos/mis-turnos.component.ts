import { Component } from '@angular/core';
import { DatabaseService } from '../../services/database.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { UsuarioService } from '../../services/usuario.service';
import { NavbarComponent } from '../navbar/navbar.component';
import { trigger, transition, style, animate } from '@angular/animations';
import { CapitalizarPipe } from '../../pipes/capitalizar.pipe';
import { TraducirEstadoPipe } from '../../pipes/traducir-estado.pipe';
import { FormatoHoraPipe } from '../../pipes/formato-hora.pipe';




@Component({
  selector: 'app-mis-turnos',
  standalone: true,
  imports: [CommonModule,FormsModule,NavbarComponent,CapitalizarPipe,TraducirEstadoPipe,FormatoHoraPipe],
  templateUrl: './mis-turnos.component.html',
  styleUrl: './mis-turnos.component.css',
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

export class MisTurnosComponent {
  turnos: any[] = [];
  filteredTurnos: any[] = [];
  searchTerm: string = '';

  turnoEnCancelacion: any | null = null; // Turno que está siendo cancelado
  comentarioCancelacion: string = ''; // Comentario de cancelación
  turnoSeleccionado: any = null; // Para almacenar el turno actual que tiene la reseña
  calificacion: number = 0; // o el tipo adecuado que estés usando
  comentario: string = ""; // o el tipo adecuado
  tipoUsuarioPefil:string = '';
  especialistaModificado: any;
  mostrarLogin: boolean = true; 


  constructor( private db: DatabaseService,private auth: AuthService,private usuarioService: UsuarioService) {
      this.cargarTurnos();
      this.tipoUsuarioPefil = this.usuarioService.getUsuarioPerfil();
  }

  cargarTurnos() {
    const currentUser = this.auth.getCurrentUser();
    
    if (currentUser) {
      
      this.db.traerUsuario('turnos').subscribe((response) => {
        // Filtra los turnos que coinciden con el especialista
        this.turnos = response.filter((turno:any) => turno.paciente.id === currentUser.uid);
        this.filteredTurnos = this.turnos;
        console.log(this.turnos);
      });
    }
  }

  // -----
  cancelarTurno(turno: any) {
    this.turnoEnCancelacion = turno;
    this.comentarioCancelacion = ''; // Resetear el comentario al abrir el modal
    this.turnoSeleccionado = null; // para que desaparesca
  }

  convertirHora24(hora12: string): string {
    const [hora, minutoAmPm] = hora12.split(':');
    const [minutos, amPm] = minutoAmPm.split(' ');
    let horas = parseInt(hora, 10);
  
    if (amPm.toLowerCase() === 'pm' && horas < 12) {
      horas += 12;
    } else if (amPm.toLowerCase() === 'am' && horas === 12) {
      horas = 0;
    }
  
    return `${horas.toString().padStart(2, '0')}:${minutos}`;
  }

  async confirmarCancelacion() {
    if (this.turnoEnCancelacion) {
      this.turnoEnCancelacion.estado = 'cancelado';  // Marcar el turno como cancelado
      this.turnoEnCancelacion.comentario = this.comentarioCancelacion; // Guardar el comentario
      this.db.modificarUsuario(this.turnoEnCancelacion, 'turnos');
      console.log(this.turnoEnCancelacion);
  
      // Esperar a que la promesa de `obtenerUsuarioPorId` se resuelva
      this.especialistaModificado = await this.db.obtenerUsuarioPorId(this.turnoEnCancelacion.idEspecialista, "especialistas");
      console.log(this.especialistaModificado);
  
      // Modificar la disponibilidad del especialista
      const disponibilidadIndex = this.especialistaModificado.disponibilidad.findIndex((disp: any) =>
        disp.diaNumero.toString().padStart(2, '0') === this.turnoEnCancelacion.fechaHora.diaConFormato.padStart(2, '0') &&
        disp.mes === this.turnoEnCancelacion.fechaHora.mesCadena &&
        disp.anio === this.turnoEnCancelacion.fechaHora.anio &&
        this.convertirHora24(this.turnoEnCancelacion.fechaHora.horaInicio) === disp.horaInicio
      );
  
      console.log("reservado", disponibilidadIndex);
  
      if (disponibilidadIndex !== -1) {
        console.log("Horario disponible en el índice:", disponibilidadIndex);
        this.especialistaModificado.disponibilidad[disponibilidadIndex].reservado = true; // Cambiar según sea necesario
        this.db.modificarUsuario(this.especialistaModificado,"especialistas")
        console.log("Esp-->>>  ", this.especialistaModificado);
      } else {
        console.log("Horario no disponible o ya reservado");
      }
  
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
      const matchefecha = turno.fechaHora.diaCadena.toLowerCase().includes(term);
      const matcheMes = turno.fechaHora.mesCadena.toLowerCase().includes(term);
      const matchehoraInicio = turno.fechaHora.horaInicio.toLowerCase().includes(term);
      const matcheResAltura = turno.resenia?.altura?.toString().toLowerCase().includes(term);
      const matcheResPeso = turno.resenia?.peso?.toString().toLowerCase().includes(term);
      const matcheResTemperatura = turno.resenia?.temperatura?.toString().toLowerCase().includes(term);
      const matcheResPresion = turno.resenia?.presion?.toLowerCase().includes(term);

      let matchesDatosDinamicos = false;
      if (turno.resenia?.datosDinamicos) {
        matchesDatosDinamicos = turno.resenia.datosDinamicos.some((dato: any) => {
          const claveMatch = dato.clave?.toLowerCase().includes(term);
          const valorMatch = dato.valor?.toString().toLowerCase().includes(term);
          return claveMatch || valorMatch;
        });
      }

      return matchesEspecialidad || matchesEspecialista || matchefecha || matcheMes || matchehoraInicio
            || matcheResAltura || matcheResPeso || matcheResTemperatura || matcheResPresion || matchesDatosDinamicos;
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


// tarefo7577@opposir.com -> daniel martinez
// tarefo7577@opposir.com-> daniel martinez