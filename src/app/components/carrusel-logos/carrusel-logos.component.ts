import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-carrusel-logos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carrusel-logos.component.html',
  styleUrls: ['./carrusel-logos.component.css']
})
export class CarruselLogosComponent {
  images = [
    'logosCarrusel/logo01.png',
    'logosCarrusel/logo02.png',
    'logosCarrusel/logo03.png',
    'logosCarrusel/logo04.png',
    'logosCarrusel/logo05.jpg',
    'logosCarrusel/logo06.png',
    'logosCarrusel/logo07.png',
    'logosCarrusel/logo08.png'
  ];
}
