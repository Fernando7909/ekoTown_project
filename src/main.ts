import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http'; // Proveedor recomendado para HttpClient

// Crea una configuración básica
const appConfig = {
  providers: [
    provideRouter(routes),       // Proporciona el enrutador con las rutas
    provideAnimations(),         // Proporciona las animaciones
    provideHttpClient()          // Registra HttpClient como un proveedor global
  ]
};

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
