import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, DatePipe, TitleCasePipe } from '@angular/common';
import { Auth } from '@angular/fire/auth';
import { Firestore, collection, query, orderBy, getDocs, where } from '@angular/fire/firestore';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonButton,
  IonIcon, IonList, IonItem, IonLabel, IonBadge, IonAvatar
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  logOutOutline, mapOutline, personOutline, constructOutline,
  flashlightOutline, trashOutline, leafOutline, alertCircleOutline,
  gridOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-panel-funcionario',
  templateUrl: './panel-funcionario.page.html',
  styleUrls: ['./panel-funcionario.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonButton,
    IonIcon, IonList, IonItem, IonLabel, IonBadge, IonAvatar,
    CommonModule, DatePipe, TitleCasePipe
  ]
})
export class PanelFuncionarioPage implements OnInit {

  reportes: any[] = [];
  reportesFiltrados: any[] = [];
  filtroActivo = 'todos';
  cargando = true;
  usuarioNombre = 'Funcionario';

  totalReportes = 0;
  enProceso = 0;
  resueltosHoy = 0;

  filtros = [
    { label: 'Todos', valor: 'todos' },
    { label: 'Recibidos', valor: 'recibido' },
    { label: 'En proceso', valor: 'en_proceso' },
  ];

  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private router: Router
  ) {
    addIcons({
      logOutOutline, mapOutline, personOutline, constructOutline,
      flashlightOutline, trashOutline, leafOutline, alertCircleOutline,
      gridOutline
    });
  }

  async ngOnInit() {
    await this.cargarReportes();
  }

  async cargarReportes() {
    this.cargando = true;
    try {
      const q = query(
        collection(this.firestore, 'reportes'),
        orderBy('creadoEn', 'desc')
      );
      const snap = await getDocs(q);
      this.reportes = snap.docs.map(d => ({ id: d.id, ...d.data() }));

      // Calcular métricas
      this.totalReportes = this.reportes.length;
      this.enProceso = this.reportes.filter(r => r.estado === 'en_proceso').length;

      const hoy = new Date();
      this.resueltosHoy = this.reportes.filter(r => {
        if (r.estado !== 'resuelto') return false;
        const fecha = r.creadoEn?.toDate();
        return fecha?.toDateString() === hoy.toDateString();
      }).length;

      this.filtrar(this.filtroActivo);
    } catch (error) {
      console.error('Error cargando reportes:', error);
    } finally {
      this.cargando = false;
    }
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
    this.router.navigateByUrl('/detalle-gestion', {
      state: { reporte }
    });
  }

  goToMapa() {
    this.router.navigateByUrl('/mapa');
  }

  async cerrarSesion() {
    await this.auth.signOut();
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }
}