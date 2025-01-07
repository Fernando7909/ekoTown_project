import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AuthUserService } from '../../services/auth-user.service';


interface Card {
  id: number;
  nombre_comercio: string;
  foto_gerente: string;
  nombre_gerente: string;
  imagen: string;
  descripcion: string;
  rating: number;
  reviewsCount: number;
  averageRating: number;
}

interface RatingsSummary {
  averageRating: number;
  totalReviews: number;
  fiveStars: number;
  fourStars: number;
  threeStars: number;
  twoStars: number;
  oneStar: number;
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
  public Math = Math;
  showContent: boolean = true;

  // Modal para descripción
  isModalOpen: boolean = false;
  fullDescription: string = '';
  selectedCard: Card | null = null;

  // Modal para reseñas
  isReviewsModalOpen: boolean = false;
  selectedReviewCard: Card | null = null; 
  ratingsSummary: any = null;
  isUserRegistered: boolean = false; // Indica si el usuario está registrado
  alreadyReviewed: boolean = false; // Indica si el usuario ya dejó una reseña

  // Nuevas propiedades para el formulario de reseñas
  newReview: { rating: number; comment: string } = { rating: 0, comment: '' };
  isUserLoggedIn: boolean = false;

  

  cards: Card[] = []; // Array que contendrá las tarjetas cargadas desde el backend

  constructor(
    private http: HttpClient, 
    private cd: ChangeDetectorRef,
    private authUserService: AuthUserService
  ) {}

  ngOnInit(): void {
    this.loadCardsFromDatabase();
    this.isUserRegistered = this.authUserService.getUserFullName() !== null;

    
  }


  // Método para enviar una nueva reseña
  submitReview(storeId: number): void {
    if (!storeId) {
      console.error('No se proporcionó un ID de tienda.');
      return;
    }
  
    const payload = {
      store_id: storeId,
      user_id: this.authUserService.getUserId(),
      rating: this.newReview.rating,
      comment: this.newReview.comment,
    };
  
    this.http.post('http://localhost:3000/api/reviews', payload).subscribe({
      next: (response) => {
        console.log('Reseña añadida con éxito:', response);
        alert('¡Reseña publicada con éxito!');
        this.closeReviewsModal();
      },
      error: (error) => {
        console.error('Error al añadir reseña:', error);
        alert('Hubo un error al publicar tu reseña. Intenta nuevamente.');
      },
    });
    
  }

// Método para reiniciar el formulario
resetReviewForm(): void {
  this.newReview = { rating: 0, comment: '' };
}

  loadCardsFromDatabase(): void {
    this.http.get<Card[]>('http://localhost:3000/api/stores/all').subscribe({
      next: (stores) => {
        this.cards = stores.map((store) => ({
          ...store,
          foto_gerente: store.foto_gerente.replace(/\\/g, '/'),
          imagen: store.imagen.replace(/\\/g, '/'),
          descripcion: store.descripcion || 'Descripción no disponible',
          rating: parseFloat(store.rating.toFixed(1)),
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

  // Modal para descripción
  openModal(description: string, card: Card): void {
    console.log('Abriendo modal con descripción:', description);
    if (this.isReviewsModalOpen) {
      this.closeReviewsModal();
    }
  
    this.fullDescription = description;
    this.selectedCard = card;
    this.isModalOpen = true;
    console.log('isModalOpen después del cambio:', this.isModalOpen);
  
    this.cd.detectChanges(); // Fuerza la actualización del DOM
  }
  

  closeModal(): void {
    console.log('closeModal() fue llamado');
    this.isModalOpen = false;
    this.selectedCard = null;
  }
  

  // Obtener resumen de calificaciones
  getRatingsSummary(storeId: number): void {
    this.http.get<RatingsSummary>(`http://localhost:3000/api/ratings-summary/${storeId}`).subscribe({
      next: (summary) => {
        this.ratingsSummary = summary;
        console.log('Resumen de calificaciones:', summary);
      },
      error: (error) => {
        console.error('Error al obtener el resumen de calificaciones:', error);
      },
    });
  }

  
  // Modal para reseñas
  openReviewsModal(card: Card): void {
    console.log(`Abriendo modal de reseñas para: ${card.nombre_comercio}`);
    // Cerrar el modal de descripción si está abierto
    if (this.isModalOpen) {
      this.closeModal();
    }
    this.selectedReviewCard = card;
  
    // Llamar al backend para obtener el resumen de calificaciones
    this.http
      .get<any>(`http://localhost:3000/api/ratings-summary/${card.id}`)
      .subscribe({
        next: (response) => {
          console.log('Resumen de calificaciones:', response);
          response.averageRating = parseFloat(response.averageRating); // Convertir a número
          this.ratingsSummary = response;
        },
        error: (error) => {
          console.error('Error al cargar el resumen de calificaciones:', error);
        },
      });
  
    // Verificar si el usuario ya reseñó esta tienda
    const userId = this.authUserService.getUserId();
    if (userId) {
      this.http
        .get<{ alreadyReviewed: boolean }>(
          `http://localhost:3000/api/check-review/${card.id}/${userId}`
        )
        .subscribe({
          next: (response) => {
            this.alreadyReviewed = response.alreadyReviewed;
            this.isReviewsModalOpen = true;
          },
          error: (error) => {
            console.error('Error al verificar si el usuario ya reseñó:', error);
          },
        });
    } else {
      this.isReviewsModalOpen = true; // Abre el modal aunque no esté registrado
    }
  }

  closeReviewsModal(): void {
    console.log('Cerrando modal de reseñas');
    this.isReviewsModalOpen = false;
    this.selectedReviewCard = null;
    this.ratingsSummary = null;
    this.alreadyReviewed = false;
    this.cd.detectChanges(); // Asegúrate de que el DOM se actualice
  }
  

  stars: number[] = [1, 2, 3, 4, 5];

  getStarPercentage(star: number): number {
    if (!this.ratingsSummary) return 0;
    const total = this.ratingsSummary.totalReviews || 0;
    if (total === 0) return 0;
  
    const starCount = this.getStarCount(star);
    return (starCount / total) * 100; // Calcula el porcentaje
  }
  
  getStarCount(star: number): number {
    if (!this.ratingsSummary) return 0;
  
    switch (star) {
      case 5: return this.ratingsSummary.fiveStars || 0;
      case 4: return this.ratingsSummary.fourStars || 0;
      case 3: return this.ratingsSummary.threeStars || 0;
      case 2: return this.ratingsSummary.twoStars || 0;
      case 1: return this.ratingsSummary.oneStar || 0;
      default: return 0;
    }
  }
  
}
