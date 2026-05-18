import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Celda } from '../../models/models';

@Component({
  selector: 'app-matrix-letras',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './matrix-letras.component.html',
  styleUrl: './matrix-letras.component.css'
})
export class MatrixLetrasComponent {
  @Input() sopa: Celda[][] = [];
  @Input() tamanio: number = 12;
  
  @Output() seleccionarInicio = new EventEmitter<{f: number, c: number}>();
  @Output() seleccionando = new EventEmitter<{f: number, c: number}>();
  @Output() seleccionarFin = new EventEmitter<{f: number, c: number}>();

  onMouseDown(f: number, c: number) {
    this.seleccionarInicio.emit({f, c});
  }

  onMouseEnter(f: number, c: number) {
    this.seleccionando.emit({f, c});
  }

  onMouseUp(f: number, c: number) {
    this.seleccionarFin.emit({f, c});
  }
}

