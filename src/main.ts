import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { importProvidersFrom } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';  // Importa HttpClientModule

// Crea una configuración básica
const appConfig = {
  providers: [
    provideRouter(routes),       // Proporciona el enrutador con las rutas
    provideAnimations(),         // Proporciona las animaciones
    importProvidersFrom(HttpClientModule)  // Importa y registra HttpClientModule globalmente
  ]
};

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
