import { trigger, transition, style, animate } from '@angular/animations';

export const slideInAnimation = trigger('slideInAnimation', [
  // Transición de bienvenida a login
  transition('bienvenida => login', [
    style({ opacity: 0, transform: 'translateX(-100%)' }),
    animate('600ms ease-in', style({ opacity: 1, transform: 'translateX(0%)' })),
  ]),

  // Transición de bienvenida a registro
  transition('bienvenida => registro', [
    style({ opacity: 0, transform: 'translateY(100%)' }), // Entra desde abajo
    animate('600ms ease-out', style({ opacity: 1, transform: 'translateY(0%)' })),
  ]),

  // Transición de registro a login
  transition('registro => login', [
    style({ opacity: 0, transform: 'scale(0.8)' }), // Escala pequeña al inicio
    animate('500ms ease-in-out', style({ opacity: 1, transform: 'scale(1)' })), // Escala normal
  ]),
]);
