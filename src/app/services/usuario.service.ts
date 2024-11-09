import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor() { }

  private usuario: any = null;
  private usuarioPerfil: any = null;
  private especialista: any = null;
  private turno: any = null;
  
  private usuarioKey = 'usuario';
  private perfilKey = 'usuarioPerfil';
  private especialistaKey = 'especialista';
  private turnoKey = 'turno';

  setUsuario(usuario: any) {
    this.usuario = usuario;
    localStorage.setItem(this.usuarioKey, JSON.stringify(usuario));
  }

  getUsuario() {
    if (this.usuario) {
      return this.usuario;
    }
    // Recuperar el usuario desde localStorage si está disponible
    const usuario = localStorage.getItem(this.usuarioKey);
    return usuario ? JSON.parse(usuario) : null;
  }
  
  setUsuarioPerfil(perfil: string) {
    this.usuarioPerfil = perfil;
    localStorage.setItem(this.perfilKey, perfil);
  }
  
  getUsuarioPerfil() {
    if (this.usuarioPerfil) {
      return this.usuarioPerfil;
    }
    // Recuperar el perfil desde localStorage si está disponible
    return localStorage.getItem(this.perfilKey);
  }
  
  setEspecialista(especialista: any) {
    this.especialista = especialista;
    localStorage.setItem(this.especialistaKey, JSON.stringify(especialista));
  }
  
  getEspecialista() {
    if (this.especialista) {
      return this.especialista;
    }
    // Recuperar el perfil desde localStorage si está disponible
    return localStorage.getItem(this.especialistaKey);
  }

  setTurno(turno: any) {
    this.turno = turno;
    localStorage.setItem(this.turnoKey, JSON.stringify(turno));
  }
  
  getTurno() {
    if (this.turno) {
      return this.turno;
    }
    // Recuperar el perfil desde localStorage si está disponible
    return localStorage.getItem(this.turnoKey);
  }

  clearUsuario() {
    this.usuario = null;
    this.usuarioPerfil = null;
    localStorage.removeItem(this.usuarioKey);
    localStorage.removeItem(this.perfilKey);
  }
}
