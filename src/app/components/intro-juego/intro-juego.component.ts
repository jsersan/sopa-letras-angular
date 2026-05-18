import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-intro-juego',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './intro-juego.component.html',
  styleUrl: './intro-juego.component.css'
})
export class IntroJuegoComponent {
  @Input() tamanio: number = 12;
  @Input() nombreUsuario: string = '';
  @Output() iniciar = new EventEmitter<void>();
  @Output() cambiarTamanio = new EventEmitter<number>();

  tamaniosDisponibles = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
  tamanioSeleccionado = 12;

  onCambiarTamanio(event: any) {
    this.cambiarTamanio.emit(Number(event.target.value));
  }

  onIniciar() {
    this.iniciar.emit();
  }
}
