import { Component } from '@angular/core';
import {FormControl, FormGroup,FormsModule,ReactiveFormsModule,Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import Swal from 'sweetalert2';
import { AuthService } from '../../../services/auth.service';
import { DatabaseService } from '../../../services/database.service'; 
import { Paciente } from '../../../classes/paciente';

@Component({
  selector: 'app-registro-pacientes',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, SweetAlert2Module],
  templateUrl: './registro-pacientes.component.html',
  styleUrl: './registro-pacientes.component.css'
})
export class RegistroPacientesComponent {
  selectedFile: File | null = null;
  selectedFileDos: File | null = null;

  form = new FormGroup({
    nombre: new FormControl('', [Validators.required]),
    apellido: new FormControl('', [Validators.required]),
    edad: new FormControl('', [Validators.required]),
    dni: new FormControl('', [Validators.required]),
    obraSocial: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  constructor(private router: Router, private authService: AuthService, private db:DatabaseService ) {} 

  // Registrar
  async handleRegister() {
    if (this.form.valid  && this.selectedFile && this.selectedFileDos)  {
      const { nombre,apellido,edad,dni,obraSocial,email,password } = this.form.value;

      if (typeof nombre === 'string' && typeof apellido === 'string' &&  typeof edad === 'number' && 
          typeof dni === 'number' && typeof obraSocial === 'string' && typeof email === 'string' && 
          typeof password === 'string') {
        try {

          const fotoUrl = await this.db.subirImagen(this.selectedFile);
          const fotoUrl2 = await this.db.subirImagen(this.selectedFileDos);
          
          await this.authService.register(email,password).then((userCredential) => {
            const userId = userCredential.user?.uid;
            
            // Agregar el nombre y otros detalles a Firestore
            if (userId) {

              const paciente: Paciente = new Paciente( userId,nombre,apellido,edad,dni,obraSocial,email,fotoUrl,fotoUrl2);
              this.db.agregarUsuario(paciente,'pacientes');
            }
          });
          
          await Swal.fire({
            title: 'Éxito!',
            text: 'Registro exitoso!',
            icon: 'success',
          });
          this.router.navigate(['/bienvenida']);
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

  onFileSelectedPortada(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFileDos = input.files[0];
      console.log('Archivo seleccionado:', this.selectedFileDos);
    }
  }


}
