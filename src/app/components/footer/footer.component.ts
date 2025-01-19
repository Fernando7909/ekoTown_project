import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    RouterModule, // RouterModule necesario para los enlaces de navegación
  ],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'] // Corrección del atributo
})
export class FooterComponent {
  constructor(private router: Router) {}

  // Método para desplazarse a la parte superior
  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Desplazamiento suave hacia la parte superior
  }

  // Método para desplazarse a la sección "Destacados"
  scrollToFeatured(): void {
    this.router.navigate(['/']).then(() => {
      const featuredSection = document.querySelector('.titulo-tiendas');
      featuredSection?.scrollIntoView({ behavior: 'smooth' }); // Desplazamiento suave hacia la sección destacada
    });
  }
}
