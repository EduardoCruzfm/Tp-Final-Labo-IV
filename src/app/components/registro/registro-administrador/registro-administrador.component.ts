import { Component } from '@angular/core';
import {FormControl, FormGroup,FormsModule,ReactiveFormsModule,Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import Swal from 'sweetalert2';
import { AuthService } from '../../../services/auth.service';
import { DatabaseService } from '../../../services/database.service'; 
import { Administrador } from '../../../classes/administrador';
import { trigger, transition, style, animate } from '@angular/animations';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-registro-administrador',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, SweetAlert2Module,CommonModule],
  templateUrl: './registro-administrador.component.html',
  styleUrl: './registro-administrador.component.css',
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
export class RegistroAdministradorComponent {
  
  // ver como agregamos un nuevo admin ala bd y leerlo antes del login

  selectedFile: File | null = null;
  mostrarLogin: boolean = true; 


  form = new FormGroup({
    nombre: new FormControl('', [Validators.required]),
    apellido: new FormControl('', [Validators.required]),
    edad: new FormControl('', [Validators.required]),
    dni: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  constructor(private router: Router, private authService: AuthService, private db:DatabaseService ) {} 

  // Registrar
  async handleRegister() {
    if (this.form.valid  && this.selectedFile)  {
      const { nombre,apellido,edad,dni,email,password } = this.form.value;

      if (typeof nombre === 'string' && typeof apellido === 'string' &&  typeof edad === 'number' && 
          typeof dni === 'number' && typeof email === 'string' && 
          typeof password === 'string') {
        try {

          const fotoUrl = await this.db.subirImagen(this.selectedFile);
          
          // Registrar al usuario y enviar el correo de verificación
            const userCredential = await this.authService.register(email, password);
            const userId = userCredential.user?.uid;
            
             // Enviar el correo de verificación utilizando el método del servicio
            if (userCredential.user) {
              await this.authService.sendVerificationEmail(userCredential.user);
            }
  
            if (userId) {
              const administrador: Administrador = new Administrador( userId,nombre,apellido,edad,dni,email,fotoUrl,"administrador");
              await this.db.agregarUsuario(administrador,'administradores');
            }
  
            // Mostrar mensaje de éxito en el registro
            await Swal.fire({
              title: 'Registro exitoso!',
              text: 'Hemos enviado un correo de verificación. Por favor, verifica el correo electrónico antes de iniciar sesión.',
              icon: 'success',
            });
  
            // Redirigir al inicio de sesión (opcional)
            this.router.navigate(['/login']);
          

        } catch (error: any) {
          if (error.code === 'auth/email-already-in-use') {
            // Manejo específico cuando el correo ya está registrado
            await Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'El correo electrónico ya está en uso!',
            });
          } else {
            await Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Error al registrarse. Por favor, intenta de nuevo!',
              footer: '<a href="#">Why do I have this issue?</a>',
            });
          }
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

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      console.log('Archivo seleccionado:', this.selectedFile);
    }
  }

}
