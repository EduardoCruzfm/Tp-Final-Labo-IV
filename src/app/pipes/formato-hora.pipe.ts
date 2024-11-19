import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatoHora',
  standalone: true
})
export class FormatoHoraPipe implements PipeTransform {

  transform(hora: string): string {
    // Si la hora ya tiene un formato correcto, no hacer nada
    if (/^\d{1,2}:\d{2}\s?(AM|PM|am|pm)$/i.test(hora)) {
      return hora.toUpperCase(); // Convertir a mayúsculas para estandarizar
    }

    // Transformar si está en formato 24 horas
    const [horas, minutos] = hora.split(':').map(Number);
    if (isNaN(horas) || isNaN(minutos)) {
      return 'Hora inválida'; // Manejo de errores
    }

    const periodo = horas >= 12 ? 'PM' : 'AM';
    const horasFormato = horas % 12 || 12; // Convierte 0 a 12 para el formato 12 horas
    return `${horasFormato}:${minutos < 10 ? '0' : ''}${minutos} ${periodo}`;
  }

}
