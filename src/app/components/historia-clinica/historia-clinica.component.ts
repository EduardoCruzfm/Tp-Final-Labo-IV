import { Component } from '@angular/core';
import { DatabaseService } from '../../services/database.service';
import { AuthService } from '../../services/auth.service';
import { UsuarioService } from '../../services/usuario.service';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { jsPDF } from "jspdf";
import { trigger, transition, style, animate } from '@angular/animations';
import { CapitalizarPipe } from '../../pipes/capitalizar.pipe';


@Component({
  selector: 'app-historia-clinica',
  standalone: true,
  imports: [CommonModule,NavbarComponent,CapitalizarPipe],
  templateUrl: './historia-clinica.component.html',
  styleUrl: './historia-clinica.component.css',
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
export class HistoriaClinicaComponent {
  tipoUsuarioPefil: any;
  turnos: any;
  turnosFiltrado: any;
  usuarioHistorial:any
  usuarioEspecialista:any
  turnoSeleccionado: any = null; // Para almacenar el turno actual que tiene la reseña
  mostrarLogin: boolean = true; 

  especialistas:any

  constructor( private db: DatabaseService,private auth: AuthService, private usuarioService: UsuarioService) {
    this.tipoUsuarioPefil = this.usuarioService.getUsuarioPerfil();
    console.log(this.tipoUsuarioPefil);  //especialistas
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
        this.filtrarEspecialista();
        console.log("->> " , this.especialistas );
        
        
      }else if(this.tipoUsuarioPefil === 'especialistas'){
        this.usuarioHistorial = this.usuarioService.getPacienteHistorial();
        this.usuarioEspecialista = this.usuarioService.getUsuario();
        this.turnosFiltrado = this.turnos.filter((turno:any) => 
          turno.idEspecialista === this.usuarioEspecialista.id && turno.estado === "finalizado" 
          && turno.paciente.id === this.usuarioHistorial.id);


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

  filtrarEspecialista() {
    this.especialistas = [];

    // Recorrer los turnos y agregar pacientes únicos
    this.turnos.forEach((turno: any) => {
      const especialista = turno.idEspecialista;

      // Verificar si el paciente ya existe en la lista
      if (turno.estado === "finalizado" && !this.especialistas.some((usuario :any) => usuario.id === especialista ) ) {
        this.especialistas.push({id:especialista, nombre: `${turno.especialista.nombre}`,apellido: `${turno.especialista.apellido}`});
      }
    });
  }


  mostrarResenia(turno: any) {
    this.turnoSeleccionado = turno;
    console.log("Turno",  turno);
  }

  cancelarAccion(){
  this.turnoSeleccionado = null; // Cancelar la acción sin guardar
  }

  descargarHistorialPorEspecialista(especialista: any) {
    const turnosDelEspecialista = this.turnosFiltrado.filter(
      (turno: any) => turno.idEspecialista === especialista.id
    );
  
    if (turnosDelEspecialista.length > 0) {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
  
      // Agregar logo centrado (opcional)
      const logoWidth = 40;
      const logoHeight = 40;
      const logoX = (pageWidth - logoWidth) / 2;
      doc.addImage('image/logo.jpg', 'PNG', logoX, 10, logoWidth, logoHeight);
  
      // Título y encabezado
      doc.setFontSize(18);
      doc.text('Historia Clínica', pageWidth / 2, 60, { align: 'center' });
      doc.setFontSize(12);
      const fechaEmision = new Date().toLocaleDateString();
      doc.text(`Fecha de emisión: ${fechaEmision}`, pageWidth / 2, 70, { align: 'center' });
  
      let y = 90; // Ajustar inicio del contenido
      const lineSpacing = 8;


      // 
      // Mostrar los datos del paciente una sola vez
      const paciente = this.usuarioHistorial// Suponiendo que todos los turnos son del mismo paciente
      doc.setFontSize(14);
      doc.text(`Paciente: ${paciente.nombre} ${paciente.apellido}`, 20, y);
      y += lineSpacing;
      doc.text(`DNI: ${paciente.dni}`, 20, y);
      y += lineSpacing;
      doc.text(`Edad: ${paciente.edad}`, 20, y);
      y += lineSpacing;
      doc.text(`Obra Social: ${paciente.obraSocial || 'N/A'}`, 20, y);
      y += lineSpacing;
      doc.text(`Especilista: ${especialista.nombre || 'N/A'} ${especialista.apellido || 'N/A'}`, 20, y);
      y += lineSpacing * 2; // Espacio extra después de los datos fijos
      // 
  

      for (const turno of turnosDelEspecialista) {
        // Fecha y hora del turno
        doc.setFontSize(12);
        doc.text(`Fecha del turno: ${turno.fechaHora.diaConFormato}  ${turno.fechaHora.mesCadena}`, 20, y);
        y += lineSpacing;
        doc.text(`Hora del turno: ${turno.fechaHora.horaInicio || 'N/A'}`, 20, y);
        y += lineSpacing;
  
        // Detalles variables (altura, peso, etc.)
        const detalles = [
          { label: 'Altura', value: turno.resenia?.altura || 'N/A', unidad: 'cm' },
          { label: 'Peso', value: turno.resenia?.peso || 'N/A', unidad: 'kg' },
          { label: 'Temperatura', value: turno.resenia?.temperatura || 'N/A', unidad: '°C' },
          { label: 'Presión', value: turno.resenia?.presion || 'N/A', unidad: 'mmHg' },
          { label: 'Reseña de especialista', value: turno.resenia?.comentario || 'N/A' },
        ];
  
        for (const detalle of detalles) {
          doc.text(`${detalle.label}: ${detalle.value} ${detalle.unidad || ''}`, 30, y);
          y += lineSpacing;
        }
  
        y += lineSpacing * 2; // Espacio extra entre turnos
  
        // Agregar nueva página si el contenido excede el límite
        if (y > 270) {
          doc.addPage();
          y = 20; // Reiniciar posición en nueva página
        }
      }
  
      // Guardar el archivo PDF
      doc.save(`Historial_${especialista.nombre}_${especialista.apellido}.pdf`);
    } else {
      console.log('No hay turnos disponibles para este especialista.');
    }
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
  

}
