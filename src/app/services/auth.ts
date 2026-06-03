import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult, user } from '@angular/fire/auth';
import { Firestore, doc, setDoc, getDoc } from '@angular/fire/firestore';
import { Capacitor } from '@capacitor/core';

@Injectable({ providedIn: 'root' })
export class AuthService {

  user$ = user(this.auth);

  constructor(private auth: Auth, private firestore: Firestore) {}

  async loginEmail(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  async registerEmail(email: string, password: string, nombre: string) {
    const cred = await createUserWithEmailAndPassword(this.auth, email, password);
    await setDoc(doc(this.firestore, 'usuarios', cred.user.uid), {
      nombre,
      email,
      rol: 'ciudadano',
      uid: cred.user.uid,
      creadoEn: new Date()
    });
    return cred;
  }

  async loginGoogle() {
    const provider = new GoogleAuthProvider();

    if (Capacitor.isNativePlatform()) {
      await signInWithRedirect(this.auth, provider);
      const cred = await getRedirectResult(this.auth);
      if (!cred) return;
      const ref = doc(this.firestore, 'usuarios', cred.user.uid);
      const snap = await getDoc(ref);
      if (!snap.exists()) {
        await setDoc(ref, {
          nombre: cred.user.displayName,
          email: cred.user.email,
          rol: 'ciudadano',
          uid: cred.user.uid,
          creadoEn: new Date()
        });
      }
      return cred;
    } else {
      const cred = await signInWithPopup(this.auth, provider);
      const ref = doc(this.firestore, 'usuarios', cred.user.uid);
      const snap = await getDoc(ref);
      if (!snap.exists()) {
        await setDoc(ref, {
          nombre: cred.user.displayName,
          email: cred.user.email,
          rol: 'ciudadano',
          uid: cred.user.uid,
          creadoEn: new Date()
        });
      }
      return cred;
    }
  }

  async logout() {
    return signOut(this.auth);
  }
}