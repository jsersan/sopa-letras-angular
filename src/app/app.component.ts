import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
import { PantallaLoginComponent } from './components/pantalla-login/pantalla-login.component';
import { SopaLetrasComponent } from './components/sopa-letras/sopa-letras.component';
import { User } from 'firebase/auth';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, PantallaLoginComponent, SopaLetrasComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  usuario: User | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.usuario = user;
    });
  }
}

