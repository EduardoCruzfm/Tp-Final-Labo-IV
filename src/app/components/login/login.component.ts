import { Component } from '@angular/core';
import {FormControl,FormGroup,FormsModule,ReactiveFormsModule,Validators} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';
import { DatabaseService } from '../../services/database.service';
 

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule,SweetAlert2Module],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  tipoUsuario: 'especialista' | 'paciente' = 'especialista'; 
  listaAdministradores :any;

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  constructor(private router: Router, private authService: AuthService, private db: DatabaseService) {
    this.db.traerUsuario('administradores').subscribe((response) => {
      this.listaAdministradores = response;
      console.log('Lista de Administradores:', this.listaAdministradores);
    });
  } 

  usuarioAdmin() {
    this.form.patchValue({
      email: 'eduardocruz.fm@gmail.com',
      password: '450253',
    });
  }

  usuarioEspecialista(){
    this.form.patchValue({
      email: 'especialista@example.com',
      password: 'especialista123'
    });
  }

  usuarioPaciente(){
    this.form.patchValue({
      email: 'paciente@example.com',
      password: 'paciente123'
    });
  }

// LoginComponent
async handleLogin() {
  if (this.form.valid) {
    const { email, password } = this.form.value;

    if (typeof email === 'string' && typeof password === 'string') {
      try {
        // Usar el AuthService para manejar el inicio de sesión
        await this.authService.login(email, password);

        // Verificar si el usuario es un administrador basado en la lista
        const esAdmin = this.listaAdministradores.some((admin: any) => 
          admin.email == email && admin.perfil == 'administrador'
        );


        if (esAdmin) {
          this.router.navigate(['/bienvenida'],{ queryParams: { tipo: 'administrador' } });   
        }
        else{
          // Verificar si el correo está verificado
          const emailVerified = await this.authService.isEmailVerified();
          if (!emailVerified) {
            await Swal.fire({
              icon: 'info',
              title: 'Verificación requerida',
              text: 'Por favor, verifica tu correo electrónico antes de continuar.',
            });
            return;
          }
        // Verificar si el usuario está aprobado
          const resultado = await this.authService.verificarAprobacionUsuarioActual(this.tipoUsuario);

          if (resultado.aprobado) {
            this.form.get('email')?.setValue('');
            this.form.get('password')?.setValue('');

            await Swal.fire({
              title: 'Éxito!',
              text: 'Inicio de sesión exitoso!',
              icon: 'success',
            });
            
            //Temporamente
            if (resultado.tipo === 'especialistas') {
              this.router.navigate(['/bienvenida']); 
            } else if (resultado.tipo === 'pacientes') {
              this.router.navigate(['/bienvenida']);
            }

          } else {
            await Swal.fire({
              icon: 'warning',
              title: 'Acceso denegado',
              text: 'Su cuenta no ha sido aprobada aún.',
            });
          }
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

  // Método para manejar el cambio de tipo de usuario
  onTipoUsuarioChange(tipo: 'especialista' | 'paciente') {
    this.tipoUsuario = tipo;
}

}
