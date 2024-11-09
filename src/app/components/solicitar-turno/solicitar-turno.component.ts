import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Turno } from '../../classes/turno';
import { Router } from '@angular/router';
import { DatabaseService } from '../../services/database.service';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-solicitar-turno',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './solicitar-turno.component.html',
  styleUrl: './solicitar-turno.component.css'
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
           this.turnoForm.get('paciente')?.setValue(paciente); // cargar alpaciente
          }
          console.log("Es administrador: ",this.esAdmin);
        }else{
          console.log("ERROR Usuario no valido: ",this.tipoUsuario);
        }     
        
        if (this.datosTurno) {
          const nombre = `${this.especialistaSeleccionado.nombre} ${this.especialistaSeleccionado.apellido}`;
          this.turnoForm.get('especialidad')?.setValue(this.tipoUsuario);
          this.turnoForm.get('especialista')?.setValue(nombre);

          this.nombreEspecialista = nombre;
          // Setear los valores iniciales en el formulario
          this.turnoForm.patchValue({
            especialidad: this.datosTurno.especialidad,
            especialista: nombre
          });
        }

        this.onEspecialistaChange();
        // console.log("GET -> ", this.especialistaSeleccionado)
  }

  onEspecialidadChange() {
    this.especialidadSeleccionada = this.turnoForm.get('especialidad')?.value;
    
    // Filtrar especialistas según la especialidad seleccionada
    this.especialistasDisponibles = this.especialistasDisponiblesFiltro.filter(esp => 
      Array.isArray(esp.especialidad) && esp.especialidad.includes(this.especialidadSeleccionada)
    );
  
    // Reiniciar horarios disponibles
    this.horariosDisponibles = []; // Esto es necesario para que el selector de horarios se vacíe al cambiar la especialidad
  
    // Reiniciar el control del especialista para que se actualice la vista
    this.turnoForm.get('especialista')?.setValue(''); // Resetea el especialista seleccionado
  
    console.log('Especialistas disponibles:', this.especialistasDisponibles);
  }
  


  cargarPacientes() {
    this.db.traerUsuario('pacientes').subscribe((response) => {
      this.pacientes = response;
    });
  }
  
  
  onEspecialistaChange() {    
  
    if (this.especialistaSeleccionado) {

      this.especialistaSeleccionado.disponibilidad.forEach((horario : any) => {
        if (horario.reservado) {
          this.horariosDisponibles.push(horario);
        }
      });
    }
    console.log(this.horariosDisponibles);
  }
  


  onHorarioSeleccionado(event: Event) {
    // Accede directamente al valor del FormControl
    const selectedValue = this.turnoForm.get('fechaHora')?.value; // Aquí obtienes el objeto seleccionado
  
    if (selectedValue) {
      this.horarioSeleccionado = selectedValue;
  
      const disponibilidadIndex = this.especialistaSeleccionado.disponibilidad.findIndex((disp: any) =>
        disp.dia === this.horarioSeleccionado.dia &&
        disp.mes === this.horarioSeleccionado.mes &&
        disp.anio === this.horarioSeleccionado.anio &&
        disp.horaInicio === this.horarioSeleccionado.horaInicio
        // && !disp.reservado
      );
      console.log("------>:", disponibilidadIndex);
  
      if (disponibilidadIndex !== -1) {
        console.log("Horario disponible en el índice:", disponibilidadIndex);
        this.especialistaSeleccionado.disponibilidad[disponibilidadIndex].reservado = false;
        console.log(this.especialistaSeleccionado);
      } else {
        console.log("Horario no disponible o ya reservado");
      }
    }
  }
  
  
  
  

  solicitarTurno() {
    if (this.turnoForm.valid) {
      // Asegúrate de que especialista y paciente sean de tipo objeto
      const { especialidad,fechaHora, paciente } = this.turnoForm.value;

      //
  
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
          fechaHora, 
          nombrePaciente,
          'pendiente', // Seria pendiente 
          '',
          ''
        );
        //  this.db.agregarTurno(turno, 'turnos');

        //  this.db.modificarUsuario(this.especialistaSeleccionado,'especialistas')


        console.log('Datos del turno:', turno);
      } else {
        console.log('Especialista o paciente son nulos o no válidos');
      }
    } else {
      console.log('El formulario no es válido');
    }
  }
}
