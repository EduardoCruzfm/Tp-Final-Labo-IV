
export class Turno {
    id: string;
    idEspecialista: string;
    especialidad: string; 
    especialista: string; 
    fechaHora: any; 
    paciente: any; 
    estado: 'pendiente' | 'realizado' | 'cancelado'; // Tipo string con tres opciones
    comentario: any;
    resenia: string;
  
    constructor(id: string,idEspecialista: string, especialidad: string,especialista: string,fechaHora: any,
      paciente: string, estado: 'pendiente' | 'realizado' | 'cancelado' = 'pendiente', comentario: any,resenia: string) {
      this.id = id;
      this.idEspecialista = idEspecialista;
      this.especialidad = especialidad;
      this.especialista = especialista;
      this.fechaHora = fechaHora;
      this.paciente = paciente;
      this.estado = estado;
      this.comentario = comentario;
      this.resenia = resenia;
    }
  }