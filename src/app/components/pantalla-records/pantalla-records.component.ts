import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirestoreService } from '../../services/firestore.service';

interface Record {
  userName: string;
  segundos: number;
  fecha: any;
}

@Component({
  selector: 'app-pantalla-records',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pantalla-records.component.html',
  styleUrl: './pantalla-records.component.css'
})
export class PantallaRecordsComponent implements OnInit {
  @Input() mostrar: boolean = false;
  @Input() usuarioId: string = '';
  @Output() cerrar = new EventEmitter<void>();

  tamanioSeleccionado: number = 8;
  tamaniosDisponibles = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
  records: Record[] = [];
  cargando = false;

  constructor(private firestoreService: FirestoreService) {}

  ngOnInit() {
    if (this.mostrar) {
      this.cargarRecords();
    }
  }

  ngOnChanges() {
    if (this.mostrar) {
      this.cargarRecords();
    }
  }

  async cargarRecords() {
    this.cargando = true;
    try {
      const resultado = await this.firestoreService.obtenerRankingGlobal(this.tamanioSeleccionado);
      if (resultado.success && resultado.ranking) {
        this.records = resultado.ranking.slice(0, 10);
      } else {
        this.records = [];
      }
    } catch (error) {
      console.error('Error cargando récords:', error);
      this.records = [];
    }
    this.cargando = false;
  }

  cambiarTamanio(tamanio: number) {
    this.tamanioSeleccionado = tamanio;
    this.cargarRecords();
  }

  formatearTiempo(segundos: number): string {
    if (!segundos || isNaN(segundos)) {
      return '00:00:00';
    }
    
    const s = segundos % 60;
    const m = Math.floor((segundos - s) / 60) % 60;
    const h = Math.floor((segundos - (m * 60) - s) / 3600);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }

  formatearFecha(fecha: any): string {
    if (!fecha) return '--';
    try {
      const f = fecha.toDate ? fecha.toDate() : new Date(fecha);
      return f.toLocaleDateString('es-ES');
    } catch (error) {
      return '--';
    }
  }

  esUsuarioActual(index: number): boolean {
    return this.records[index]?.userName === this.usuarioId;
  }

  onCerrar() {
    this.cerrar.emit();
  }
}
