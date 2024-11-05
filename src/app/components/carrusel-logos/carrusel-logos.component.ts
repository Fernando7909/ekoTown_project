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
    'logo01.jpg',
    'logo02.jpg',
    'logo03.jpg',
    'logo04.jpg',
    'logo05.jpg',
    'logo06.jpg',
    'logo07.jpg'
  ];
}
