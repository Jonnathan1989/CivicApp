import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { Firestore, doc, updateDoc } from '@angular/fire/firestore';
import {
  IonContent, IonHeader, IonTitle, IonToolbar,
  IonButtons, IonButton, IonIcon, IonBadge,
  ToastController, LoadingController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  arrowBackOutline, locationOutline, calendarOutline,
  constructOutline, flashlightOutline, trashOutline,
  leafOutline, alertCircleOutline, cameraOutline,
  checkmarkCircleOutline, timeOutline, reloadOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-detalle-gestion',
  templateUrl: './detalle-gestion.page.html',
  styleUrls: ['./detalle-gestion.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar,
    IonButtons, IonButton, IonIcon, IonBadge,
    CommonModule, DatePipe
  ]
})
export class DetalleGestionPage implements OnInit {

  reporte: any = null;
  guardando = false;

  estados = [
    { valor: 'recibido', label: 'Recibido', color: 'primary', icono: 'reload-outline' },
    { valor: 'en_proceso', label: 'En proceso', color: 'warning', icono: 'time-outline' },
    { valor: 'resuelto', label: 'Resuelto', color: 'success', icono: 'checkmark-circle-outline' },
  ];

  constructor(
    private router: Router,
    private firestore: Firestore,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController
  ) {
    addIcons({
      arrowBackOutline, locationOutline, calendarOutline,
      constructOutline, flashlightOutline, trashOutline,
      leafOutline, alertCircleOutline, cameraOutline,
      checkmarkCircleOutline, timeOutline, reloadOutline
    });
  }

  ngOnInit() {
    const nav = this.router.getCurrentNavigation();
    const state = nav?.extras?.state;
    if (state && state['reporte']) {
      this.reporte = { ...state['reporte'] };
    }
  }

  getIcono(categoria: string): string {
    const map: any = {
      baches: 'construct-outline',
      luminarias: 'flashlight-outline',
      basuras: 'trash-outline',
      parques: 'leaf-outline',
      otros: 'alert-circle-outline'
    };
    return map[categoria] || 'alert-circle-outline';
  }

  getEstadoColor(estado: string): string {
    const map: any = {
      recibido: 'primary',
      en_proceso: 'warning',
      resuelto: 'success'
    };
    return map[estado] || 'medium';
  }

  async cambiarEstado(nuevoEstado: string) {
    if (!this.reporte || this.reporte.estado === nuevoEstado) return;

    const loading = await this.loadingCtrl.create({ message: 'Actualizando estado...' });
    await loading.present();

    try {
      const reporteRef = doc(this.firestore, 'reportes', this.reporte.id);
      await updateDoc(reporteRef, { estado: nuevoEstado });
      this.reporte.estado = nuevoEstado;
      await loading.dismiss();
      this.showToast('Estado actualizado correctamente');
    } catch (error) {
      await loading.dismiss();
      console.error('Error actualizando estado:', error);
      this.showToast('Error al actualizar el estado');
    }
  }

  async showToast(msg: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }

  goBack() {
    this.router.navigateByUrl('/panel-funcionario');
  }
}