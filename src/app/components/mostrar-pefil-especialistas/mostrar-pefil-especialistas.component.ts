import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { DatabaseService } from '../../services/database.service';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../../services/usuario.service';
import { Especialista } from '../../classes/especialista';

@Component({
  selector: 'app-mostrar-pefil-especialistas',
  standalone: true,
  imports: [NavbarComponent,CommonModule],
  templateUrl: './mostrar-pefil-especialistas.component.html',
  styleUrl: './mostrar-pefil-especialistas.component.css'
})
export class MostrarPefilEspecialistasComponent {

  especialistasDisponiblesFiltro: any[] = []
  especialistasDisponibles: any[] = []
  esp:any
  datosTurno: any;


  constructor(private router: Router,private db: DatabaseService,private usuarioService: UsuarioService) {
    this.cargarEspecialistas();
    this.datosTurno = this.usuarioService.getTurno();
  }

  ngOnInit(): void {
    console.log("Datos del TURNO", this.datosTurno)
  }



  seleccionarEspecialista(esp: any) {
    this.usuarioService.setEspecialista(esp)
    console.log("Selec --> " ,esp)

    
    //SEtear especialidad en el storage
    const get = this.usuarioService.getTurno();
    const turno = {
      uId : esp.id,
      especialidad : get.especialidad,
      especialista : esp.nombre 
     }

    this.usuarioService.setTurno(turno);

    console.log("Turno", this.usuarioService.getTurno());


    this.router.navigate(['/solicitar-turno']);
  }


  cargarEspecialistas() {
    this.db.traerUsuario('especialistas').subscribe((response) => {
      const especialidad = this.usuarioService.getTurno();
  
      this.especialistasDisponibles = response.filter((esp: any) =>
        esp.especialidad.some((es: any) => es === especialidad.especialidad)
      );
  
      console.log(this.especialistasDisponibles);
    });
  }
  
}
