import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cronometro',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cronometro.component.html',
  styleUrl: './cronometro.component.css'
})
export class CronometroComponent implements OnInit, OnDestroy {
  @Input() tiempoInicio: number = 0;
  @Input() tiempoAcumulado: number = 0;
  @Input() pausado: boolean = false;

  tiempoActual: number = Date.now();
  private interval: any;

  ngOnInit() {
    this.interval = setInterval(() => {
      if (!this.pausado) {
        this.tiempoActual = Date.now();
      }
    }, 100);
  }

  ngOnDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  get tiempoFormateado(): string {
    let tiempo: number;
    if (this.pausado) {
      tiempo = this.tiempoAcumulado;
    } else {
      tiempo = this.tiempoActual - this.tiempoInicio + this.tiempoAcumulado;
    }
    
    const segundosTotales = Math.floor(tiempo / 1000);
    const s = segundosTotales % 60;
    const m = Math.floor((segundosTotales - s) / 60) % 60;
    const h = Math.floor((segundosTotales - (m * 60) - s) / 3600);
    
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }
}

