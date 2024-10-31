
export class Turno {
    especialidad: string;
    especialista: string; 
    fechaHora: any; 
    paciente: any; 
  
    constructor(especialidad: string,especialista: string,fechaHora: any,paciente: string) {
      this.especialidad = especialidad;
      this.especialista = especialista;
      this.fechaHora = fechaHora;
      this.paciente = paciente;
    }
  }