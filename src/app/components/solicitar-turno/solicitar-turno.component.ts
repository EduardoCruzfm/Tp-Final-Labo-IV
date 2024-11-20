import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Turno } from '../../classes/turno';
import { Router } from '@angular/router';
import { DatabaseService } from '../../services/database.service';
import { UsuarioService } from '../../services/usuario.service';
import { NavbarComponent } from '../navbar/navbar.component';
import { trigger, transition, style, animate } from '@angular/animations';
import { DynamicBorderDirective } from '../../directives/dynamic-border.directive';


@Component({
  selector: 'app-solicitar-turno',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule,NavbarComponent,DynamicBorderDirective],
  templateUrl: './solicitar-turno.component.html',
  styleUrl: './solicitar-turno.component.css',
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
export class SolicitarTurnoComponent {

  turnoForm = new FormGroup({
    especialidad: new FormControl('', [Validators.required]),
    especialista: new FormControl('', [Validators.required]),
    fechaHora: new FormControl('', [Validators.required]),
    paciente: new FormControl() 
  });
  
  horariosDisponibles: any[] = [];
  pacientes: any[] = [];
  esAdmin: boolean = false;
  especialistaSeleccionado: any;
  especialidadSeleccionada: string | any = '';
  tipoUsuario: any;  
  
  especialistasDisponiblesFiltro: any[] = [];
  especialistasDisponibles: any[] = [];
  
  nombreEspecialista : any;
  dniPaciente : number = 0;
  horarioSeleccionado: any;
  datosTurno : any;
  fechasDisponibles: any[] = [];
  horariosParaFechaSeleccionada: string[] = [];
  fechaSeleccionada: any;
  horaSeleccionada: string | null = null;
  fechaHora: any;
  setParaForm: any;
  disponibilidadIndexAnterior: any;
  mostrarLogin: boolean = true; 


  constructor( private db: DatabaseService,private router: Router,private usuarioService: UsuarioService) {
    
     this.datosTurno = this.usuarioService.getTurno();
     this.tipoUsuario = this.usuarioService.getUsuarioPerfil();
     this.especialistaSeleccionado = this.usuarioService.getEspecialista();
  }

  ngOnInit(): void {

      if (this.tipoUsuario) {
         if (this.tipoUsuario == "administradores") {
           this.esAdmin = true;
           this.cargarPacientes();
         }
         else if(this.tipoUsuario == "pacientes"){
          const paciente = this.usuarioService.getUsuario();
           this.turnoForm.get('paciente')?.setValue(paciente); 
          }
          console.log("Es administrador: ",this.esAdmin);
        }else{
          console.log("ERROR Usuario no valido: ",this.tipoUsuario);
        }     
        
        if (this.datosTurno) {
          const nombre = `${this.especialistaSeleccionado.nombre} ${this.especialistaSeleccionado.apellido}`;
          this.turnoForm.get('especialidad')?.setValue(this.tipoUsuario);
          this.turnoForm.get('especialista')?.setValue(nombre);

          this.nombreEspecialista = {
            nombre: this.especialistaSeleccionado.nombre,
            apellido: this.especialistaSeleccionado.apellido
          };
          // Setear los valores iniciales en el formulario
          this.turnoForm.patchValue({
            especialidad: this.datosTurno.especialidad,
            especialista: nombre
          });
        }

        this.onEspecialistaChange();
        this.cargarFechasDisponibles();
  }


  cargarPacientes() {
    this.db.traerUsuario('pacientes').subscribe((response) => {
      this.pacientes = response;
    });
  }
  
  onEspecialistaChange() {    
    if (this.especialistaSeleccionado) {
      this.especialistaSeleccionado.disponibilidad.forEach((horario : any) => {
        if (horario.reservado) {                                                  //Disponibilidad en true
          this.horariosDisponibles.push(horario);
        }
      });
    }
    console.log("Horarios disponibles", this.horariosDisponibles);
  }
  

  cargarFechasDisponibles() {
    if ( this.horariosDisponibles) {
      const fechasUnicas = new Set();

      this.fechasDisponibles =  this.horariosDisponibles.map((turno: any) => {
        const mesNumerico = this.convertirMesANumero(turno.mes);
        const diaConFormato = turno.diaNumero.toString().padStart(2, '0');
        // return `${diaConFormato}/${mesNumerico}`;
        return {
                 diaConFormato: diaConFormato,
                 mesNumerico: mesNumerico, 
                 diaCadena : turno.diaCadena, 
                 mesCadena: turno.mes,
                 anio: turno.anio,
              };
      })
      .filter((fecha) => {

        const fechaClave = `${fecha.diaConFormato}/${fecha.mesNumerico}`;
        if (fechasUnicas.has(fechaClave)) {
          return false; // Ya existe, descartar.
        } else {
          fechasUnicas.add(fechaClave); // Agregar al Set.
          return true; // No existe, mantener.
        }
      })
    }
    console.log("Fechas disponibles: ", this.fechasDisponibles);
  }

  // Mapeo de los nombres de los meses a su formato numérico
   convertirMesANumero(mes: string): string {
    const mesesMap: { [key: string]: string } = {
      'Enero': '01',
      'Febrero': '02',
      'Marzo': '03',
      'Abril': '04',
      'Mayo': '05',
      'Junio': '06',
      'Julio': '07',
      'Agosto': '08',
      'Septiembre': '09',
      'Octubre': '10',
      'Noviembre': '11',
      'Diciembre': '12'
    };
    return mesesMap[mes] || '00'; // Devuelve '00' si el mes no es válido
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
  
  
  // Método para seleccionar la hora
  seleccionarHora(hora: any): void {

    if (hora) {
      this.fechaHora = {
        diaConFormato: this.fechaSeleccionada.diaConFormato,
        mesNumerico: this.fechaSeleccionada.mesNumerico,
        diaCadena: this.fechaSeleccionada.diaCadena,
        mesCadena: this.fechaSeleccionada.mesCadena,
        horaInicio : hora.horaInicio,
        horaFin : hora.horaFin,
        anio: this.fechaSeleccionada.anio
      };
    }
    this.horaSeleccionada = hora; 

    this.setParaForm = '';
    this.setParaForm = `${this.fechaHora.diaCadena} ${this.fechaHora.diaConFormato} ${this.fechaHora.mesCadena} ${this,this.fechaHora.horaInicio}`;

    this.turnoForm.get('fechaHora')?.setValue(this.setParaForm);

    
    // Modifica la disponibilidad del especialista
    const disponibilidadIndex = this.especialistaSeleccionado.disponibilidad.findIndex((disp: any) =>
      disp.diaNumero.toString().padStart(2, '0')  === this.fechaHora.diaConFormato.padStart(2, '0')  && 
      disp.mes === this.fechaHora.mesCadena &&
      disp.anio === this.fechaHora.anio &&
      this.convertirHora24(this.fechaHora.horaInicio) === disp.horaInicio
    );
    console.log("reservado", disponibilidadIndex);

    if (this.disponibilidadIndexAnterior) {
      this.especialistaSeleccionado.disponibilidad[this.disponibilidadIndexAnterior].reservado = true; // Cambiar según sea necesario
      console.log("SETEO A TRUE");
    }


    if (disponibilidadIndex !== -1) {
      this.disponibilidadIndexAnterior = disponibilidadIndex;
      console.log("Horario disponible en el índice:", disponibilidadIndex);
      this.especialistaSeleccionado.disponibilidad[disponibilidadIndex].reservado = false; // Cambiar según sea necesario
      console.log("Esp-->>>  ",this.especialistaSeleccionado);
    } else {
      console.log("Horario no disponible o ya reservado");
    }
  }
  
  // Método para seleccionar una fecha y mostrar los horarios disponibles
  seleccionarFecha(fecha: any): void {
    this.fechaSeleccionada = fecha;
    
    if (fecha) {
      this.fechaSeleccionada = {
        diaConFormato: fecha.diaConFormato,
        mesNumerico: fecha.mesNumerico,
        diaCadena: fecha.diaCadena,
        mesCadena: fecha.mesCadena,
        anio: fecha.anio
      };
    }  
     const dia = fecha.diaConFormato;
     const mes = fecha.mesNumerico
     console.log("Dia -->>",dia)
     console.log("mes->> ",mes)

    // Busca los horarios que coincidan con la fecha seleccionada
    this.horariosDisponibles = this.especialistaSeleccionado.disponibilidad
      .filter((turno: any) => {
        const mesNumerico = this.convertirMesANumero(turno.mes); // Convierte el mes del turno al formato numérico
        const diaConFormato = turno.diaNumero.toString().padStart(2, '0'); // Formatea el día a dos dígitos
        return diaConFormato === dia && mesNumerico === mes && turno.reservado === true;
      })
      .map((turno: any) => ({
        horaInicio: this.formatearHora(turno.horaInicio),
        horaFin: this.formatearHora(turno.horaFin)
        
      }));

    console.log("Horarios disponibles para la fecha seleccionada:", this.horariosDisponibles);

  }

  // Método para formatear la hora a formato hh:mm am/pm
  formatearHora(hora: string): string {
    const [horas, minutos] = hora.split(':').map(Number);
    const amPm = horas >= 12 ? 'pm' : 'am';
    const horasFormateadas = horas % 12 || 12; // Convierte 0 a 12 para el formato de 12 horas
    return `${horasFormateadas}:${minutos.toString().padStart(2, '0')} ${amPm}`;
  }

  solicitarTurno() {
    if (this.turnoForm.valid) {
      // Asegúrate de que especialista y paciente sean de tipo objeto
      const { especialidad, paciente } = this.turnoForm.value;
  
      // Verifica que especialista y paciente sean objetos
      if (typeof especialidad === "string" && paciente) {
        const nombreEspecialista = this.nombreEspecialista;
        const nombrePaciente = paciente;
        const idEspecialista = this.especialistaSeleccionado.id;
  
        const turno: Turno = new Turno(
          "",
          idEspecialista,
          especialidad,
          nombreEspecialista,
          this.fechaHora, 
          nombrePaciente,
          'pendiente', 
          '',
          ''
        );
         this.db.agregarTurno(turno, 'turnos');

         this.db.modificarUsuario(this.especialistaSeleccionado,'especialistas')


        console.log('Datos del turno:', turno);
      } else {
        console.log('Especialista o paciente son nulos o no válidos');
      }
    } else {
      console.log('El formulario no es válido');
    }
  }
}
