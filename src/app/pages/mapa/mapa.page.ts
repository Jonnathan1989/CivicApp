import { Component, OnInit, AfterViewInit, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { Firestore, collection, getDocs } from '@angular/fire/firestore';
import {
  IonHeader, IonTitle, IonToolbar,
  IonButtons, IonButton, IonIcon
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBackOutline } from 'ionicons/icons';
import * as L from 'leaflet';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.page.html',
  styleUrls: ['./mapa.page.scss'],
  standalone: true,
  imports: [
    IonHeader, IonTitle, IonToolbar,
    IonButtons, IonButton, IonIcon, CommonModule
  ]
})
export class MapaPage implements OnInit, AfterViewInit {

  private map!: L.Map;

  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private router: Router,
    private zone: NgZone
  ) {
    addIcons({ arrowBackOutline });
  }

  ngOnInit() {}

  ngAfterViewInit() {
    this.zone.runOutsideAngular(() => {
      setTimeout(async () => {
        await this.esperarUsuario();
        this.initMap();
        await this.cargarMarcadores();
      }, 800);
    });
  }

  esperarUsuario(): Promise<void> {
    return new Promise((resolve) => {
      const unsub = this.auth.onAuthStateChanged(user => {
        unsub();
        resolve();
      });
    });
  }

  initMap() {
    const mapEl = document.getElementById('map');
    if (!mapEl) {
      console.error('Elemento #map no encontrado');
      return;
    }

    // Calcular altura disponible restando el header
    const headerEl = document.querySelector('ion-header');
    const headerHeight = headerEl ? headerEl.clientHeight : 56;
    const availableHeight = window.innerHeight - headerHeight;
    mapEl.style.width = '100%';
    mapEl.style.height = availableHeight + 'px';

    this.map = L.map(mapEl, {
      center: [3.5854, -76.4936],
      zoom: 13
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    const iconDefault = L.icon({
      iconUrl: 'assets/leaflet/marker-icon.png',
      shadowUrl: 'assets/leaflet/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
    });
    L.Marker.prototype.options.icon = iconDefault;
  }

  async cargarMarcadores() {
    try {
      const snap = await getDocs(collection(this.firestore, 'reportes'));
      snap.docs.forEach(doc => {
        const data = doc.data();
        if (data['latitud'] && data['longitud']) {
          const marker = L.marker([data['latitud'], data['longitud']]);
          marker.bindPopup(`
            <b>${data['categoria']}</b><br>
            ${data['descripcion']}<br>
            <small>Estado: ${data['estado']}</small>
          `);
          marker.addTo(this.map);
        }
      });
    } catch (error) {
      console.error('Error cargando marcadores:', error);
    }
  }

  goBack() {
    this.router.navigateByUrl('/home');
  }
}