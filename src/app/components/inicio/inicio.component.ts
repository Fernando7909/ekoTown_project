import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { TestimonialsComponent } from '../testimonials/testimonials.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { CarruselLogosComponent } from '../carrusel-logos/carrusel-logos.component';
import { FooterComponent } from '../footer/footer.component';
import { CardsComponent } from "../cards/cards.component";
import { CarouselComponent } from "../carousel/carousel.component";

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [
    MatCardModule,
    RatingModule,
    FormsModule,
    CommonModule,
    ButtonModule,
    RouterModule,
    TestimonialsComponent,
    NavbarComponent,
    CarruselLogosComponent,
    FooterComponent,
    CardsComponent,
    CarouselComponent
  ],
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent {

  constructor(private router: Router) {} 

  // Método para redirigir a la ruta loginregister
  navigateToLoginRegister() {
    this.router.navigate(['/loginregister']);
  }

  goToSearch() {
    this.router.navigate(['/search']);
  }

  // Código para el contador de estadísticas
  @ViewChild('counterElement1', { static: true }) counterElement1!: ElementRef;
  @ViewChild('counterElement2', { static: true }) counterElement2!: ElementRef;
  @ViewChild('counterElement3', { static: true }) counterElement3!: ElementRef;

  private countersAnimated = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const sectionPosition = document.getElementById('counterSection')?.getBoundingClientRect().top ?? 0;
    const screenPosition = window.innerHeight;

    if (sectionPosition < screenPosition && !this.countersAnimated) {
      this.animateCounter(this.counterElement1.nativeElement, 425);
      this.animateCounter(this.counterElement2.nativeElement, 8000);
      this.animateCounter(this.counterElement3.nativeElement, 25);
      this.countersAnimated = true;
    }
  }

  animateCounter(counterElement: HTMLElement, target: number) {
    let currentValue = 0;
    const increment = target / 100;

    const updateCounter = () => {
      currentValue += increment;
      if (currentValue < target) {
        counterElement.textContent = Math.ceil(currentValue).toString();
        setTimeout(updateCounter, 30); 
      } else {
        counterElement.textContent = target.toString();
      }
    };

    updateCounter();
  }
}
