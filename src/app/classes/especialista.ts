export class Especialista {
    id: string;
    nombre: string;
    apellido: string;
    edad: number;
    dni: string;
    especialidad: string[]; 
    email: string;
    imagenPerfil: string;
    aprobado: boolean;
    perfil:string;
    disponibilidad: any[];

  
    constructor(id: string,nombre: string,apellido: string,edad: number,dni: string,especialidad: string[],
      email: string, imagenPerfil: string, aprobado: boolean, perfil:string,disponibilidad: any[]) {
      this.id = id;
      this.nombre = nombre;
      this.apellido = apellido;
      this.edad = edad;
      this.dni = dni;
      this.especialidad = especialidad;
      this.email = email;
      this.imagenPerfil = imagenPerfil;
      this.aprobado = aprobado;
      this.perfil = perfil;
      this.disponibilidad = disponibilidad;
    }
  
    // Método para agregar una nueva especialidad si no se encuentra en la lista
    GetNombre() {
      return {
        nombre: this.nombre,
        apellido: this.apellido
      };
    }

    ActualizarDisponibilidad(disponibilidad:any){
      this.disponibilidad = disponibilidad; 
    }
  }