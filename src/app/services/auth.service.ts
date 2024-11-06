import { Injectable } from '@angular/core';
import { Auth,signInWithEmailAndPassword, onAuthStateChanged,createUserWithEmailAndPassword, sendEmailVerification , User, UserCredential, signOut} from '@angular/fire/auth';
import { BehaviorSubject } from 'rxjs';
import { DatabaseService } from './database.service';



@Injectable({
  providedIn: 'root'
})
export class AuthService {
   private usuario:any;

  private userLoggedInSubject = new BehaviorSubject<boolean>(false);
  private userEmailSubject = new BehaviorSubject<string | null>(null);

  userLoggedIn$ = this.userLoggedInSubject.asObservable();
  userEmail$ = this.userEmailSubject.asObservable();

    constructor(private auth: Auth, private db: DatabaseService) {
    this.checkAuthState();
  }

  // Verifica el estado de autenticación del usuario
  private checkAuthState() {

    onAuthStateChanged(this.auth, (user: User | null) => {
      const isLoggedIn = !!user;
      const email = user ? user.email : null;
      console.log('Usuario autenticado:', isLoggedIn, 'Email:', email); // test
      this.userLoggedInSubject.next(isLoggedIn); // Actualiza el estado de autenticación
      this.userEmailSubject.next(email); // Actualiza el correo del usuario
    });
  }

  // Método para obtener el estado del usuario logueado directamente
  isLoggedIn(): boolean {
    return this.userLoggedInSubject.value;
  }

  // Método para iniciar sesión 
  login(email: string, password: string): Promise<UserCredential> {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  // Método para registrar usuario
  register(email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  // Método para cerrar sesión
  logout(): Promise<void> {
    return signOut(this.auth);
  }

   // Devuelve el usuario actual
   getCurrentUser(): User | null {
    return this.auth.currentUser; 
  }
  
  // Método para verificar la aprobación del usuario por administrador
  async verificarAprobacion(uid: string, tipoUsuario: 'especialistas' | 'pacientes'): Promise<boolean> {
    try {
      const usuario = await this.db.obtenerUsuarioPorId(uid, tipoUsuario);
      console.log(usuario);
      console.log(usuario.aprobado);

      if (usuario && usuario.aprobado === true) {
        return true;
      }
    } catch (error) {
      console.error('Error verificando la aprobación:', error);
    }

    return false;
  }

  // Método para verificar la aprobación del usuario autenticado actual
  async verificarAprobacionUsuarioActual(tipoUsuario: string): Promise<{ aprobado: boolean; tipo: 'especialistas' | 'pacientes' | null }> {
    const currentUser = this.getCurrentUser();
    if (currentUser) {

      switch (tipoUsuario) {
        case 'paciente':
          const esPaciente = await this.verificarAprobacion(currentUser.uid, 'pacientes');
          if (esPaciente) {
            return { aprobado: true, tipo: 'pacientes' };
          }
          break;
        case 'especialista':
          const esEspecialista = await this.verificarAprobacion(currentUser.uid, 'especialistas');
          if (esEspecialista) {
            return { aprobado: true, tipo: 'especialistas' };
          }
          break;      
      }
    }
    return { aprobado: false, tipo: null };
  }

  // Envia verificacion al correo
  async sendVerificationEmail(user: User): Promise<void> {
    try {
      await sendEmailVerification(user);
      console.log('Correo de verificación enviado');
    } catch (error) {
      console.error('Error al enviar el correo de verificación:', error);
      throw error; // Lanza el error para manejarlo en el componente si es necesario
    }
  }

  // Verifica el correo
  async isEmailVerified(): Promise<boolean> {
    const currentUser: User | null = this.auth.currentUser;
    if (currentUser) {
      await currentUser.reload(); // Recargar datos del usuario actual
      return currentUser.emailVerified;
    }
    return false;
  }
}
