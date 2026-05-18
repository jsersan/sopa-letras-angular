import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Palabra } from '../../models/models';

@Component({
  selector: 'app-lista-palabras',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lista-palabras.component.html',
  styleUrl: './lista-palabras.component.css'
})
export class ListaPalabrasComponent {
  @Input() palabras: Palabra[] = [];

  getPalabraTexto(palabra: Palabra): string {
    return palabra.texto.toUpperCase();
  }
}

