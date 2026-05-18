import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { FirestoreService } from '../../services/firestore.service';

@Component({
  selector: 'app-pantalla-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pantalla-login.component.html',
  styleUrl: './pantalla-login.component.css'
})
export class PantallaLoginComponent {
  modo: 'login' | 'registro' = 'login';
  email = '';
  password = '';
  displayName = '';
  cargando = false;
  error = '';

  constructor(
    private authService: AuthService,
    private firestoreService: FirestoreService
  ) {}

  async iniciarSesion() {
    if (!this.email || !this.password) {
      this.error = 'Por favor completa todos los campos';
      return;
    }

    this.cargando = true;
    this.error = '';

    const result = await this.authService.iniciarSesion(this.email, this.password);
    
    this.cargando = false;

    if (!result.success) {
      this.error = 'Error al iniciar sesión. Verifica tus credenciales.';
    }
  }

  async registrarse() {
    if (!this.email || !this.password || !this.displayName) {
      this.error = 'Por favor completa todos los campos';
      return;
    }

    if (this.password.length < 6) {
      this.error = 'La contraseña debe tener al menos 6 caracteres';
      return;
    }

    this.cargando = true;
    this.error = '';

    const result = await this.authService.registrarUsuario(
      this.email,
      this.password,
      this.displayName
    );

    if (result.success && result.user) {
      await this.firestoreService.crearPerfilUsuario(
        result.user.uid,
        this.displayName,
        this.email
      );
    } else {
      this.error = 'Error al registrarse. El email puede estar en uso.';
    }

    this.cargando = false;
  }

  async iniciarSesionGoogle() {
    this.cargando = true;
    this.error = '';

    const result = await this.authService.iniciarSesionGoogle();
    
    if (result.success && result.user) {
      await this.firestoreService.crearPerfilUsuario(
        result.user.uid,
        result.user.displayName || 'Usuario',
        result.user.email || ''
      );
    } else {
      this.error = 'Error al iniciar sesión con Google';
    }

    this.cargando = false;
  }

  cambiarModo() {
    this.modo = this.modo === 'login' ? 'registro' : 'login';
    this.error = '';
  }
}

