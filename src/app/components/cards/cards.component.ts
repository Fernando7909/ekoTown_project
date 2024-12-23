import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
import { Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface Image {
  url: string;
}

interface Card {
  nombre_comercio: string;
  foto_gerente: string;
  nombre_gerente: string;
  imagen: string;
  descripcion: string;
  rating: number;
}

@Component({
  selector: 'app-cards',
  standalone: true,
  imports: [
    MatCardModule,
    CommonModule,
    RatingModule,
    FormsModule,
  ],
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.css'], // Corregido 'styleUrl' a 'styleUrls'
})
export class CardsComponent implements OnInit {
  showContent: boolean = true;
  isModalOpen = false;
  fullDescription = '';

  // Declaración de la propiedad 'cards'
  cards: Card[] = []; // Array que contendrá las tarjetas cargadas desde el backend

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadCardsFromDatabase();
  }

  loadCardsFromDatabase(): void {
    this.http.get<Card[]>('http://localhost:3000/api/stores/all').subscribe({
      next: (data) => {
        this.cards = data.map((store) => ({
          ...store,
          foto_gerente: store.foto_gerente.replace(/\\/g, '/'),
          imagen: store.imagen.replace(/\\/g, '/'),
        }));
        console.log('Datos cargados desde la base de datos:', this.cards);
      },
      error: (error) => {
        console.error('Error al cargar las tarjetas desde la base de datos:', error);
      },
    });
  }
  
  
  
  

  getShortDescription(description: string): string {
    const maxLength = 20;
    const words = description.split(' ');
    return words.length > maxLength ? words.slice(0, maxLength).join(' ') + '...' : description;
  }

  isDescriptionLong(description: string): boolean {
    const maxLength = 20;
    return description.split(' ').length > maxLength;
  }

  openModal(description: string): void {
    this.fullDescription = description;
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  /* RATING */
  @Input() rating: number = 1.0;
  @Input() reviewsCount: number = 1;
  stars: number[] = [1, 2, 3, 4, 5];
}
