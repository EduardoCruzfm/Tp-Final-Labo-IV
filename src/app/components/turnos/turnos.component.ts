import { CommonModule } from '@angular/common';
import { Component , OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DatabaseService } from '../../services/database.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Turno } from '../../classes/turno';


@Component({
  selector: 'app-turnos',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './turnos.component.html',
  styleUrl: './turnos.component.css'
})
export class TurnosComponent {  
  
  turnoForm = new FormGroup({
    especialidad: new FormControl('', [Validators.required]),
    especialista: new FormControl('', [Validators.required]),
    fechaHora: new FormControl('', [Validators.required]),
    paciente: new FormControl() // Solo requerido si el usuario es admin
  });

  

  especialidades: string[] = [];
  especialistasDisponibles: any[] = [];
  horariosDisponibles: any[] = [];
  pacientes: any[] = [];
  esAdmin: boolean = false;
  especialistaSeleccionado: any;
  especialidadSeleccionada: string | any = '';
  tipoUsuario: any;  
  
  especialistasDisponiblesTest: any[] = [""];
  nombreEspecialista : any;
  dniPaciente : number = 0;
  horarioSeleccionado: any;

  constructor( private db: DatabaseService,private router: Router, ) {
    
    const navigation = this.router.getCurrentNavigation();
     this.tipoUsuario = navigation?.extras.state?.['usuario'];
     console.log("-->",this.tipoUsuario)
  }

  ngOnInit(): void {
      this.cargarEspecialistas();

      if (this.tipoUsuario) {
         if (this.tipoUsuario.perfil == "administrador") {
           this.esAdmin = true;
           this.cargarPacientes();
         }
         else if(this.tipoUsuario.perfil  == "paciente"){
           this.turnoForm.get('paciente')?.setValue(this.tipoUsuario);
          //  this.turnoForm.get('paciente')?.setValue({nombre: this.tipoUsuario.nombre, apellido: this.tipoUsuario.apellido});
          }
          console.log("Es administrador: ",this.esAdmin);
        }else{
          console.log("ERROR Usuario no valido: ",this.tipoUsuario);
        }     
  }

  carga() {
    this.especialidades = [];
    this.especialistasDisponiblesTest.forEach((especialista) => {
      if (Array.isArray(especialista.especialidad)) {
        especialista.especialidad.forEach((esp: any) => {
          if (!this.especialidades.includes(esp)) {
            this.especialidades.push(esp);
          }
        });
      }
    });

    console.log('Especialidades cargadas:', this.especialidades);
  }

  

  cargarPacientes() {
    this.db.traerUsuario('pacientes').subscribe((response) => {
      this.pacientes = response;
    });
  }
  
  cargarEspecialistas() {
    this.db.traerUsuario('especialistas').subscribe((response) => {
      this.especialistasDisponiblesTest = response;

      this.carga(); // Llenar las especialidades después de cargar los especialistas.
    });
  }

  onEspecialidadChange() {
    this.especialidadSeleccionada = this.turnoForm.get('especialidad')?.value;
    
    // Filtrar especialistas según la especialidad seleccionada
    this.especialistasDisponibles = this.especialistasDisponiblesTest.filter(esp => 
      Array.isArray(esp.especialidad) && esp.especialidad.includes(this.especialidadSeleccionada)
    );
  
    // Reiniciar horarios disponibles
    this.horariosDisponibles = []; // Esto es necesario para que el selector de horarios se vacíe al cambiar la especialidad
  
    // Reiniciar el control del especialista para que se actualice la vista
    this.turnoForm.get('especialista')?.setValue(''); // Resetea el especialista seleccionado
  
    console.log('Especialistas disponibles:', this.especialistasDisponibles);
  }
  
  
  

  onEspecialistaChange() {
    this.especialistaSeleccionado = this.turnoForm.get('especialista')?.value;
  
    if (this.especialistaSeleccionado) {
      // this.horariosDisponibles = this.especialistaSeleccionado.disponibilidad;

      this.especialistaSeleccionado.disponibilidad.forEach((horario : any) => {
        if (horario.reservado) {
          this.horariosDisponibles.push(horario);
        }
      });

      this.nombreEspecialista = ({nombre: this.especialistaSeleccionado.nombre, apellido: this.especialistaSeleccionado.apellido})
    }
    console.log(this.horariosDisponibles);
  }
  
  onNombrePacienteaChange(event: any) {
    // Se obtiene el valor seleccionado del evento.
    // const paciente = event.target.value;
    // this.pacientes = paciente.dni;

    // console.log(paciente)
  
    // // Se verifica que el valor seleccionado sea un objeto válido.
    // if (paciente && paciente.nombre && paciente.apellido) {
    //   this.turnoForm.get('paciente')?.setValue({nombre: paciente.nombre,apellido: paciente.apellido});
    // }
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
      const { especialidad, fechaHora, paciente } = this.turnoForm.value;

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