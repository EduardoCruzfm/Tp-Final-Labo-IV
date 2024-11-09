import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; 
import { FechaHora } from '../../../../classes/fecha-hora';
import { DatabaseService } from '../../../../services/database.service';
import { UsuarioService } from '../../../../services/usuario.service';
import { NavbarComponent } from '../../../navbar/navbar.component';


@Component({
  selector: 'app-usuario-detalle',
  standalone: true,
  imports: [CommonModule,FormsModule,NavbarComponent],
  templateUrl: './usuario-detalle.component.html',
  styleUrl: './usuario-detalle.component.css'
})
export class UsuarioDetalleComponent {
  usuario: any;
  dia: string = '';
  mes: string = '';
  anio: number = 0;

  // Rango de horarios predeterminados
  horaInicioMin: string = '08:00';
  horaInicioMax: string = '19:00';
  horaFinMin: string = '08:00';
  horaFinMax: string = '19:00';

  anioActual: number = new Date().getFullYear();
  anioSiguiente: number = new Date().getFullYear() + 1;
  
  horaInicio: string = '';
  horaFin: string = '';
  disponibilidad: any[] = [];
  tipoUsuarioPefil: string = '';

   // Listado de días permitidos y meses
   diasPermitidos: string[] = ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado"];
    // Lista de todos los meses
   mesesDisponibles: number[] = Array.from({ length: 12 }, (_, i) => i + 1); 

   intervalosGenerados: string[] = [];

  // Definir los rangos de horas de la clínica
  horarioClinica = {
    lunes: { apertura: 8, cierre: 19 }, // 08:00 a 19:00
    martes: { apertura: 8, cierre: 19 }, // 08:00 a 19:00
    miercoles: { apertura: 8, cierre: 19 }, // 08:00 a 19:00
    jueves: { apertura: 8, cierre: 19 }, // 08:00 a 19:00
    viernes: { apertura: 8, cierre: 19 }, // 08:00 a 19:00
    sabado: { apertura: 8, cierre: 14 } // 08:00 a 14:00
  };
  horasDisponibles: string[] = [];
  

  constructor(private router: Router, private db: DatabaseService,private usuarioService: UsuarioService) {
    this.usuario = this.usuarioService.getUsuario(); // Obtiene el usuario desde el servicio
    console.log("test", this.usuario);
    this.tipoUsuarioPefil = this.usuarioService.getUsuarioPerfil();
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

    // Método para generar horas con intervalos de 30 minutos
    generarHorasDisponibles(apertura: number, cierre: number): string[] {
      const horas = [];
      for (let h = apertura; h < cierre; h++) {
        for (let m = 0; m < 60; m += 30) {  // Intervalo de 30 minutos
          const hora = `${h < 10 ? '0' : ''}${h}:${m === 0 ? '00' : '30'}`;
          horas.push(hora);
        }
      }
      return horas;
    }

    // Método para generar los intervalos de 30 minutos entre la hora de inicio y fin
    generarIntervalos(horaInicio: string, horaFin: string): any[] {
      const intervalos: any[] = [];
      let [inicioHoras, inicioMinutos] = horaInicio.split(':').map(Number);
      let [finHoras, finMinutos] = horaFin.split(':').map(Number);
    
      while (inicioHoras < finHoras || (inicioHoras === finHoras && inicioMinutos < finMinutos)) {
        const horaActualInicio = `${inicioHoras.toString().padStart(2, '0')}:${inicioMinutos.toString().padStart(2, '0')}`;
        inicioMinutos += 30;
    
        if (inicioMinutos >= 60) {
          inicioMinutos -= 60;
          inicioHoras++;
        }
    
        const horaActualFin = `${inicioHoras.toString().padStart(2, '0')}:${inicioMinutos.toString().padStart(2, '0')}`;
    
        // Crear un objeto para cada intervalo padar clase FECHA

        intervalos.push({
          dia: this.dia,
          mes: this.mes,
          anio: this.anio,
          horaInicio: horaActualInicio,
          horaFin: horaActualFin,
          reservado: true
        });
      }
    
      return intervalos;
    }

    agregarDisponibilidad(): void {
      if (this.horaInicio && this.horaFin && this.dia) {
        const intervalos = this.generarIntervalos(this.horaInicio, this.horaFin);
        this.disponibilidad.push(...intervalos); // Agregar todos los intervalos al array de disponibilidad
        console.log('Disponibilidad generada:', this.disponibilidad);
        this.usuario.disponibilidad = this.disponibilidad; // Actualizar la disponibilidad del usuario
      } else {
        alert('Por favor, selecciona un día y un rango de horas válido.');
      }
    }

  
  // agregarDisponibilidad() {
  //   const nuevaDisponibilidad: FechaHora = new FechaHora(this.dia,this.mes,this.anio, this.horaInicio, this.horaFin,true);
  //   this.disponibilidad.push(nuevaDisponibilidad.GetFecha());
  // }

    // Actualizar las horas disponibles según el día seleccionado
    actualizarRangoHorario(): void {

      switch (this.dia ) {
        case 'Lunes':
          this.horasDisponibles = this.generarHorasDisponibles(this.horarioClinica.lunes.apertura, this.horarioClinica.lunes.cierre);
          break;
          case 'Martes':
          this.horasDisponibles = this.generarHorasDisponibles(this.horarioClinica.martes.apertura, this.horarioClinica.martes.cierre);
          break;
          case 'Miercoles':
          this.horasDisponibles = this.generarHorasDisponibles(this.horarioClinica.miercoles.apertura, this.horarioClinica.miercoles.cierre);
          break;
          case 'Jueves':
            this.horasDisponibles = this.generarHorasDisponibles(this.horarioClinica.jueves.apertura, this.horarioClinica.jueves.cierre);
            break;
            case 'Viernes':
          this.horasDisponibles = this.generarHorasDisponibles(this.horarioClinica.viernes.apertura, this.horarioClinica.viernes.cierre);
          break;
        case 'Sabado':
          this.horasDisponibles = this.generarHorasDisponibles(this.horarioClinica.sabado.apertura, this.horarioClinica.sabado.cierre);
          break;
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