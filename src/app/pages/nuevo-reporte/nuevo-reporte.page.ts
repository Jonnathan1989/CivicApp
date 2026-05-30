import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Auth } from '@angular/fire/auth';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import {
  IonHeader, IonToolbar, IonTitle, IonButtons, IonButton,
  IonContent, IonIcon, IonTextarea, ToastController, LoadingController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  arrowBackOutline, cameraOutline, locationOutline, sendOutline,
  constructOutline, flashlightOutline, trashOutline, leafOutline, alertCircleOutline
} from 'ionicons/icons';
import { Geolocation } from '@capacitor/geolocation';

@Component({
  selector: 'app-nuevo-reporte',
  templateUrl: './nuevo-reporte.page.html',
  styleUrls: ['./nuevo-reporte.page.scss'],
  standalone: true,
  imports: [
    IonHeader, IonToolbar, IonTitle, IonButtons, IonButton,
    IonContent, IonIcon, IonTextarea, FormsModule, CommonModule
  ],
})
export class NuevoReportePage implements OnInit {

  categorias = [
    { label: 'Baches', valor: 'baches', icono: 'construct-outline' },
    { label: 'Luminarias', valor: 'luminarias', icono: 'flashlight-outline' },
    { label: 'Basuras', valor: 'basuras', icono: 'trash-outline' },
    { label: 'Parques', valor: 'parques', icono: 'leaf-outline' },
    { label: 'Otros', valor: 'otros', icono: 'alert-circle-outline' },
  ];

  categoriaSeleccionada = '';
  descripcion = '';
  fotoPreview: string | null = null;
  latitud: number | null = null;
  longitud: number | null = null;

  constructor(
    private router: Router,
    private auth: Auth,
    private firestore: Firestore,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController
  ) {
    addIcons({ arrowBackOutline, cameraOutline, locationOutline, sendOutline, constructOutline, flashlightOutline, trashOutline, leafOutline, alertCircleOutline });
  }

  ngOnInit() {
    this.obtenerUbicacion();
  }

  async obtenerUbicacion() {
    try {
      // Pedir permiso explícitamente
      const permiso = await Geolocation.requestPermissions();

      if (permiso.location === 'granted') {
        const posicion = await Geolocation.getCurrentPosition({
          enableHighAccuracy: true,
          timeout: 10000
        });
        this.latitud = posicion.coords.latitude;
        this.longitud = posicion.coords.longitude;
      } else {
        this.showToast('Permiso de ubicación denegado. Activa el GPS.');
      }
    } catch (error) {
      console.error('Error GPS:', error);
      this.showToast('No se pudo obtener la ubicación. Asegúrate de tener el GPS activo.');
    }
  }

  seleccionarCategoria(valor: string) {
    this.categoriaSeleccionada = valor;
  }

  tomarFoto() {
    const input = document.getElementById('fileInput') as HTMLInputElement;
    input.click();
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.fotoPreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  async enviarReporte() {
    if (!this.categoriaSeleccionada) {
      this.showToast('Selecciona una categoría');
      return;
    }
    if (!this.descripcion.trim()) {
      this.showToast('Escribe una descripción del problema');
      return;
    }
    if (!this.latitud || !this.longitud) {
      this.showToast('Esperando ubicación GPS...');
      await this.obtenerUbicacion();
      return;
    }
    const loading = await this.loadingCtrl.create({ message: 'Enviando reporte...' });
    await loading.present();
    try {
      const user = this.auth.currentUser;
      await addDoc(collection(this.firestore, 'reportes'), {
        categoria: this.categoriaSeleccionada,
        descripcion: this.descripcion.trim(),
        latitud: this.latitud,
        longitud: this.longitud,
        estado: 'recibido',
        uid: user?.uid,
        email: user?.email,
        creadoEn: new Date(),
        fotoUrl: null
      });
      await loading.dismiss();
      this.showToast('¡Reporte enviado exitosamente!');
      this.router.navigateByUrl('/home', { replaceUrl: true });
    } catch (e) {
      await loading.dismiss();
      this.showToast('Error al enviar el reporte');
    }
  }

  goBack() {
    this.router.navigateByUrl('/home');
  }

  async showToast(msg: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'bottom'
    });
    toast.present();
  }
}