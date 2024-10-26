import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';
import { environment } from '../environments/environment';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
  providers: [
      provideZoneChangeDetection({ eventCoalescing: true }), 
      provideRouter(routes), 
      provideFirebaseApp(() => initializeApp(environment.firebaseConfig)), 
      provideAuth(() => getAuth()), 
      provideFirestore(() => getFirestore()), 
      provideStorage(() => getStorage()),
      provideHttpClient(withFetch()),
      { provide: FIREBASE_OPTIONS, useValue: environment.firebaseConfig }, provideAnimationsAsync()
    ]
};
