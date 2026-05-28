import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, DatePipe, TitleCasePipe } from '@angular/common';
import { Auth } from '@angular/fire/auth';
import { Firestore, collection, query, where, orderBy, getDocs } from '@angular/fire/firestore';
import {
  IonHeader, IonToolbar, IonTitle, IonButtons, IonButton,
  IonContent, IonIcon
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  arrowBackOutline, addOutline, documentOutline, reloadOutline,
  constructOutline, flashlightOutline, trashOutline, leafOutline, alertCircleOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-mis-reportes',
  templateUrl: './mis-reportes.page.html',
  styleUrls: ['./mis-reportes.page.scss'],
  standalone: true,
  imports: [
    IonHeader, IonToolbar, IonTitle, IonButtons, IonButton,
    IonContent, IonIcon, CommonModule, DatePipe, TitleCasePipe
  ],
})
export class MisReportesPage implements OnInit {

  reportes: any[] = [];
  reportesFiltrados: any[] = [];
  filtroActivo = 'todos';
  cargando = true;

  filtros = [
    { label: 'Todos', valor: 'todos' },
    { label: 'Recibido', valor: 'recibido' },
    { label: 'En proceso', valor: 'en_proceso' },
    { label: 'Resuelto', valor: 'resuelto' },
  ];

  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private router: Router
  ) {
    addIcons({ arrowBackOutline, addOutline, documentOutline, reloadOutline, constructOutline, flashlightOutline, trashOutline, leafOutline, alertCircleOutline });
  }

  async ngOnInit() {
    await this.cargarReportes();
  }

  async cargarReportes() {
    this.cargando = true;
    const user = this.auth.currentUser;
    if (!user) return;
    const q = query(
      collection(this.firestore, 'reportes'),
      where('uid', '==', user.uid),
      orderBy('creadoEn', 'desc')
    );
    const snap = await getDocs(q);
    this.reportes = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    this.filtrar(this.filtroActivo);
    this.cargando = false;
  }

  filtrar(valor: string) {
    this.filtroActivo = valor;
    if (valor === 'todos') {
      this.reportesFiltrados = this.reportes;
    } else {
      this.reportesFiltrados = this.reportes.filter(r => r.estado === valor);
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

  getEstadoLabel(estado: string): string {
    const map: any = {
      recibido: 'Recibido',
      en_proceso: 'En proceso',
      resuelto: 'Resuelto'
    };
    return map[estado] || estado;
  }

  verDetalle(reporte: any) {
    // próximamente
  }

  goTo(path: string) {
    this.router.navigateByUrl(path);
  }

  goBack() {
    this.router.navigateByUrl('/home');
  }
}