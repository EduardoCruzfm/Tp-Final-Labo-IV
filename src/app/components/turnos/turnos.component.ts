import { CommonModule } from '@angular/common';
import { Component , OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DatabaseService } from '../../services/database.service';
import { ActivatedRoute } from '@angular/router';

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
    paciente: new FormControl('') // Solo requerido si el usuario es admin
  });

  especialidades: string[] = ['Cardiología', 'Pediatría', 'Odontología'];
  especialistasDisponibles: any[] = ['test'];
  horariosDisponibles: any[] = [];
  pacientes: any[] = [];
  esAdmin: boolean = false;
  especialistaSeleccionado: any;
  especialidadSeleccionada: string | any = '';
  tipoUsuario: string | null = null;
  
  especialistasDisponiblesTest: any[] = [""];

  constructor(private route: ActivatedRoute, private db: DatabaseService) {
    this.route.queryParams.subscribe(params => {
      this.tipoUsuario = params['tipo'];
    });

    if (this.tipoUsuario == "administradores") {
      this.esAdmin = true;
    }
    else if(this.tipoUsuario == "pacientes"){
      this.turnoForm.get('paciente')?.setValue('paciente------------objeto!!'); // obtener usuario
    }

    console.log(this.tipoUsuario);
    console.log(this.esAdmin);
  }

  ngOnInit(): void {
      this.db.traerUsuario('especialistas').subscribe((response) => {
        this.especialistasDisponiblesTest = response;
        this.carga(); // Llenar las especialidades después de cargar los especialistas.
      });

      this.cargarPacientes();
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
    if (this.esAdmin) {
      this.pacientes = [
        { nombre: 'Dr. Pérez', id: 1 },
        { nombre: 'Ana Gómez', id: 2 },
      ];
    }
  }


  onEspecialidadChange() {
    this.especialistasDisponibles = [];
    this.especialidadSeleccionada = this.turnoForm.get('especialidad')?.value;
    
    // Filtrar especialistas según la especialidad seleccionada
    this.especialistasDisponibles = this.especialistasDisponiblesTest.filter(esp => 
      Array.isArray(esp.especialidad) && esp.especialidad.includes(this.especialidadSeleccionada)
    );
    console.log("aaaaaaaa  ", this.especialistasDisponibles);
  
    // Reiniciar horarios disponibles
    this.horariosDisponibles = []; // Esto es necesario para que el selector de horarios se vacíe al cambiar la especialidad
  
    // Reiniciar el control del especialista para que se actualice la vista
    this.turnoForm.get('especialista')?.setValue(''); // Resetea el especialista seleccionado
  
    console.log('Especialistas disponibles:', this.especialistasDisponibles);
  }
  
  
  

  onEspecialistaChange() {
    this.especialistaSeleccionado = this.turnoForm.get('especialista')?.value;
  
    if (this.especialistaSeleccionado) {
      this.horariosDisponibles = this.especialistaSeleccionado.disponibilidad;
    }
    console.log(this.horariosDisponibles);
  }
  

  generarDisponibilidad() {
    return [
      { fecha: '2024-10-27', hora: '10:00 AM' },
      { fecha: '2024-10-28', hora: '11:30 AM' },
      { fecha: '2024-10-29', hora: '02:00 PM' },
    ];
  }

  solicitarTurno() {
    if (this.turnoForm.valid) {
      const turnoData = this.turnoForm.value;
      console.log('Datos del turno:', turnoData);
    } else {
      console.log('El formulario no es válido');
    }
  }
}