import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'traducirEstado',
  standalone: true
})
export class TraducirEstadoPipe implements PipeTransform {
  transform(estado: 'pendiente' | 'finalizado' | 'cancelado'): string {
    const estados = {
      pendiente: 'Pendiente',
      finalizado: 'Finalizado',
      cancelado: 'Cancelado'
    };
    return estados[estado] || 'Desconocido';
  }
}
