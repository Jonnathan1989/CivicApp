import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';
import {
  IonContent, IonItem, IonInput, IonButton, IonIcon,
  ToastController, LoadingController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  personOutline, mailOutline, lockClosedOutline,
  shieldCheckmarkOutline, arrowBackOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [IonContent, IonItem, IonInput, IonButton, IonIcon, FormsModule],
})
export class RegisterPage {

  nombre = '';
  email = '';
  password = '';
  confirmPassword = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController
  ) {
    addIcons({ personOutline, mailOutline, lockClosedOutline, shieldCheckmarkOutline, arrowBackOutline });
  }

  async register() {
    if (!this.nombre || !this.email || !this.password || !this.confirmPassword) {
      this.showToast('Por favor completa todos los campos');
      return;
    }
    if (this.password !== this.confirmPassword) {
      this.showToast('Las contraseñas no coinciden');
      return;
    }
    if (this.password.length < 6) {
      this.showToast('La contraseña debe tener mínimo 6 caracteres');
      return;
    }
    const loading = await this.loadingCtrl.create({ message: 'Creando cuenta...' });
    await loading.present();
    try {
      await this.authService.registerEmail(this.email, this.password, this.nombre);
      await loading.dismiss();
      this.showToast('¡Cuenta creada exitosamente!');
      this.router.navigateByUrl('/home', { replaceUrl: true });
    } catch (e: any) {
      await loading.dismiss();
      if (e.code === 'auth/email-already-in-use') {
        this.showToast('Este correo ya está registrado');
      } else {
        this.showToast('Error al crear la cuenta');
      }
    }
  }

  goBack() {
    this.router.navigateByUrl('/login');
  }

  async showToast(msg: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'bottom',
      color: 'danger'
    });
    toast.present();
  }
}