import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor() { }

  private usuario: any = null;
  private usuarioPerfil: any = null;

  private usuarioKey = 'usuario';
  private perfilKey = 'usuarioPerfil';

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

  clearUsuario() {
    this.usuario = null;
    this.usuarioPerfil = null;
    localStorage.removeItem(this.usuarioKey);
    localStorage.removeItem(this.perfilKey);
  }
}
