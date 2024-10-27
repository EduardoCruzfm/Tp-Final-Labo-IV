export class Paciente {
    id: string;
    nombre: string;
    apellido: string;
    edad: number;
    dni: string;
    obraSocial: string;
    email: string;
    imagenPerfil: string; 
    imagenPerfil2: string; 
    aprobado: boolean;
    perfil:string;
    
    constructor(id: string,nombre: string,apellido: string,edad: number,dni: string,obraSocial: string,email: string, 
        imagenPerfil: string,imagenPerfil2: string,aprobado: boolean, perfil:string) {
            
        this.id = id;
        this.nombre = nombre;
        this.apellido = apellido;
        this.edad = edad;
        this.dni = dni;
        this.obraSocial = obraSocial;
        this.email = email;
        this.imagenPerfil = imagenPerfil;
        this.imagenPerfil2 = imagenPerfil2;
        this.aprobado = aprobado;
        this.perfil = perfil;
    }
      
      
}
