import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';

interface Card {
  id: number;
  nombre_comercio: string;
  foto_gerente: string;
  nombre_gerente: string;
  imagen: string;
  descripcion: string;
  rating: number;
  reviewsCount: number;
}

@Component({
  selector: 'app-cards',
  standalone: true,
  imports: [
    MatCardModule,
    CommonModule,
    RatingModule,
    FormsModule,
    RouterModule,
  ],
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.css'],
})
export class CardsComponent implements OnInit {
  showContent: boolean = true;
  isModalOpen: boolean = false;
  fullDescription: string = '';
  selectedCard: Card | null = null; // Define la tarjeta seleccionada
  cards: Card[] = []; // Array que contendrá las tarjetas cargadas desde el backend

  constructor(private http: HttpClient, private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadCardsFromDatabase();
  }

  loadCardsFromDatabase(): void {
    this.http.get<Card[]>('http://localhost:3000/api/stores/all').subscribe({
      next: (stores) => {
        // Mapea las tiendas y ajusta las propiedades necesarias
        this.cards = stores.map((store) => ({
          ...store,
          foto_gerente: store.foto_gerente.replace(/\\/g, '/'),
          imagen: store.imagen.replace(/\\/g, '/'),
          descripcion: store.descripcion || 'Descripción no disponible',
          rating: store.rating || 0,
          reviewsCount: store.reviewsCount || 0,
        }));

        console.log('Datos cargados:', this.cards);
      },
      error: (error) => {
        console.error('Error al cargar las tiendas desde la base de datos:', error);
      },
    });
  }

  getShortDescription(description: string): string {
    const maxLength = 20;
    const words = description.split(' ');
    return words.length > maxLength
      ? words.slice(0, maxLength).join(' ') + '...'
      : description;
  }

  isDescriptionLong(description: string): boolean {
    const maxLength = 20;
    return description.split(' ').length > maxLength;
  }

  openModal(description: string, card: Card): void {
    console.log('Abriendo modal con descripción:', description);
    this.fullDescription = description;
    this.selectedCard = card; // Almacena la tarjeta seleccionada
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.selectedCard = null; // Limpia la tarjeta seleccionada
  }

  stars: number[] = [1, 2, 3, 4, 5];
}
