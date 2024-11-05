import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; 
import { FechaHora } from '../../../../classes/fecha-hora';
import { DatabaseService } from '../../../../services/database.service';


@Component({
  selector: 'app-usuario-detalle',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './usuario-detalle.component.html',
  styleUrl: './usuario-detalle.component.css'
})
export class UsuarioDetalleComponent {
  usuario: any;
  dia: string = '';
  mes: string = '';
  anio: number = 0;
  horaInicio: string = '';
  horaFin: string = '';
  disponibilidad: any[] = [];

  anioActual: number = new Date().getFullYear();
  anioSiguiente: number = new Date().getFullYear() + 1;
  

   // Listado de días permitidos y meses
   diasPermitidos: string[] = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sabado"];

    // Lista de todos los meses
   mesesDisponibles: number[] = Array.from({ length: 12 }, (_, i) => i + 1); 

   // Rango de horarios predeterminados
   horaInicioMin: string = '08:00';
   horaInicioMax: string = '19:00';
   horaFinMin: string = '08:00';
   horaFinMax: string = '19:00';

  constructor(private router: Router, private db: DatabaseService) {
    // Obtengo el usuario
    const navigation = this.router.getCurrentNavigation();
    this.usuario = navigation?.extras.state?.["usuario"];
  }

  ngOnInit(): void {
    if (this.usuario) {
      console.log('Datos del usuario:', this.usuario);
      if ( this.usuario.perfil === 'especialista' && this.usuario.disponibilidad) {
        this.disponibilidad = this.usuario.disponibilidad; // Cargar la disponibilidad inicial
      }
    } else {
      console.error('No se han recibido datos del usuario.');
    }
  }
  
  agregarDisponibilidad() {
    const nuevaDisponibilidad: FechaHora = new FechaHora(this.dia,this.mes,this.anio, this.horaInicio, this.horaFin,true);
    this.disponibilidad.push(nuevaDisponibilidad.GetFecha());
    this.usuario.disponibilidad = this.disponibilidad; // Actualizar la disponibilidad del usuario
  }

  actualizarRangoHorario() {
    // Ajustar el rango horario según el día seleccionado
    if (this.dia === 'Sábado') {
      this.horaInicioMin = '08:00';
      this.horaInicioMax = '14:00';
      this.horaFinMin = '08:00';
      this.horaFinMax = '14:00';
    } else {
      this.horaInicioMin = '08:00';
      this.horaInicioMax = '19:00';
      this.horaFinMin = '08:00';
      this.horaFinMax = '19:00';
    }
  }

  obtenerNombreMes(mes: number): string {
    const meses = [
      "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];
    // this.mes = meses[mes - 1];
    return meses[mes - 1];
  }
  

  guardarCambios() {
    this.actualizarEspecialista(this.usuario)
    console.log('Disponibilidad guardada:', this.disponibilidad);
  }

  actualizarEspecialista(especialista: any) {
    console.log(especialista);
    this.db.modificarUsuario(especialista, 'especialistas'); 
  }
  
}