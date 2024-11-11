import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css',
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
export class RegistroComponent {
  mostrarLogin: boolean = true; 
  
  constructor(private router: Router) {}

  seleccionarPaciente() {
    this.router.navigate(['/registro-pacientes']);
  }

  seleccionarEspecialista() {
    this.router.navigate(['/registro-especialistas']);
  }


}
