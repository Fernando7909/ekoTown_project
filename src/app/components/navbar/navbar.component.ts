import { Component, HostListener } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  imports: [CommonModule, RouterModule]
})
export class NavbarComponent {
  opacity = 0;
  blurAmount = 0;
  gapSize = 70; // Inicializa el gap a 70px

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollOffset = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
    const maxScroll = 200;
    const maxOpacity = 0.4;
    const maxBlur = 15;
    const minGap = 40; // Valor mínimo del gap
    const initialGap = 70; // Valor inicial del gap

    // Calcula opacidad y desenfoque de manera proporcional al scroll
    this.opacity = Math.min((scrollOffset / maxScroll) * maxOpacity, maxOpacity);
    this.blurAmount = Math.min((scrollOffset / maxScroll) * maxBlur, maxBlur);

    // Calcula el gap de manera proporcional al scroll
    this.gapSize = initialGap - (scrollOffset / maxScroll) * (initialGap - minGap);
    this.gapSize = Math.max(this.gapSize, minGap); // Asegura que el gap no sea menor al mínimo
  }
}
