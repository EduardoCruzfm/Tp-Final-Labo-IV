export class Administrador {
    id: string;
    nombre: string;
    apellido: string;
    edad: number;
    dni: string;
    email: string;
    imagenPerfil: string;
    perfil:string;
  
    constructor(id: string,nombre: string,apellido: string,edad: number,dni: string, email: string,imagenPerfil: string,perfil:string) {
      this.id = id;
      this.nombre = nombre;
      this.apellido = apellido;
      this.edad = edad;
      this.dni = dni;
      this.email = email;
      this.imagenPerfil = imagenPerfil;
      this.perfil = perfil;
    }
  }
  