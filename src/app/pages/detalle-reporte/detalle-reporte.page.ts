import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import {
  IonContent, IonHeader, IonTitle, IonToolbar,
  IonButtons, IonButton, IonIcon, IonBadge
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  arrowBackOutline, locationOutline, calendarOutline,
  constructOutline, flashlightOutline, trashOutline,
  leafOutline, alertCircleOutline, cameraOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-detalle-reporte',
  templateUrl: './detalle-reporte.page.html',
  styleUrls: ['./detalle-reporte.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar,
    IonButtons, IonButton, IonIcon, IonBadge,
    CommonModule, DatePipe
  ]
})
export class DetalleReportePage implements OnInit {

  reporte: any = null;
  cargando = true;

  constructor(
    private router: Router,
    private auth: Auth,
    private firestore: Firestore
  ) {
    addIcons({
      arrowBackOutline, locationOutline, calendarOutline,
      constructOutline, flashlightOutline, trashOutline,
      leafOutline, alertCircleOutline, cameraOutline
    });
  }

  async ngOnInit() {
    const nav = this.router.getCurrentNavigation();
    const state = nav?.extras?.state;
    if (state && state['reporte']) {
      this.reporte = state['reporte'];
    }
    this.cargando = false;
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

  getEstadoLabel(estado: string): string {
    const map: any = {
      recibido: 'Recibido',
      en_proceso: 'En proceso',
      resuelto: 'Resuelto'
    };
    return map[estado] || estado;
  }

  goBack() {
    this.router.navigateByUrl('/mis-reportes');
  }
}