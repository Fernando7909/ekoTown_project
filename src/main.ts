import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async'; // Importa tus rutas

// Crea una configuración básica
const appConfig = {
  providers: [
    provideRouter(routes), provideAnimationsAsync() // Proporciona el enrutador
  ]
};

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
