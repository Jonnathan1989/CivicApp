import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth, signOut, updateProfile } from '@angular/fire/auth';
import { Firestore, collection, query, where, getDocs, doc, updateDoc } from '@angular/fire/firestore';
import {
  IonContent, IonHeader, IonTitle, IonToolbar,
  IonButtons, IonButton, IonIcon, IonInput, IonItem,
  ToastController, LoadingController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  arrowBackOutline, logOutOutline, personOutline,
  mailOutline, documentOutline, createOutline, checkmarkOutline, closeOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar,
    IonButtons, IonButton, IonIcon, IonInput, IonItem,
    CommonModule, FormsModule
  ]
})
export class PerfilPage implements OnInit {

  nombre = '';
  email = '';
  inicial = '';
  totalReportes = 0;
  reportesPorEstado = { recibido: 0, en_proceso: 0, resuelto: 0 };

  editandoNombre = false;
  nombreEditado = '';

  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private router: Router,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController
  ) {
    addIcons({
      arrowBackOutline, logOutOutline, personOutline,
      mailOutline, documentOutline, createOutline, checkmarkOutline, closeOutline
    });
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
      this.reportesPorEstado = { recibido: 0, en_proceso: 0, resuelto: 0 };
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

  iniciarEdicion() {
    this.nombreEditado = this.nombre;
    this.editandoNombre = true;
  }

  cancelarEdicion() {
    this.editandoNombre = false;
    this.nombreEditado = '';
  }

  async guardarNombre() {
    if (!this.nombreEditado.trim()) {
      this.showToast('El nombre no puede estar vacío');
      return;
    }
    const loading = await this.loadingCtrl.create({ message: 'Guardando...' });
    await loading.present();
    try {
      const user = this.auth.currentUser;
      if (!user) return;

      // Actualizar en Firebase Auth
      await updateProfile(user, { displayName: this.nombreEditado.trim() });

      // Actualizar en Firestore
      await updateDoc(doc(this.firestore, 'usuarios', user.uid), {
        nombre: this.nombreEditado.trim()
      });

      this.nombre = this.nombreEditado.trim();
      this.inicial = this.nombre.charAt(0).toUpperCase();
      this.editandoNombre = false;
      await loading.dismiss();
      this.showToast('Nombre actualizado correctamente');
    } catch (e) {
      await loading.dismiss();
      this.showToast('Error al actualizar el nombre');
    }
  }

  async logout() {
    await signOut(this.auth);
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }

  goBack() {
    this.router.navigateByUrl('/home');
  }

  async showToast(msg: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }
}