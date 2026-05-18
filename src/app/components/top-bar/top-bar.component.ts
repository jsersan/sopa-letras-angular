import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-top-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './top-bar.component.html',
  styleUrl: './top-bar.component.css'
})
export class TopBarComponent implements OnInit {
  @Input() tamanio: number = 12;
  @Input() pausado: boolean = false;
  @Input() nombreUsuario: string = '';
  
  @Output() nuevoJuego = new EventEmitter<number>();
  @Output() pausar = new EventEmitter<void>();
  @Output() mostrarRecords = new EventEmitter<void>();
  @Output() salir = new EventEmitter<void>();

  tamaniosDisponibles = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
  tamanioSeleccionado = 12;

  ngOnInit() {
    this.tamanioSeleccionado = this.tamanio;
  }

  ngOnChanges() {
    this.tamanioSeleccionado = this.tamanio;
  }

  onNuevoJuego() {
    this.nuevoJuego.emit(this.tamanioSeleccionado);
  }
}

