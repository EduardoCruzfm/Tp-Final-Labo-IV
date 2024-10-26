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
  
    constructor(id: string,nombre: string,apellido: string,edad: number,dni: string,especialidad: string[],email: string, imagenPerfil: string, aprobado: boolean) {
      this.id = id;
      this.nombre = nombre;
      this.apellido = apellido;
      this.edad = edad;
      this.dni = dni;
      this.especialidad = especialidad;
      this.email = email;
      this.imagenPerfil = imagenPerfil;
      this.aprobado = aprobado;
    }
  
    // Método para agregar una nueva especialidad si no se encuentra en la lista
    agregarEspecialidad(nuevaEspecialidad: string) {
      if (!this.especialidad.includes(nuevaEspecialidad)) {
        this.especialidad.push(nuevaEspecialidad);
      }
    }
  }
  