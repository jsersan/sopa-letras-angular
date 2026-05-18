import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  Timestamp
} from 'firebase/firestore';
import { firebaseConfig } from './firebase.config';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  private app = initializeApp(firebaseConfig);
  private db = getFirestore(this.app);

  async crearPerfilUsuario(userId: string, displayName: string, email: string) {
    try {
      const userRef = doc(this.db, 'users', userId);
      await setDoc(userRef, {
        displayName,
        email,
        totalGames: 0,
        bestTime: null,
        createdAt: Timestamp.now()
      });
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async guardarRecord(userId: string, userName: string, tamaño: number, segundos: number) {
    try {
      // Validar y convertir segundos a número
      const segundosNum = Number(segundos);
      if (isNaN(segundosNum) || segundosNum < 0) {
        throw new Error('Tiempo inválido');
      }

      // Guardar en colección de récords
      const recordRef = doc(collection(this.db, 'records'));
      await setDoc(recordRef, {
        userId,
        userName,
        tamaño,
        segundos: segundosNum,
        fecha: Timestamp.now()
      });

      // Actualizar perfil del usuario
      const userRef = doc(this.db, 'users', userId);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        const userData = userSnap.data();
        const newTotalGames = (userData['totalGames'] || 0) + 1;
        const newBestTime = !userData['bestTime'] || segundosNum < userData['bestTime']
          ? segundosNum 
          : userData['bestTime'];
        
        await setDoc(userRef, {
          ...userData,
          totalGames: newTotalGames,
          bestTime: newBestTime
        });
      }

      // Actualizar ranking global
      await this.actualizarRanking(tamaño, userId, userName, segundosNum);

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  private async actualizarRanking(tamaño: number, userId: string, userName: string, segundos: number) {
    const rankingRef = doc(this.db, 'rankings', `${tamaño}`);
    const rankingSnap = await getDoc(rankingRef);

    let top10: any[] = [];
    
    if (rankingSnap.exists()) {
      top10 = rankingSnap.data()['top10'] || [];
    }

    // Añadir nuevo récord con fecha
    top10.push({ 
      userId, 
      userName, 
      segundos,
      fecha: Timestamp.now() 
    });

    // Ordenar y mantener top 10
    top10.sort((a, b) => a.segundos - b.segundos);
    top10 = top10.slice(0, 10);

    await setDoc(rankingRef, {
      top10,
      lastUpdate: Timestamp.now()
    });
  }

  async obtenerRecordsUsuario(userId: string) {
    try {
      const q = query(
        collection(this.db, 'records'),
        where('userId', '==', userId),
        orderBy('segundos', 'asc'),
        limit(20)
      );

      const querySnapshot = await getDocs(q);
      const records: any[] = [];
      querySnapshot.forEach((doc) => {
        records.push({ id: doc.id, ...doc.data() });
      });

      return { success: true, records };
    } catch (error: any) {
      return { success: false, error: error.message, records: [] };
    }
  }

  async obtenerRankingGlobal(tamaño: number) {
    try {
      const rankingRef = doc(this.db, 'rankings', `${tamaño}`);
      const rankingSnap = await getDoc(rankingRef);

      if (rankingSnap.exists()) {
        const ranking = rankingSnap.data()['top10'] || [];
        return { success: true, ranking };
      }

      return { success: true, ranking: [] };
    } catch (error: any) {
      return { success: false, error: error.message, ranking: [] };
    }
  }
}
