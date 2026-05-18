export interface Celda {
  letra: string;
  activa: boolean;
  acertada: boolean;
}

export interface Palabra {
  texto: string;
  encontrada: boolean;
  x: number;
  y: number;
  direccion: string;
}

export interface Usuario {
  uid: string;
  email: string | null;
  displayName: string | null;
}

export interface Record {
  userId: string;
  userName: string;
  tamaño: number;
  segundos: number;
  fecha: any;
}
