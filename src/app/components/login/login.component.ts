import { Component } from '@angular/core';
import {FormControl,FormGroup,FormsModule,ReactiveFormsModule,Validators} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';
import { DatabaseService } from '../../services/database.service';
import { UsuarioService } from '../../services/usuario.service';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule,SweetAlert2Module,CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  animations: [
    trigger('fadeAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('500ms', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('500ms', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class LoginComponent {

  listaAdministradores: any;
  listaEspecialistas: any;
  listaPacientes: any;
  usuarioActual: any

   // Variable para almacenar el CAPTCHA generado
  generatedCaptcha: string = '';

  // Variable para almacenar el valor ingresado por el usuario
  captchaInput: string = '';
  
  // Mensaje de error de CAPTCHA
  captchaError: boolean = false;
  mostrarLogin: boolean = true; 

  // Registro del logue
  anioActual: number = new Date().getFullYear();
  fechaActual = new Date();
  mesActual = this.fechaActual.getMonth(); 



  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  constructor(private router: Router, private authService: AuthService, private db: DatabaseService,private usuarioService: UsuarioService) {
    this.traerAdministradores();
    this.traerEspecialistas();
    this.traerPacientes();
  } 

  ngOnInit(): void {
    // Generar el CAPTCHA cuando se carga el componente        ->>> crear log basico

    this.generateCaptcha();
  }

  traerAdministradores(){
    this.db.traerUsuario('administradores').subscribe((response) => {
      this.listaAdministradores = response;
      // console.log('Lista de Administradores:', this.listaAdministradores);
    });
  }
  traerEspecialistas(){
    this.db.traerUsuario('especialistas').subscribe((response) => {
      this.listaEspecialistas = response;
      // console.log('Lista de Especialistas:', this.listaAdministradores);
    });
  }
  traerPacientes(){
    this.db.traerUsuario('pacientes').subscribe((response) => {
      this.listaPacientes = response;
      // console.log('Lista de Pacientes:', this.listaAdministradores);
    });
  }


  usuarioAdmin() {
    this.form.patchValue({
      email: 'eduardocruz.fm@gmail.com',
      password: '450253',
    });
  }
  usuarioEspecialista1(){
    this.form.patchValue({
      email: 'eduardofrankcruzmendez@gmail.com',
      password: '450253'
    });
  }
  usuarioEspecialista2(){
    this.form.patchValue({
      // email: 'arturo@example.com',
      email: 'zonyohq406@dollarurl.com',
      password: '450253'
    });
  }
  usuarioPaciente(){
    this.form.patchValue({
      email: 'educacionflash@gmail.com',
      password: '450253'
    });
  }
  usuarioPaciente2(){
    this.form.patchValue({
      email: 'tarefo7577@opposir.com',
      password: '450253'
    });
  }
  usuarioPaciente3(){
    this.form.patchValue({
      email: 'academyxok@gmail.com',
      password: '450253'
    });
  }

  asignarContrasenia(usuario: any){
    if (usuario && usuario.email) {

      switch (usuario.email) {
        case 'eduardocruz.fm@gmail.com':
            this.usuarioAdmin();
          break;
        case 'eduardofrankcruzmendez@gmail.com':
            this.usuarioEspecialista1();
          break;
        case 'educacionflash@gmail.com':
            this.usuarioPaciente();
          break;
        case 'zonyohq406@dollarurl.com':
            this.usuarioEspecialista2();
          break;
        case 'tarefo7577@opposir.com':
            this.usuarioPaciente2();
          break;
        case 'academyxok@gmail.com':
            this.usuarioPaciente3();
          break;
      
        default:
          break;
      }

    } else {
      console.log(`Contraseña asignada a ${usuario.correo}: ${usuario.contraseña}`);
      // console.error("No se pudo asignar contraseña, usuario sin correo.");
    }
  }

// LoginComponent
async handleLogin() {

  // Validar CAPTCHA antes de proceder con el login
  // if (!this.validateCaptcha()) {

  //   await Swal.fire({
  //     icon: 'warning',
  //     title: 'El CAPTCHA es incorrecto',
  //     text: 'Por favor, inténtalo de nuevo.',
  //   });
  //   return;
  // }


  if (this.form.valid) {
    const { email, password } = this.form.value;

    if (typeof email === 'string' && typeof password === 'string') {
      try {
        await this.authService.login(email, password);
        
        const esAdmin = this.listaAdministradores.some((admin: any) => 
          admin.email == email && admin.perfil == 'administrador'
        );
        const esEspecialista = this.listaEspecialistas.some((admin: any) => 
          admin.email == email && admin.perfil == 'especialista'
        );
        const esPaciente = this.listaPacientes.some((admin: any) => 
          admin.email == email && admin.perfil == 'paciente'
        );

        if (esAdmin) {
          this.registrarLogs();
          this.router.navigate(['/bienvenida'],{ queryParams: { tipo: 'administradores' } });  
          this.mostrarLogin = false; 
          this.usuarioService.setUsuarioPerfil('administradores');   
        }
        else if(esEspecialista && await this.emailVerified()){
          this.registrarLogs();
          // this.obtenerUsuario("especialistas");
          // console.log("Del log: ", this.usuarioActual);
         
          const resultado = await this.authService.verificarAprobacionUsuarioActual("especialista");
          if (resultado.aprobado) {

            await Swal.fire({
              title: 'Éxito!',
              text: 'Inicio de sesión exitoso!',
              icon: 'success',
            });
            
            this.router.navigate(['/bienvenida'],{ queryParams: { tipo: 'especialistas' } });
            this.mostrarLogin = false; 
            this.usuarioService.setUsuarioPerfil('especialistas');   

          } else {
            await Swal.fire({
              icon: 'warning',
              title: 'Acceso denegado',
              text: 'Su cuenta no ha sido aprobada aún.',
            });
          }
          
          this.setterForms();
        }
        else if(esPaciente && await this.emailVerified()){
          this.registrarLogs();
          this.setterForms();
          this.router.navigate(['/bienvenida'],{ queryParams: { tipo: 'pacientes' } });
          this.mostrarLogin = false; 
          this.usuarioService.setUsuarioPerfil('pacientes');   

        }
      } catch (error) {
        // Mostrar alerta en caso de error de autenticación
        await Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Correo o contraseña incorrectos. Por favor, intenta de nuevo!',
          footer: '<a href="#">Why do I have this issue?</a>',
        });
        console.error('Error al iniciar sesión:', error);
      }
    } else {
      await Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Correo electrónico o contraseña inválidos!',
        footer: '<a href="#">Why do I have this issue?</a>',
      });
    }
  } else {
    await Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Formulario inválido!',
      footer: '<a href="#">Why do I have this issue?</a>',
    });
  }
}

  setterForms(){
    this.form.get('email')?.setValue('');
    this.form.get('password')?.setValue('');
  }

  // Verificar si el correo está verificado
  async emailVerified():Promise<boolean>{
    const emailVerified = await this.authService.isEmailVerified();
    if (!emailVerified) {
      await Swal.fire({
        icon: 'info',
        title: 'Verificación requerida',
        text: 'Por favor, verifica tu correo electrónico antes de continuar.',
      });
      return false;
    }
    return true;
  }

   obtenerUsuario(perfil: string){
    const User =  this.authService.getCurrentUser();
    if (User) {
      this.usuarioActual =  this.db.obtenerUsuarioPorId(User.uid, perfil);
    }
    else{
      console.log("ERROR -> ", User);
    } 
  }


registrarLogs() {
  const User = this.authService.getCurrentUser();
  if (User) {
    const fechaActual = new Date();
    const dia = fechaActual.getDate();
    const mesDigito = fechaActual.getMonth(); // Mes en formato de número (0-11)
    const anio = fechaActual.getFullYear();
    const hora = formatDate(fechaActual, 'HH:mm:ss', 'en-US'); // Hora en formato HH:mm:ss

    // Mapa de meses para convertir el número a cadena
    const mesesCadena = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    const mesCadena = mesesCadena[mesDigito];

    const log = {
      idUsuario: User.uid,
      dia: dia,
      mes: {
        cadena: mesCadena,
        digito: mesDigito
      },
      hora: hora,
      anio: anio
    };

    console.log(log);
    
    this.db.agregarLog(log,'logs');

  } else {
    console.log("ERROR -> ", User);
  }
}

   // Función para generar un CAPTCHA aleatorio
   generateCaptcha(): void {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let captchaText = '';

    // Generar un texto aleatorio de 6 caracteres
    for (let i = 0; i < 6; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      captchaText += characters[randomIndex];
    }

    // Asignar el CAPTCHA generado a la variable
    this.generatedCaptcha = captchaText;
  }

  // Función para validar el CAPTCHA ingresado
  validateCaptcha(): boolean {
    console.log(this.captchaInput);
    console.log(this.generatedCaptcha);
    
    if (this.captchaInput === this.generatedCaptcha) {
      this.captchaError = false;  // CAPTCHA válido
      return true;
    } else {
      this.captchaError = true;   // CAPTCHA incorrecto
      return false;
    }

  }



}

//CAMBIAR EL BOTON DE LOGIN
// 1
// * Botones de Acceso rápido
// - Deben ser botones redondos
// - Deben tener la imagen de perfil del usuario
// - Deben estar abajo del login, uno al lado del otro, 6 usuarios (3 pacientes, 2 especialistas, 1 admin)

// * Registro de usuarios
// - Al ingresar a la página solo se deben ver 2 imágenes que represente a un paciente o especialista,
// según esa elección mostrará un formulario correspondiente.
// - Estas imágenes deben estar en botones redondos.


// 2
// * Sacar un turno
//  - Comienza mostrando en las ESPECIALIDADES botones con la imagen de la especialidad,
//  en caso de no tener muesra imagen por default. Deben ser botones redondos sin el nombre de la especialidad

//  - Una vez seleccionada mostrará los PROFESIONALES, en botones con la imagen de perfil de cada profesional y 
//  su nombre debajo. Estos botones deben ser redondos.

// - Una vez seleccionado el profesional, aparecerán los días con turnos disponibles para ese PROFESIONAL.
//  Estos botones deben ser rectangulares. Formato (09/09).

//  - Seleccionado el día mostrará los horarios disponibles. Estos botones deben ser rectangulares. Formato 12:15am,.

// 3
