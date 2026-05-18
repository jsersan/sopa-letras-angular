import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from 'firebase/auth';
import { IntroJuegoComponent } from '../intro-juego/intro-juego.component';
import { TopBarComponent } from '../top-bar/top-bar.component';
import { MatrixLetrasComponent } from '../matrix-letras/matrix-letras.component';
import { ListaPalabrasComponent } from '../lista-palabras/lista-palabras.component';
import { CronometroComponent } from '../cronometro/cronometro.component';
import { PantallaRecordsComponent } from '../pantalla-records/pantalla-records.component';
import { Celda, Palabra } from '../../models/models';
import { palabras } from '../../services/recursos';
import { AuthService } from '../../services/auth.service';
import { FirestoreService } from '../../services/firestore.service';

@Component({
  selector: 'app-sopa-letras',
  standalone: true,
  imports: [
    CommonModule,
    IntroJuegoComponent,
    TopBarComponent,
    MatrixLetrasComponent,
    ListaPalabrasComponent,
    CronometroComponent,
    PantallaRecordsComponent
  ],
  templateUrl: './sopa-letras.component.html',
  styleUrl: './sopa-letras.component.css'
})
export class SopaLetrasComponent implements OnInit {
  @Input() usuario!: User;

  alfabeto = 'ABDEFGHIJLMNÑOPQRSTUXYZ';
  juegoIniciado = false;
  sopa: Celda[][] = [];
  palabras: Palabra[] = [];
  tamanio = 12;
  tiempoInicio = 0;
  tiempoFinal = 0;
  tiempoAcumulado = 0;
  pausado = false;
  mostrarRecords = false;
  
  inicioCelda: {f: number, c: number} | null = null;
  seleccionando = false;

  constructor(
    private authService: AuthService,
    private firestoreService: FirestoreService
  ) {}

  ngOnInit() {
    // Componente inicializado, mostrar intro
  }

  cambiarTamanio(nuevoTamanio: number) {
    this.tamanio = nuevoTamanio;
  }

  iniciarJuego() {
    this.juegoIniciado = true;
    this.pausado = false;
    this.tiempoInicio = Date.now();
    this.tiempoFinal = 0;
    this.tiempoAcumulado = 0;
    this.generarSopa();
  }

  nuevoJuego(nuevoTamanio?: number) {
    if (nuevoTamanio) {
      this.tamanio = nuevoTamanio;
    }
    
    // Reiniciar el juego inmediatamente
    this.pausado = false;
    this.tiempoInicio = Date.now();
    this.tiempoFinal = 0;
    this.tiempoAcumulado = 0;
    this.generarSopa();
  }

  pausarJuego() {
    if (!this.pausado) {
      this.tiempoAcumulado += Date.now() - this.tiempoInicio;
      this.pausado = true;
    } else {
      this.tiempoInicio = Date.now();
      this.pausado = false;
    }
  }

  generarSopa() {
    const numPalabras = Math.floor(this.tamanio * 1.0);
    const palabrasSeleccionadas = this.seleccionarPalabrasAleatorias(numPalabras);
    
    this.sopa = Array(this.tamanio).fill(null).map(() => 
      Array(this.tamanio).fill(null).map(() => ({
        letra: '',
        activa: false,
        acertada: false
      }))
    );

    this.palabras = [];
    
    for (const palabraTexto of palabrasSeleccionadas) {
      let colocada = false;
      let intentos = 0;
      
      while (!colocada && intentos < 100) {
        intentos++;
        const direccion = this.obtenerDireccionAleatoria();
        const {x, y} = this.obtenerPosicionAleatoria(palabraTexto.length, direccion);
        
        if (this.puedoColocarPalabra(palabraTexto, x, y, direccion)) {
          this.colocarPalabra(palabraTexto, x, y, direccion);
          colocada = true;
        }
      }
    }
    
    this.rellenarEspaciosVacios();
  }

  seleccionarPalabrasAleatorias(cantidad: number): string[] {
    const palabrasDisponibles = palabras.filter(p => p.length <= this.tamanio);
    const seleccionadas: string[] = [];
    
    while (seleccionadas.length < cantidad && palabrasDisponibles.length > 0) {
      const idx = Math.floor(Math.random() * palabrasDisponibles.length);
      seleccionadas.push(palabrasDisponibles[idx]);
      palabrasDisponibles.splice(idx, 1);
    }
    
    return seleccionadas;
  }

  obtenerDireccionAleatoria(): string {
    const random = Math.random();
    if (random < 0.25) return 'diagonal-abajo-derecha';
    if (random < 0.375) return 'diagonal-abajo-izquierda';
    if (random < 0.5) return 'diagonal-arriba-derecha';
    if (random < 0.625) return 'diagonal-arriba-izquierda';
    if (random < 0.8125) return 'horizontal';
    return 'vertical';
  }

  obtenerPosicionAleatoria(longitudPalabra: number, direccion: string): {x: number, y: number} {
    let x = 0, y = 0;
    
    switch (direccion) {
      case 'horizontal':
        x = Math.floor(Math.random() * (this.tamanio - longitudPalabra + 1));
        y = Math.floor(Math.random() * this.tamanio);
        break;
      case 'vertical':
        x = Math.floor(Math.random() * this.tamanio);
        y = Math.floor(Math.random() * (this.tamanio - longitudPalabra + 1));
        break;
      case 'diagonal-abajo-derecha':
        x = Math.floor(Math.random() * (this.tamanio - longitudPalabra + 1));
        y = Math.floor(Math.random() * (this.tamanio - longitudPalabra + 1));
        break;
      case 'diagonal-abajo-izquierda':
        x = Math.floor(Math.random() * longitudPalabra) + (longitudPalabra - 1);
        y = Math.floor(Math.random() * (this.tamanio - longitudPalabra + 1));
        break;
      case 'diagonal-arriba-derecha':
        x = Math.floor(Math.random() * (this.tamanio - longitudPalabra + 1));
        y = Math.floor(Math.random() * longitudPalabra) + (longitudPalabra - 1);
        break;
      case 'diagonal-arriba-izquierda':
        x = Math.floor(Math.random() * longitudPalabra) + (longitudPalabra - 1);
        y = Math.floor(Math.random() * longitudPalabra) + (longitudPalabra - 1);
        break;
    }
    
    return {x, y};
  }

  puedoColocarPalabra(palabra: string, x: number, y: number, direccion: string): boolean {
    const deltas = this.obtenerDeltas(direccion);
    
    for (let i = 0; i < palabra.length; i++) {
      const nx = x + deltas.dx * i;
      const ny = y + deltas.dy * i;
      
      if (nx < 0 || nx >= this.tamanio || ny < 0 || ny >= this.tamanio) {
        return false;
      }
      
      const celda = this.sopa[ny][nx];
      if (celda.letra !== '' && celda.letra !== palabra[i]) {
        return false;
      }
    }
    
    return true;
  }

  colocarPalabra(palabra: string, x: number, y: number, direccion: string) {
    const deltas = this.obtenerDeltas(direccion);
    
    for (let i = 0; i < palabra.length; i++) {
      const nx = x + deltas.dx * i;
      const ny = y + deltas.dy * i;
      this.sopa[ny][nx].letra = palabra[i];
    }
    
    this.palabras.push({
      texto: palabra,
      encontrada: false,
      x, y,
      direccion
    });
  }

  obtenerDeltas(direccion: string): {dx: number, dy: number} {
    switch (direccion) {
      case 'horizontal': return {dx: 1, dy: 0};
      case 'vertical': return {dx: 0, dy: 1};
      case 'diagonal-abajo-derecha': return {dx: 1, dy: 1};
      case 'diagonal-abajo-izquierda': return {dx: -1, dy: 1};
      case 'diagonal-arriba-derecha': return {dx: 1, dy: -1};
      case 'diagonal-arriba-izquierda': return {dx: -1, dy: -1};
      default: return {dx: 0, dy: 0};
    }
  }

  rellenarEspaciosVacios() {
    for (let f = 0; f < this.tamanio; f++) {
      for (let c = 0; c < this.tamanio; c++) {
        if (this.sopa[f][c].letra === '') {
          this.sopa[f][c].letra = this.alfabeto[Math.floor(Math.random() * this.alfabeto.length)];
        }
      }
    }
  }

  onSeleccionarInicio(event: {f: number, c: number}) {
    this.inicioCelda = event;
    this.seleccionando = true;
    this.sopa[event.f][event.c].activa = true;
  }

  onSeleccionando(event: {f: number, c: number}) {
    if (!this.seleccionando || !this.inicioCelda) return;
    
    this.limpiarSeleccion();
    this.marcarSeleccion(this.inicioCelda, event);
  }

  onSeleccionarFin(event: {f: number, c: number}) {
    if (!this.inicioCelda) return;
    
    this.verificarPalabra(this.inicioCelda, event);
    this.limpiarSeleccion();
    this.inicioCelda = null;
    this.seleccionando = false;
  }

  limpiarSeleccion() {
    for (let f = 0; f < this.tamanio; f++) {
      for (let c = 0; c < this.tamanio; c++) {
        if (!this.sopa[f][c].acertada) {
          this.sopa[f][c].activa = false;
        }
      }
    }
  }

  marcarSeleccion(inicio: {f: number, c: number}, fin: {f: number, c: number}) {
    const celdas = this.obtenerCeldasEnLinea(inicio, fin);
    celdas.forEach(({f, c}) => {
      if (!this.sopa[f][c].acertada) {
        this.sopa[f][c].activa = true;
      }
    });
  }

  verificarPalabra(inicio: {f: number, c: number}, fin: {f: number, c: number}) {
    const celdas = this.obtenerCeldasEnLinea(inicio, fin);
    const palabraSeleccionada = celdas.map(({f, c}) => this.sopa[f][c].letra).join('');
    
    const palabraEncontrada = this.palabras.find(p => 
      !p.encontrada && (p.texto === palabraSeleccionada || p.texto === palabraSeleccionada.split('').reverse().join(''))
    );
    
    if (palabraEncontrada) {
      palabraEncontrada.encontrada = true;
      celdas.forEach(({f, c}) => {
        this.sopa[f][c].acertada = true;
        this.sopa[f][c].activa = false;
      });
      
      if (this.palabras.every(p => p.encontrada)) {
        this.juegoCompletado();
      }
    }
  }

  obtenerCeldasEnLinea(inicio: {f: number, c: number}, fin: {f: number, c: number}): {f: number, c: number}[] {
    const celdas: {f: number, c: number}[] = [];
    const df = fin.f - inicio.f;
    const dc = fin.c - inicio.c;
    const distancia = Math.max(Math.abs(df), Math.abs(dc));
    
    if (distancia === 0) {
      return [{f: inicio.f, c: inicio.c}];
    }
    
    const stepF = df / distancia;
    const stepC = dc / distancia;
    
    for (let i = 0; i <= distancia; i++) {
      const f = Math.round(inicio.f + stepF * i);
      const c = Math.round(inicio.c + stepC * i);
      celdas.push({f, c});
    }
    
    return celdas;
  }

  async juegoCompletado() {
    this.tiempoFinal = Date.now();
    const tiempoTotal = Math.floor((this.tiempoFinal - this.tiempoInicio + this.tiempoAcumulado) / 1000);
    
    alert(`¡Felicidades! Completaste el juego en ${tiempoTotal} segundos`);
    
    if (this.usuario) {
      await this.firestoreService.guardarRecord(
        this.usuario.uid,
        this.usuario.displayName || 'Usuario',
        this.tamanio,
        tiempoTotal
      );
    }
  }

  async cerrarSesion() {
    await this.authService.cerrarSesion();
  }

  toggleRecords() {
    this.mostrarRecords = !this.mostrarRecords;
  }

  cerrarRecords() {
    this.mostrarRecords = false;
  }
}
