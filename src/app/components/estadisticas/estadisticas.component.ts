import { Component } from '@angular/core';
import { DatabaseService } from '../../services/database.service';
import { BaseChartDirective } from 'ng2-charts';
import { Chart, registerables } from 'chart.js';
import { ChartData, ChartOptions } from 'chart.js';
import { NavbarComponent } from '../navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { jsPDF } from "jspdf";
import html2canvas from 'html2canvas';
import 'jspdf-autotable'; 
// import ChartDataLabels from 'chartjs-plugin-datalabels';




@Component({
  selector: 'app-estadisticas',
  standalone: true,
  imports: [NavbarComponent, BaseChartDirective,CommonModule],
  templateUrl: './estadisticas.component.html',
  styleUrl: './estadisticas.component.css'
})
export class EstadisticasComponent {
  charts: { data: ChartData<'bar'>, options: ChartOptions }[] = [];
  turnos:any;
  especialistas:any;
  logs:any;
  turnosPorEspecialidad: any;
  turnosDiaLabels: any;
  turnosDiaData: any;

  listaUsuarios:  any[] = [];


  constructor(private db: DatabaseService) {
    Chart.register(...registerables);
  }

  async ngOnInit() {
    await this.cargarTurnos();
    await this.cargarEspecialistas();
    await this.cargarLogs();
    await this.cargarPacientes();
    await this.cargarAdministradores();

    this.charts.push(
      this.generarGraficoLogIngresos(),
      this.generarGraficoTurnosPorEspecialidad(),
      this.generarGraficoTurnosPorDia(),
      this.generarGraficoTurnosSolicitadosPorMedico(),
      this.generarGraficoTurnosFinalizadosPorMedico()
    );

    console.log("usuarios ->" ,this.listaUsuarios)
  }

  cargarTurnos(): Promise<void> {
    return new Promise((resolve) => {
      this.db.traerUsuario('turnos').subscribe((response: any[]) => {
        this.turnos = response;
        console.log("Turnos ->",this.turnos);
        resolve();
      });
    });
  }

  cargarLogs(): Promise<void> {
    return new Promise((resolve) => {
      this.db.traerUsuario('logs').subscribe((response: any[]) => {
        this.logs = response;
        console.log("Logs -> ",this.logs);
        resolve();
      });
    });
  }

  
  cargarPacientes(): Promise<void> {
    return new Promise((resolve) => {
      this.db.traerUsuario('pacientes').subscribe((response: any[]) => {
        this.listaUsuarios = this.listaUsuarios.concat(response); 
        console.log("Pacientes -> ",this.listaUsuarios);
        resolve();
      });
    });
  }

  cargarEspecialistas(): Promise<void> {
    return new Promise((resolve) => {
      this.db.traerUsuario('especialistas').subscribe((response: any[]) => {
        this.especialistas = response;
        this.listaUsuarios = this.listaUsuarios.concat(response); 
        console.log("Especialistas -> ",this.listaUsuarios);
        resolve();
      });
    });
  }

  cargarAdministradores(): Promise<void> {
    return new Promise((resolve) => {
      this.db.traerUsuario('administradores').subscribe((response: any[]) => {
        this.listaUsuarios = this.listaUsuarios.concat(response); 
        console.log("Administradores -> ",this.listaUsuarios);
        resolve();
      });
    });
  }


  generarGraficoLogIngresos(): { data: ChartData<'bar'>, options: ChartOptions } { 
    // Agrupar logs por usuario
    const logsPorUsuario: { [usuario: string]: any[] } = {};
  
    this.logs.forEach((log: any) => {
      const usuario = this.obtenerNombreUsuario(log.idUsuario);
      if (!logsPorUsuario[usuario]) {
        logsPorUsuario[usuario] = [];
      }
      logsPorUsuario[usuario].push(log);
    });
  
    // Preparar etiquetas y datos
    const labels = Object.keys(logsPorUsuario);
    const datasetsData = labels.map((usuario) => logsPorUsuario[usuario].length);
  
    // Preparar etiquetas personalizadas (días y horas concatenados)
    const dataLabels = labels.map((usuario) => {
      return logsPorUsuario[usuario]
        .map((log: any) => `${log.dia}/${log.mes.digito} ${log.hora}`)
        // .join('\n'); // Usar \n para salto de línea (esto es texto plano)
    });
  
    // Configuración del gráfico
    const data = {
      labels: labels,
      datasets: [
        {
          data: datasetsData,
          label: 'Log de ingresos',
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }
      ]
    };
  
    const options: ChartOptions<'bar'> = {
      responsive: true,
      plugins: {
        tooltip: {
          callbacks: {
            label: (context) => {
              const index = context.dataIndex;
              // Usamos \n para separar las líneas en el tooltip
              const tooltipText = `Ingresos: ${datasetsData[index]}\n${dataLabels[index]}`;
              return tooltipText;
            }
          },
          // Si deseas más personalización puedes incluir 'footer' o 'beforeBody' para más detalles
          displayColors: false, // Opcional, para quitar el color del cuadrito del tooltip
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Cantidad de ingresos'
          }
        },
        x: {
          title: {
            display: true,
            text: 'Usuarios'
          },
          ticks: {
            autoSkip: true,  // Permite que las etiquetas se salten automáticamente si hay demasiadas
            maxTicksLimit: 10,  // Limita el número de etiquetas visibles en el eje X
          },
          // Rota las etiquetas si son largas
          // angle: -45,  // Puedes ajustar el ángulo de rotación según lo necesites
        }
      }
      
    };
  
    return { data, options };
  }
  
  

  obtenerNombreUsuario(idUsuario: string): string {
    const usuario = this.listaUsuarios.find((user: any) => user.id === idUsuario);
    return usuario ? `${usuario.nombre} ${usuario.apellido}` : 'Desconocido';
  }
  

  generarGraficoTurnosPorEspecialidad():{ data: ChartData<'bar'>, options: ChartOptions } {
    // Verificar si hay turnos cargados
    if (!this.turnos || this.turnos.length === 0) {
      console.warn('No hay turnos cargados.');
      return {
        data: { labels: [], datasets: [{ data: [], label: 'Turnos por Día' }] },
        options: { responsive: true, scales: { y: { beginAtZero: true } } }
      };
    }
  
    // Contador de turnos por día
    const turnosPorEspecialidad: { [especialidad: string]: number } = {};
  
    // Iterar sobre los turnos y contar por fecha
    this.turnos.forEach((turno: any) => {

      const esp = turno.especialidad;
      
      if (esp) {
        if (!turnosPorEspecialidad[esp]) {
          turnosPorEspecialidad[esp] = 0;
        }
        turnosPorEspecialidad[esp]++;
      }
    });
    
  
    // Extraer las etiquetas (fechas) y los datos (conteos)
    const labels = Object.keys(turnosPorEspecialidad);
    const dataValues = Object.values(turnosPorEspecialidad);
  
    // Crear la estructura del gráfico con un conjunto de datos para múltiples barras por día
    const data = {
      labels: labels,
      datasets: [
        {
          data: dataValues,
          label: 'Cantidad de Turnos por Especilidad',
          backgroundColor: 'rgba(75, 192, 192, 0.5)', // Color para diferenciar las barras
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }
      ]
    };
  
    const options = {
      responsive: true,
      scales: {
        x: {
          title: {
            display: true,
            text: 'Días'
          }
        },
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Cantidad de Turnos'
          }
        }
      }
    };
  
    return { data, options };
  }
  

  generarGraficoTurnosPorDia(): { data: ChartData<'bar'>, options: ChartOptions } {
    // Verificar si hay turnos cargados
    if (!this.turnos || this.turnos.length === 0) {
      console.warn('No hay turnos cargados.');
      return {
        data: { labels: [], datasets: [{ data: [], label: 'Turnos por Día' }] },
        options: { responsive: true, scales: { y: { beginAtZero: true } } }
      };
    }
  
    // Contador de turnos por día
    const turnosPorDia: { [fecha: string]: number } = {};
  
    // Iterar sobre los turnos y contar por fecha
    this.turnos.forEach((turno: any) => {
      // Construimos la fecha en formato 'YYYY-MM-DD' usando las propiedades del objeto `turno`
      const fecha = `${turno.fechaHora.anio}-${turno.fechaHora.mesNumerico.padStart(2, '0')}-${turno.fechaHora.diaConFormato.padStart(2, '0')}`;
      
      if (fecha) {
        if (!turnosPorDia[fecha]) {
          turnosPorDia[fecha] = 0;
        }
        turnosPorDia[fecha]++;
      }
    });
    
  
    // Extraer las etiquetas (fechas) y los datos (conteos)
    const labels = Object.keys(turnosPorDia);
    const dataValues = Object.values(turnosPorDia);
  
    // Crear la estructura del gráfico con un conjunto de datos para múltiples barras por día
    const data = {
      labels: labels,
      datasets: [
        {
          data: dataValues,
          label: 'Cantidad de Turnos por Día',
          backgroundColor: 'rgba(75, 192, 192, 0.5)', // Color para diferenciar las barras
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }
      ]
    };
  
    const options = {
      responsive: true,
      scales: {
        x: {
          title: {
            display: true,
            text: 'Días'
          }
        },
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Cantidad de Turnos'
          }
        }
      }
    };
  
    return { data, options };
  }
  

  generarGraficoTurnosSolicitadosPorMedico(): { data: ChartData<'bar'>, options: ChartOptions } {
    // Verificar si hay turnos y especialistas cargados
    if (!this.turnos || this.turnos.length === 0) {
      console.warn('No hay turnos cargados.');
      return {
        data: { labels: [], datasets: [{ data: [], label: 'Turnos por Médico' }] },
        options: { responsive: true, scales: { y: { beginAtZero: true } } }
      };
    }
    
    if (!this.especialistas || this.especialistas.length === 0) {
      console.warn('No hay especialistas cargados.');
      return {
        data: { labels: [], datasets: [{ data: [], label: 'Turnos por Médico' }] },
        options: { responsive: true, scales: { y: { beginAtZero: true } } }
      };
    }
  
    // Contador de turnos finalizados por médico
    const turnosSolicitados: { [nombreMedico: string]: number } = {};
  
    this.turnos.forEach((turno: any) => {
      // Obtener el id del especialista del turno
      const idEspecialista = turno.idEspecialista;
      
      if (idEspecialista) {
        // Buscar al especialista por su id
        const especialista = this.especialistas.find((espec: any) => espec.id === idEspecialista);
        
        if (especialista) {
          const nombreMedico = especialista.nombre; // Suponiendo que `nombre` es la propiedad del nombre completo del médico
          
          // Inicializar el contador si no existe
          if (!turnosSolicitados[nombreMedico]) {
            turnosSolicitados[nombreMedico] = 0;
          }
          
          // Incrementar el contador
          turnosSolicitados[nombreMedico]++;
        }
      }
    });
  
    // Extraer las etiquetas (nombres de médicos) y los datos (conteos)
    const labels = Object.keys(turnosSolicitados);
    const dataValues = Object.values(turnosSolicitados);
  
   // Crear la estructura del gráfico
    const data = {
      labels: labels,
      datasets: [
        {
          data: dataValues,
          label: 'Cantidad de Turnos Soliciatos por Médico',
          backgroundColor: 'rgba(0, 128, 0, 0.5)', // Color verde con transparencia
          borderColor: 'rgba(0, 128, 0, 1)',       // Color verde sólido para el borde
          borderWidth: 1
        }
      ]
    };

  
    const options = {
      responsive: true,
      scales: {
        x: {
          title: {
            display: true,
            text: 'Médicos'
          }
        },
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Cantidad de Turnos'
          }
        }
      }
    };
  
    return { data, options };
  }

  generarGraficoTurnosFinalizadosPorMedico(): { data: ChartData<'bar'>, options: ChartOptions } {
    // Verificar si hay turnos y especialistas cargados
    if (!this.turnos || this.turnos.length === 0) {
      console.warn('No hay turnos cargados.');
      return {
        data: { labels: [], datasets: [{ data: [], label: 'Turnos por Médico' }] },
        options: { responsive: true, scales: { y: { beginAtZero: true } } }
      };
    }
    
    if (!this.especialistas || this.especialistas.length === 0) {
      console.warn('No hay especialistas cargados.');
      return {
        data: { labels: [], datasets: [{ data: [], label: 'Turnos por Médico' }] },
        options: { responsive: true, scales: { y: { beginAtZero: true } } }
      };
    }
  
    // Contador de turnos finalizados por médico
    const turnosFinalizados: { [nombreMedico: string]: number } = {};
  
    this.turnos.forEach((turno: any) => {
      // Obtener el id del especialista del turno
      const idEspecialista = turno.idEspecialista;
      
      if (idEspecialista) {
        // Buscar al especialista por su id
        const especialista = this.especialistas.find((espec: any) => espec.id === idEspecialista);
        
        if (especialista && turno.estado == 'finalizado') {
          const nombreMedico = especialista.nombre; // Suponiendo que `nombre` es la propiedad del nombre completo del médico
          
          // Inicializar el contador si no existe
          if (!turnosFinalizados[nombreMedico]) {
            turnosFinalizados[nombreMedico] = 0;
          }
          
          // Incrementar el contador
          turnosFinalizados[nombreMedico]++;
        }
      }
    });
  
    // Extraer las etiquetas (nombres de médicos) y los datos (conteos)
    const labels = Object.keys(turnosFinalizados);
    const dataValues = Object.values(turnosFinalizados);
  
   // Crear la estructura del gráfico
    const data = {
      labels: labels,
      datasets: [
        {
          data: dataValues,
          label: 'Cantidad de Turnos Finalizados por Médico',
          backgroundColor: 'rgba(0, 128, 0, 0.5)', // Color verde con transparencia
          borderColor: 'rgba(0, 128, 0, 1)',       // Color verde sólido para el borde
          borderWidth: 1
        }
      ]
    };

  
    const options = {
      responsive: true,
      scales: {
        x: {
          title: {
            display: true,
            text: 'Médicos'
          }
        },
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Cantidad de Turnos'
          }
        }
      }
    };
  
    return { data, options };
  }

  exportarPDF() {
    const pdf: jsPDF & { autoTable?: any } = new jsPDF();
    // const pdf = new jsPDF('p', 'mm', 'a4');
    const container = document.getElementById('graficos-container');
  
    if (container) {
      // Captura el gráfico como una imagen
      html2canvas(container).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = 190; // Ajuste para la anchura de la página A4
        const pageHeight = pdf.internal.pageSize.getHeight();
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
  
        // Agrega la imagen del gráfico al PDF
        pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
  
        // Agregar un espacio debajo del gráfico
        let yPosition = imgHeight + 20;
  
        // Preparar datos para la tabla
        const tableData: any[] = [];
        this.logs.forEach((log: any) => {
          const usuario = this.obtenerNombreUsuario(log.idUsuario);
          const diaHora = `${log.dia}/${log.mes.digito} ${log.hora}`;
          const existingEntry = tableData.find(entry => entry.usuario === usuario);
  
          if (existingEntry) {
            existingEntry.logs.push(diaHora);
          } else {
            tableData.push({ usuario, logs: [diaHora] });
          }
        });
  
        // Formatear los datos en filas para la tabla
        const rows: any[] = [];
        tableData.forEach(entry => {
          rows.push([entry.usuario]); // Usuario como encabezado
          rows.push([entry.logs.join('\n')]); // Logs concatenados con saltos de línea
        });
  
        // Agregar la tabla
        pdf.autoTable({
          startY: yPosition,
          head: [['Usuario', 'Días y horas']],
          body: tableData.map(entry => [
            entry.usuario,
            entry.logs.join(', ') // Mostrar todos los logs del usuario
          ]),
          theme: 'striped', // Tema para la tabla
          styles: { fontSize: 10 }, // Tamaño de fuente
        });
  
        // Guarda el archivo PDF
        pdf.save('graficos_con_tabla.pdf');
      });
    } else {
      console.error('No se encontró el contenedor de gráficos.');
    }
  }
  
  
}

