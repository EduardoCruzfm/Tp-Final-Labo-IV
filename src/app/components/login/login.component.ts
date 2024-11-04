import { Component } from '@angular/core';
import {FormControl,FormGroup,FormsModule,ReactiveFormsModule,Validators} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';
import { DatabaseService } from '../../services/database.service';
import { CommonModule } from '@angular/common';
 

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule,SweetAlert2Module,CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  listaAdministradores: any;
  listaEspecialistas: any;
  listaPacientes: any;
  usuarioActual: any

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });
i: any;

  constructor(private router: Router, private authService: AuthService, private db: DatabaseService) {
    this.traerAdministradores();
    this.traerEspecialistas();
    this.traerPacientes();
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
      email: 'arturo@example.com',
      password: '456456'
    });
  }

  usuarioPaciente(){
    this.form.patchValue({
      email: 'educacionflash@gmail.com',
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
        case 'arturo@example.com':
            this.usuarioEspecialista2();
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
          this.router.navigate(['/bienvenida'],{ queryParams: { tipo: 'administradores' } });   
        }
        else if(esEspecialista && await this.emailVerified()){

          this.obtenerUsuario("especialistas");
          console.log("Del log: ", this.usuarioActual);
         
          const resultado = await this.authService.verificarAprobacionUsuarioActual("especialista");
          if (resultado.aprobado) {

            await Swal.fire({
              title: 'Éxito!',
              text: 'Inicio de sesión exitoso!',
              icon: 'success',
            });
            
            this.router.navigate(['/bienvenida'],{ queryParams: { tipo: 'especialistas' } });
            // por state 

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
          // this.emailVerified();
          this.setterForms();
          this.router.navigate(['/bienvenida'],{ queryParams: { tipo: 'pacientes' } });

        
          //-----
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
    const User = this.authService.getCurrentUser();
    if (User) {
      this.usuarioActual =  this.db.obtenerUsuarioPorId(User.uid, perfil);
    }
    else{
      console.log("ERROR -> ", User);
    } 
  }

}

//CAMBIAR EL BOTON DE LOGIN

// * Botones de Acceso rápido
// - Deben ser botones redondos
// - Deben tener la imagen de perfil del usuario
// - Deben estar abajo del login, uno al lado del otro, 6 usuarios (3 pacientes, 2 especialistas, 1 admin)

// * Registro de usuarios
// - Al ingresar a la página solo se deben ver 2 imágenes que represente a un paciente o especialista,
// según esa elección mostrará un formulario correspondiente.
// - Estas imágenes deben estar en botones redondos.