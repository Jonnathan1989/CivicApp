import { Component, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { App } from '@capacitor/app';
import { Auth, signOut } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent implements OnInit {

  private timerSesion: any = null;
  private TIMEOUT_MS = 5 * 60 * 1000; // 5 minutos

  constructor(
    private auth: Auth,
    private router: Router
  ) {}

  ngOnInit() {
    App.addListener('appStateChange', ({ isActive }) => {
      if (!isActive) {
        // App pasó a segundo plano — inicia el contador
        this.timerSesion = setTimeout(async () => {
          const user = this.auth.currentUser;
          if (user) {
            await signOut(this.auth);
            this.router.navigateByUrl('/login', { replaceUrl: true });
          }
        }, this.TIMEOUT_MS);
      } else {
        // App volvió al primer plano — cancela el contador
        if (this.timerSesion) {
          clearTimeout(this.timerSesion);
          this.timerSesion = null;
        }
      }
    });
  }
}