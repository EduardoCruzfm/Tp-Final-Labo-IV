export class FechaHora {
  dia: string;
  mes: string;
  anio: number;
  horaInicio: string;
  horaFin: string;

  constructor( dia: string ,mes: string, anio: number, horaInicio: string,  horaFin: string) {
   this.dia = dia;
   this.mes = mes;
   this.anio = anio;
   this.horaInicio = horaInicio;
   this.horaFin = horaFin; 
  }
 
  GetFecha(){
    return {
      dia: this.dia,
      mes: this.mes,
      anio: this.anio,
      horaInicio: this.horaInicio,
      horaFin: this.horaFin
    };
  }

    // Método para obtener la fecha en formato legible
    getFechaFormateada(): string {
      return `${this.dia}, ${this.mes.toString().padStart(2, '0')}/${this.anio}`;
    }
  
    // Método para obtener la hora en formato legible
    getHoraFormateada(): string {
      return `${this.horaInicio} - ${this.horaFin}`;
    }
  
    // Método para obtener la fecha y hora completa en formato legible
    getFechaHoraCompleta(): string {
      return `${this.getFechaFormateada()} de ${this.getHoraFormateada()}`;
    }

}
