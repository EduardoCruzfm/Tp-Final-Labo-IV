import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatabaseService } from '../../../services/database.service';
import { Router } from '@angular/router';
import { UsuarioService } from '../../../services/usuario.service';
import { NavbarComponent } from '../../navbar/navbar.component';
import { HoverHighlightDirective } from '../../../directives/hover-highlight.directive';
import * as XLSX from 'xlsx'; // Importamos XLSX
import * as FileSaver from 'file-saver'; // Importamos FileSaver


@Component({
  selector: 'app-perfiles',
  standalone: true,
  imports: [CommonModule,NavbarComponent,HoverHighlightDirective],
  templateUrl: './perfiles.component.html',
  styleUrl: './perfiles.component.css'
})
export class PerfilesComponent {
  listaUsuarios: any[] = [];
  listaTurnos: any[] = [];

  constructor(private db: DatabaseService, private router: Router,private usuarioService: UsuarioService) {}

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

    this.db.traerUsuario('turnos').subscribe((response) => {
      this.listaTurnos = response; 
      console.log('Turnos:', this.listaTurnos);
    });
  }

  verHistorialPaciente(usuario: any) {
    // Lógica para redirigir al historial del paciente
    // Por ejemplo, puedes usar un servicio de router para navegar a otra ruta
    this.usuarioService.setPacienteHistorial(usuario);
    this.router.navigate(['/historia-clinica']);
    console.log("--->>   ",usuario);
  }

  descargarExcel(usuario: any) {
    // Generar los datos para exportar
    const datosExportar = [
      {
        Nombre: usuario.nombre,
        Apellido: usuario.apellido,
        Email: usuario.email,
        Edad: usuario.edad,
        DNI: usuario.dni,
        Perfil: usuario.perfil,
      },
    ];

    // Crear una hoja de trabajo de Excel
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(datosExportar);

    // Crear un libro de Excel
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Usuario');

    // Generar el archivo Excel en formato binario
    const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

    // Guardar el archivo usando FileSaver
    const nombreArchivo = `${usuario.nombre}_${usuario.apellido}_Datos.xlsx`;
    const data: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    FileSaver.saveAs(data, nombreArchivo);
  }

  descargarExcelTurnos(usuario: any) {
    // Filtrar los turnos del usuario específico y que estén finalizados
    const turnosUsuario = this.listaTurnos.filter(
      (turno) =>
        turno.paciente.id === usuario.id && turno.estado === 'finalizado'
    );
  
    // Preparar datos para exportar
    const datosExportar = turnosUsuario.map((turno) => ({
      Fecha: `${turno.fechaHora.diaConFormato} - ${turno.fechaHora.mesNumerico} - ${turno.fechaHora.anio}`,
      Hora: `${turno.fechaHora.horaInicio} - ${turno.fechaHora.horaFin}`,
      Especialista: `${turno.especialista.nombre} ${turno.especialista.apellido}`,
      Especialidad: turno.especialidad,
      Altura: turno.resenia?.altura || 'No registrado',
      Peso: turno.resenia?.peso || 'No registrado',
      Presion: turno.resenia?.presion || 'No registrado',
      Temperatura: turno.resenia?.temperatura || 'No registrado',
      Comentario: turno.resenia?.comentario || 'Sin comentario',
    }));
  
    // Crear una hoja de trabajo de Excel
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(datosExportar);
  
    // Crear un libro de Excel
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Turnos');
  
    // Generar el archivo Excel en formato binario
    const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  
    // Guardar el archivo usando FileSaver
    const nombreArchivo = `Turnos_${usuario.nombre}_${usuario.apellido}.xlsx`;
    const data: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    FileSaver.saveAs(data, nombreArchivo);
  }
  

  descargarExcelUsuarios() {
    // Preparar datos para exportar
    const datosExportar = this.listaUsuarios.map((usuario) => ({
      Nombre: usuario.nombre,
      Apellido: usuario.apellido,
      Email: usuario.email,
      Edad: usuario.edad,
      DNI: usuario.dni,
      Perfil: usuario.perfil,
    }));

    // Crear una hoja de trabajo de Excel
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(datosExportar);

    // Crear un libro de Excel
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Usuarios');

    // Generar el archivo Excel en formato binario
    const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

    // Guardar el archivo usando FileSaver
    const nombreArchivo = 'Lista_Usuarios.xlsx';
    const data: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    FileSaver.saveAs(data, nombreArchivo);
  }

}
