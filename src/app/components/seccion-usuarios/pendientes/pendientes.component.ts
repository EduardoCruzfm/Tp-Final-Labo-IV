import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatabaseService } from '../../../services/database.service';
import { NavbarComponent } from '../../navbar/navbar.component';

@Component({
  selector: 'app-pendientes',
  standalone: true,
  imports: [CommonModule,NavbarComponent],
  templateUrl: './pendientes.component.html',
  styleUrl: './pendientes.component.css'
})
export class PendientesComponent {
  listaEspecialistas: any[] = [];

  constructor(private db: DatabaseService) {

    this.db.traerUsuario('especialistas').subscribe((response) => {
      this.listaEspecialistas = response;
      console.log(this.listaEspecialistas);
    });
  }

  // Método para aprobar especialistas
  aprobarEspecialista(especialista: any, estado: boolean) {
  especialista.aprobado = estado;
  this.db.modificarUsuario(especialista, 'especialistas'); 
}

}
