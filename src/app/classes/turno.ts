
export class Turno {
    especialidad: string;
    especialista: string; 
    fechaHora: any; 
    paciente: any; 
    estado: 'pendiente' | 'realizado' | 'cancelado'; // Tipo string con tres opciones
    comentario: string;
    resenia: string;
  
    constructor(especialidad: string,especialista: string,fechaHora: any,
      paciente: string, estado: 'pendiente' | 'realizado' | 'cancelado' = 'pendiente', comentario: string,resenia: string) {
      this.especialidad = especialidad;
      this.especialista = especialista;
      this.fechaHora = fechaHora;
      this.paciente = paciente;
      this.estado = estado;
      this.comentario = comentario;
      this.resenia = resenia;
    }
  }