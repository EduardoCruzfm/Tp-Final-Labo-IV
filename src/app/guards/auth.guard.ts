import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  let userLoggedIn: boolean = false; // Estado de autenticación
  const authService = inject(AuthService);

  // Suscribirse a los cambios de estado de autenticación
  authService.userLoggedIn$.subscribe((isLoggedIn) => {
    userLoggedIn = isLoggedIn;
  });

  return userLoggedIn;
};
