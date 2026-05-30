import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { locationSharp } from 'ionicons/icons';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
  standalone: true,
  imports: [IonContent, IonIcon],
})
export class SplashPage implements OnInit {

  constructor(
    private router: Router,
    private auth: Auth,
    private firestore: Firestore
  ) {
    addIcons({ locationSharp });
  }

  ngOnInit() {
    setTimeout(() => {
      onAuthStateChanged(this.auth, async (user) => {
        if (user) {
          try {
            const ref = doc(this.firestore, 'usuarios', user.uid);
            const snap = await getDoc(ref);
            const rol = snap.exists() ? snap.data()['rol'] : 'ciudadano';

            if (rol === 'funcionario') {
              this.router.navigateByUrl('/panel-funcionario', { replaceUrl: true });
            } else {
              this.router.navigateByUrl('/home', { replaceUrl: true });
            }
          } catch {
            this.router.navigateByUrl('/home', { replaceUrl: true });
          }
        } else {
          this.router.navigateByUrl('/login', { replaceUrl: true });
        }
      });
    }, 2500);
  }
}