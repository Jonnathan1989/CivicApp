import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Capacitor } from '@capacitor/core';
import { AuthService } from '../../services/auth';
import {
  IonContent, IonItem, IonInput, IonButton, IonIcon, ToastController, LoadingController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { locationSharp, mailOutline, lockClosedOutline, logoGoogle } from 'ionicons/icons';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonContent, IonItem, IonInput, IonButton, IonIcon, FormsModule, CommonModule],
})
export class LoginPage {

  email = '';
  password = '';
  esNativo = Capacitor.isNativePlatform();

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController
  ) {
    addIcons({ locationSharp, mailOutline, lockClosedOutline, logoGoogle });
  }

  async loginEmail() {
    if (!this.email || !this.password) {
      this.showToast('Por favor completa todos los campos');
      return;
    }
    const loading = await this.loadingCtrl.create({ message: 'Iniciando sesión...' });
    await loading.present();
    try {
      await this.authService.loginEmail(this.email, this.password);
      await loading.dismiss();
      this.router.navigateByUrl('/home', { replaceUrl: true });
    } catch (e: any) {
      await loading.dismiss();
      this.showToast('Correo o contraseña incorrectos');
    }
  }

  async loginGoogle() {
    const loading = await this.loadingCtrl.create({ message: 'Conectando con Google...' });
    await loading.present();
    try {
      await this.authService.loginGoogle();
      await loading.dismiss();
      this.router.navigateByUrl('/home', { replaceUrl: true });
    } catch (e: any) {
      await loading.dismiss();
      this.showToast('Error al iniciar con Google');
    }
  }

  goToRegister() {
    this.router.navigateByUrl('/register');
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