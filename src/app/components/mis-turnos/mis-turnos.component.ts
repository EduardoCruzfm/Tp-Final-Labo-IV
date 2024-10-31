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

  filtrarTurnos() {
    const term = this.searchTerm.toLowerCase();
    this.filteredTurnos = this.turnos.filter(turno => {
      const matchesEspecialidad = turno.especialidad.toLowerCase().includes(term);
      const especialistaNombreCompleto = `${turno.especialista.nombre} ${turno.especialista.apellido}`.toLowerCase();
      const matchesEspecialista = especialistaNombreCompleto.includes(term);
      return matchesEspecialidad || matchesEspecialista;
    });
  }

  cancelarTurno(turno: any) {
    // Lógica para cancelar el turno (por ejemplo, actualizar la base de datos o cambiar un estado)
    console.log('Cancelar turno:', turno);
  }
}
