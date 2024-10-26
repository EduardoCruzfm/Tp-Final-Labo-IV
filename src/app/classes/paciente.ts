export class Paciente {
    id: string;
    nombre: string;
    apellido: string;
    edad: number;
    dni: string;
    obraSocial: string;
    email: string;
    imagenPerfil1: string; 
    imagenPerfil2: string; 
    aprobado: boolean;
    
    constructor(id: string,nombre: string,apellido: string,edad: number,dni: string,obraSocial: string,email: string, 
        imagenPerfil1: string,imagenPerfil2: string,aprobado: boolean) {
            
        this.id = id;
        this.nombre = nombre;
        this.apellido = apellido;
        this.edad = edad;
        this.dni = dni;
        this.obraSocial = obraSocial;
        this.email = email;
        this.imagenPerfil1 = imagenPerfil1;
        this.imagenPerfil2 = imagenPerfil2;
        this.aprobado = aprobado;
    }
      
      
}
