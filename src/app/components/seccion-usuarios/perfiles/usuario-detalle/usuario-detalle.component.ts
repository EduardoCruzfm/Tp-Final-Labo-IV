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
  dia: any = '';
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
   diasEnMes: any;
    // Lista de todos los meses
   mesesDisponibles: number[] = Array.from({ length: 12 }, (_, i) => i + 1); 

   intervalosGenerados: string[] = [];
   fechaActual = new Date();
   mesActual = this.fechaActual.getMonth(); // Devuelve un número entre 0 y 11 (enero es 0)

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
  

  constructor(private db: DatabaseService,private usuarioService: UsuarioService) {
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

    // const fechaActual = new Date();
    // const mesActual = fechaActual.getMonth(); // Devuelve un número entre 0 y 11 (enero es 0)

    this.obtenerDatosIniciales(this.mesActual,this.anioActual);
  }

  obtenerDatosIniciales(mes:any, anio:any){
  
    console.log("Mes actual:", mes); // Ejemplo: 0 para enero, 1 para febrero, etc.
    console.log("Año actual:", anio); // Ejemplo: 2024

    if (typeof mes === 'string') {
      // Puedes llamar a tu función para obtener los días del mes actual
      const mesNumerico = this.convertirMesACadena(mes); 
      this.diasEnMes = this.generarDiasDelMes(mesNumerico, anio);
      console.log("Días del mes:", this.diasEnMes);
    }
    else{
      this.diasEnMes = this.generarDiasDelMes(mes, anio);
      console.log("Días del mes:", this.diasEnMes);
    }
  }

  obtenerDiasEnMes(mes: number, anio: number): number {
    // El mes se pasa como un índice de 0 a 11 (enero es 0, diciembre es 11)
    return new Date(anio, mes + 1, 0).getDate();
  }

  generarDiasDelMes(mes: number, anio: number): { diaNumero: number, diaNombre: string }[] {
    const diasEnMes = this.obtenerDiasEnMes(mes, anio);
    const dias: { diaNumero: number, diaNombre: string }[] = [];
  
    for (let dia = 1; dia <= diasEnMes; dia++) {
      const fecha = new Date(anio, mes, dia);
      const diaNombre = fecha.toLocaleDateString('es-ES', { weekday: 'long' }); // Nombre del día en español
      dias.push({ diaNumero: dia, diaNombre });
    }
  
    return dias;
  }

  // Método para convertir un mes en cadena a su valor numérico (0 para enero, 11 para diciembre)
  convertirMesACadena(mes: string): number {
    const mesesMapa: { [key: string]: number } = {
      "Enero": 0,
      "Febrero": 1,
      "Marzo": 2,
      "Abril": 3,
      "Mayo": 4,
      "Junio": 5,
      "Julio": 6,
      "Agosto": 7,
      "Septiembre": 8,
      "Octubre": 9,
      "Noviembre": 10,
      "Diciembre": 11
    };

    return mesesMapa[mes] !== undefined ? mesesMapa[mes] : -1; // Retorna -1 si el mes no es válido
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
          diaCadena: this.dia.diaNombre,
          diaNumero: this.dia.diaNumero,
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

  
    // const nuevaDisponibilidad: FechaHora = new FechaHora(this.dia,this.mes,this.anio, this.horaInicio, this.horaFin,true);
  // // agregarDisponibilidad() {


    // Actualizar las horas disponibles según el día seleccionado
    actualizarRangoHorario(): void {
      console.log("dia ->  ", this.dia.diaNombre)   
      console.log("dia ->  ", this.dia.diaNumero)   
      
      switch (this.dia.diaNombre ) {
        case 'lunes':
          this.horasDisponibles = this.generarHorasDisponibles(this.horarioClinica.lunes.apertura, this.horarioClinica.lunes.cierre);
          break;
          case 'martes':
          this.horasDisponibles = this.generarHorasDisponibles(this.horarioClinica.martes.apertura, this.horarioClinica.martes.cierre);
          break;
          case 'miércoles':
          this.horasDisponibles = this.generarHorasDisponibles(this.horarioClinica.miercoles.apertura, this.horarioClinica.miercoles.cierre);
          break;
          case 'jueves':
            this.horasDisponibles = this.generarHorasDisponibles(this.horarioClinica.jueves.apertura, this.horarioClinica.jueves.cierre);
            break;
            case 'viernes':
          this.horasDisponibles = this.generarHorasDisponibles(this.horarioClinica.viernes.apertura, this.horarioClinica.viernes.cierre);
          break;
          case 'domingo':
            this.horasDisponibles = [];
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