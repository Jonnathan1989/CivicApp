import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { IonContent, IonButton, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  addCircleOutline, listOutline, mapOutline, personOutline,
  logOutOutline, alertCircleOutline, documentOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonContent, IonButton, IonIcon],
})
export class HomePage implements OnInit {

  nombreUsuario = '';
  inicial = '';

  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private router: Router
  ) {
    addIcons({ addCircleOutline, listOutline, mapOutline, personOutline, logOutOutline, alertCircleOutline, documentOutline });
  }

  async ngOnInit() {
    const user = this.auth.currentUser;
    if (user) {
      const snap = await getDoc(doc(this.firestore, 'usuarios', user.uid));
      if (snap.exists()) {
        const data = snap.data();
        this.nombreUsuario = data['nombre'] || 'Usuario';
      } else {
        this.nombreUsuario = user.displayName || user.email || 'Usuario';
      }
      this.inicial = this.nombreUsuario.charAt(0).toUpperCase();
    }
  }

  goTo(path: string) {
    this.router.navigateByUrl(path);
  }

  async logout() {
    await this.auth.signOut();
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }
}