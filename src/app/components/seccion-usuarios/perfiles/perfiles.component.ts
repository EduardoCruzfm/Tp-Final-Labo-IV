import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatabaseService } from '../../../services/database.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-perfiles',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './perfiles.component.html',
  styleUrl: './perfiles.component.css'
})
export class PerfilesComponent {
  listaUsuarios: any[] = [];

  constructor(private db: DatabaseService, private router: Router) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.db.traerUsuario('administradores').subscribe((response) => {
      this.listaUsuarios = this.listaUsuarios.concat(response); 
      console.log('Administradores:', this.listaUsuarios);
    });

    this.db.traerUsuario('pacientes').subscribe((response) => {
      this.listaUsuarios = this.listaUsuarios.concat(response); 
      console.log('Pacientes:', this.listaUsuarios);
    });

    this.db.traerUsuario('especialistas').subscribe((response) => {
      this.listaUsuarios = this.listaUsuarios.concat(response); 
      console.log('Especialistas:', this.listaUsuarios);
    });
  }

  verDetalleUsuario(usuario: any) {
    this.router.navigate(['/usuario-detalle'], { state: { usuario } }); 
  }
}
