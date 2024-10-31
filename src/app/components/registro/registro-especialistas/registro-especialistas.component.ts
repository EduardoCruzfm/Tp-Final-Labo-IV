import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import Swal from 'sweetalert2';
import { AuthService } from '../../../services/auth.service';
import { DatabaseService } from '../../../services/database.service'; 
import { Especialista } from '../../../classes/especialista';


@Component({
  selector: 'app-registro-especialistas',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, SweetAlert2Module, CommonModule],
  templateUrl: './registro-especialistas.component.html',
  styleUrls: ['./registro-especialistas.component.css']
})
export class RegistroEspecialistasComponent {
  selectedFile: File | null = null;
  especialidadesDisponibles: string[] = ['Cardiología', 'Pediatría', 'Neurología', 'Dermatología']; 
  especialidadPersonalizada: string = '';
  selectedEspecialidades: Set<string> = new Set();

  form = new FormGroup({
    nombre: new FormControl('', [Validators.required]),
    apellido: new FormControl('', [Validators.required]),
    edad: new FormControl('', [Validators.required,Validators.min(1)]),
    dni: new FormControl('', [Validators.required]),
    especialidades: new FormControl([] as string[], [Validators.required]),
    especialidadPersonalizada: new FormControl(''),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  constructor(private router: Router, private authService: AuthService, private db: DatabaseService) { }
    
  async handleRegister() {
    if (this.form.valid && this.selectedFile) {
      const { nombre, apellido, edad, dni, especialidades, email, password } = this.form.value;
      
      let especialidadesSeleccionadas: string[] = [];
      
      // Obtén el valor del FormControl `especialidades`
      const especialidadSeleccionada = this.form.value.especialidades as string[];
      
      // Asegúrate de que el usuario no seleccione más de 3 especialidades
      if (especialidadSeleccionada.length > 3) {
        await Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Solo puedes seleccionar hasta 3 especialidades!',
        });
        return; 
      }
  
      // Agregar especialidad personalizada si no está en las disponibles
      if (this.especialidadPersonalizada && !this.especialidadesDisponibles.includes(this.especialidadPersonalizada)) {
        especialidadesSeleccionadas.push(this.especialidadPersonalizada);
      }
      
      // Concatenar las especialidades seleccionadas
      if (Array.isArray(especialidadSeleccionada)) {
        especialidadesSeleccionadas = especialidadesSeleccionadas.concat(especialidadSeleccionada);
      }
    
      if (typeof nombre === 'string' && typeof apellido === 'string' && typeof edad === 'number' && 
        typeof dni === 'number' && typeof email === 'string' && typeof password === 'string') {
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
              const especialista: Especialista = new Especialista(userId, nombre, apellido, edad, dni, especialidadesSeleccionadas, email, fotoUrl, false,"especialista",[]);
              await this.db.agregarUsuario(especialista, 'especialistas');
            }
  
            // Mostrar mensaje de éxito en el registro
            await Swal.fire({
              title: 'Registro exitoso!',
              text: 'Te hemos enviado un correo de verificación. Por favor, verifica tu correo electrónico antes de iniciar sesión.',
              icon: 'success',
            });
  
            // Redirigir al inicio de sesión (opcional)
            this.router.navigate(['/login']);
  
          } catch (error: any) {
            // Manejo de errores
            if (error.code === 'auth/email-already-in-use') {
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
              });
            }
          }
      } else {
        await Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Formulario inválido!',
        });
      }
    } else {
      await Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Formulario inválido!',
      });
    }
  }
  
  

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  onEspecialidadChange(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    const especialidad = checkbox.value;

    if (checkbox.checked) {
      this.selectedEspecialidades.add(especialidad); // Agrega la especialidad si está seleccionada
    } else {
      this.selectedEspecialidades.delete(especialidad); // Elimina la especialidad si no está seleccionada
    }

    // Actualiza el control del formulario con las especialidades seleccionadas
    this.form.patchValue({ especialidades: Array.from(this.selectedEspecialidades) });
  }
  
  
}
