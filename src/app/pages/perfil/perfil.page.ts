import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Auth, signOut } from '@angular/fire/auth';
import { Firestore, collection, query, where, getDocs } from '@angular/fire/firestore';
import {
  IonContent, IonHeader, IonTitle, IonToolbar,
  IonButtons, IonButton, IonIcon, ToastController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBackOutline, logOutOutline, personOutline, mailOutline, documentOutline } from 'ionicons/icons';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar,
    IonButtons, IonButton, IonIcon, CommonModule
  ]
})
export class PerfilPage implements OnInit {

  nombre = '';
  email = '';
  inicial = '';
  totalReportes = 0;
  reportesPorEstado = { recibido: 0, en_proceso: 0, resuelto: 0 };

  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private router: Router,
    private toastCtrl: ToastController
  ) {
    addIcons({ arrowBackOutline, logOutOutline, personOutline, mailOutline, documentOutline });
  }

  async ngOnInit() {
    await this.esperarUsuario();
    this.cargarDatosUsuario();
    await this.cargarEstadisticas();
  }

  esperarUsuario(): Promise<void> {
    return new Promise((resolve) => {
      const unsub = this.auth.onAuthStateChanged(user => {
        unsub();
        resolve();
      });
    });
  }

  cargarDatosUsuario() {
    const user = this.auth.currentUser;
    if (user) {
      this.email = user.email || '';
      this.nombre = user.displayName || this.email.split('@')[0];
      this.inicial = this.nombre.charAt(0).toUpperCase();
    }
  }

  async cargarEstadisticas() {
    const user = this.auth.currentUser;
    if (!user) return;
    try {
      const q = query(
        collection(this.firestore, 'reportes'),
        where('uid', '==', user.uid)
      );
      const snap = await getDocs(q);
      this.totalReportes = snap.size;
      snap.docs.forEach(doc => {
        const estado = doc.data()['estado'];
        if (estado in this.reportesPorEstado) {
          this.reportesPorEstado[estado as keyof typeof this.reportesPorEstado]++;
        }
      });
    } catch (e) {
      console.error('Error cargando estadísticas:', e);
    }
  }

  async logout() {
    await signOut(this.auth);
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }

  goBack() {
    this.router.navigateByUrl('/home');
  }
}