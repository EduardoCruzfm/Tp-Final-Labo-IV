import { Component } from '@angular/core';
import { DatabaseService } from '../../services/database.service';
import { AuthService } from '../../services/auth.service';
import { UsuarioService } from '../../services/usuario.service';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { jsPDF } from "jspdf";



@Component({
  selector: 'app-historia-clinica',
  standalone: true,
  imports: [CommonModule,NavbarComponent],
  templateUrl: './historia-clinica.component.html',
  styleUrl: './historia-clinica.component.css'
})
export class HistoriaClinicaComponent {
  tipoUsuarioPefil: any;
  turnos: any;
  turnosFiltrado: any;
  usuarioHistorial:any
  usuarioEspecialista:any
  turnoSeleccionado: any = null; // Para almacenar el turno actual que tiene la reseña


  constructor( private db: DatabaseService,private auth: AuthService, private usuarioService: UsuarioService) {
    this.tipoUsuarioPefil = this.usuarioService.getUsuarioPerfil();
    console.log(this.tipoUsuarioPefil);
  }
  
  
  async ngOnInit(){
     await this.cargarTurnos();
    if (this.turnos) {
      
      if (this.tipoUsuarioPefil === 'administradores') {
        this.turnosFiltrado = this.turnos;
        //obtener el seteo
        this.usuarioHistorial = this.usuarioService.getPacienteHistorial();
        console.log("usuario paciente historial   ",this.usuarioHistorial)
        
        
        this.turnosFiltrado = this.turnos.filter((turno:any) => 
          turno.paciente.id === this.usuarioHistorial.id && turno.estado === "finalizado");
      }
      else if (this.tipoUsuarioPefil === 'pacientes') {
        this.usuarioHistorial = this.usuarioService.getUsuario();
        console.log("usuario paciente   ",this.usuarioHistorial)
        this.turnosFiltrado = this.turnos.filter((turno:any) => 
          turno.paciente.id === this.usuarioHistorial.id && turno.estado === "finalizado" );
        
      }else if(this.tipoUsuarioPefil === 'especialistas'){
        this.usuarioEspecialista = this.usuarioService.getUsuario();
        this.turnosFiltrado = this.turnos.filter((turno:any) => 
          turno.idEspecialista === this.usuarioEspecialista.id && turno.estado === "finalizado");
      }
      console.log("Turnos filtrados -> ",this.turnosFiltrado)
    }
  }


  cargarTurnos(): Promise<void> {
    return new Promise((resolve) => {
      this.db.traerUsuario('turnos').subscribe((response) => {
        this.turnos = response;
        console.log(this.turnos);
        resolve();
      });
    });
  }


  mostrarResenia(turno: any) {
    this.turnoSeleccionado = turno;
    console.log("Turno",  turno);
  }

  cancelarAccion(){
  this.turnoSeleccionado = null; // Cancelar la acción sin guardar
  }

  descargarPDF() {
    if (this.turnosFiltrado && this.turnosFiltrado.length > 0) {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      
      // Agregar el logo centrado (ajustar el tamaño para que sea cuadrado)
      const logoWidth = 40;
      const logoHeight = 40;
      const logoX = (pageWidth - logoWidth) / 2;
      doc.addImage('image/logo.jpg', "PNG", logoX, 10, logoWidth, logoHeight);
  
      // Agregar título centrado
      doc.setFontSize(18);
      doc.text("Historia Clínica", pageWidth / 2, 60, { align: 'center' });
  
      // Agregar la fecha de emisión centrada
      const fechaEmision = new Date().toLocaleDateString();
      doc.setFontSize(12);
      doc.text(`Fecha de emisión: ${fechaEmision}`, pageWidth / 2, 70, { align: 'center' });
  
      let y = 90; // Ajuste de inicio de contenido
      const lineSpacing = 10;
  
      for (const turno of this.turnosFiltrado) {
        // Datos del paciente
        doc.setFontSize(14);
        doc.text(`Paciente: ${turno.paciente.nombre} ${turno.paciente.apellido}`, 20, y);
        y += lineSpacing;
        doc.text(`DNI: ${turno.paciente.dni}`, 20, y);
        y += lineSpacing;
        doc.text(`Edad: ${turno.paciente.edad}`, 20, y);
        y += lineSpacing;
        doc.text(`Email: ${turno.paciente.email}`, 20, y);
        y += lineSpacing;
        doc.text(`Obra Social: ${turno.paciente.obraSocial}`, 20, y);
        y += lineSpacing;
  
        // Datos del especialista
        doc.text(`Especialista: ${turno.especialista.nombre} ${turno.especialista.apellido}`, 20, y);
        y += lineSpacing;
  
        // Datos de la reseña
        doc.text(`Altura: ${turno.resenia?.altura || 'N/A'} cm`, 20, y);
        y += lineSpacing;
        doc.text(`Peso: ${turno.resenia?.peso || 'N/A'} kg`, 20, y);
        y += lineSpacing;
        doc.text(`Temperatura: ${turno.resenia?.temperatura || 'N/A'} °C`, 20, y);
        y += lineSpacing;
        doc.text(`Presión: ${turno.resenia?.presion || 'N/A'} mmHg`, 20, y);
        y += lineSpacing;
        doc.text(`Reseña de especialista: ${turno.resenia?.comentario || 'N/A'}`, 20, y);
        y += lineSpacing * 2; // Espacio extra entre turnos
  
        // Verifica si es necesario agregar una nueva página
        if (y > 270) {
          doc.addPage();
          y = 20; // Reiniciar posición en la nueva página
        }
      }
  
      // Guardar el PDF
      doc.save(`${this.usuarioHistorial?.nombre || 'Paciente'}_historia_clinica.pdf`);
    }
  }
  


  // descargarPDF(){
  //   if (this.turnosFiltrado && this.turnosFiltrado.length > 0) {
  //     const doc = new jsPDF();
  //     const logoURL = 'image/logo.jpg'; // Reemplaza esto con la URL o base64 de tu logo

  //     doc.addImage(logoURL, "PNG", 10, 10, 50, 20);
  //     doc.setFontSize(18);
  //     doc.text("Historia Clínica", 70, 40);
  //     const fechaEmision = new Date().toLocaleDateString();
  //     doc.setFontSize(12);
  //     doc.text(`Fecha de emisión: ${fechaEmision}`, 70, 50);

  //     let y = 70;
  //     for (const turno of this.turnosFiltrado) {
  //       doc.setFontSize(14);
  //       doc.text(`Paciente: ${turno.paciente.nombre} ${turno.paciente.apellido}`, 10, y);
  //       doc.text(`Especialista: ${turno.especialista.nombre} ${turno.especialista.apellido}`, 10, y + 10);
  //       doc.text(`Altura: ${turno.resenia?.altura || 'N/A'} cm`, 10, y + 20);
  //       doc.text(`Peso: ${turno.resenia?.peso || 'N/A'} kg`, 10, y + 30);
  //       doc.text(`Temperatura: ${turno.resenia?.temperatura || 'N/A'} °C`, 10, y + 40);
  //       doc.text(`Presión: ${turno.resenia?.presion || 'N/A'} mmHg`, 10, y + 50);

  //       y += 60;
  //       if (y > 270) {
  //         doc.addPage();
  //         y = 20;
  //       }
  //     }

  //     doc.save(`${this.usuarioHistorial?.nombre || 'Paciente'}_historia_clinica.pdf`);
  //   }
  
  // }

}
