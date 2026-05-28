import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
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

  constructor(private router: Router, private auth: Auth) {
    addIcons({ locationSharp });
  }

  ngOnInit() {
    setTimeout(() => {
      onAuthStateChanged(this.auth, (user) => {
        if (user) {
          this.router.navigateByUrl('/home', { replaceUrl: true });
        } else {
          this.router.navigateByUrl('/login', { replaceUrl: true });
        }
      });
    }, 2500);
  }
}