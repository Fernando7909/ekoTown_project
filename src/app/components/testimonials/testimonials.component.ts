import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Testimonial {
  id: number;
  name: string;
  date: string;
  image: string;
  comment: string;
  rating: number;
}

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './testimonials.component.html',
  styleUrls: ['./testimonials.component.css'],
})
export class TestimonialsComponent {
  testimonials: Testimonial[] = [
    {
      id: 1,
      name: 'Luna John',
      date: '25/02/2024',
      image: 'https://randomuser.me/api/portraits/women/1.jpg',
      comment: '¡Increíble experiencia de compra! ekoTown tiene una gran variedad de productos ecológicos que se adaptan perfectamente a mi estilo de vida sostenible. Todo lo que he comprado, desde alimentos hasta productos de limpieza, es de excelente calidad. 🌍💚',
      rating: 5
    },
    {
      id: 2,
      name: 'Mark Smith',
      date: '01/03/2024',
      image: 'https://randomuser.me/api/portraits/men/1.jpg',
      comment: '¡Un descubrimiento increíble! ekoTown es mi sitio favorito para productos ecológicos. La sección de cosmética natural es mi preferida, tienen marcas que no había visto en otros lugares. Además, me encanta que todo sea cruelty-free y con ingredientes naturales. ¡No hay mejor manera de cuidar de mí y del medio ambiente!',
      rating: 4
    },
    {
      id: 3,
      name: 'Luke Reeves',
      date: '20/08/2024',
      image: 'https://randomuser.me/api/portraits/men/2.jpg',
      comment: 'Soy fan de ekoTown por su compromiso con la sostenibilidad. No solo ofrecen productos de calidad, sino que también educan sobre cómo reducir el impacto ambiental. Mis compras de alimentos ecológicos han sido perfectas, especialmente las frutas y snacks. ¡Sigan así, ekoTown, hacen un gran trabajo! 🌱✨',
      rating: 5
    },
    {
      id: 4,
      name: 'Emily Carter',
      date: '16/07/2023',
      image: 'https://randomuser.me/api/portraits/women/2.jpg',
      comment: 'Nunca pensé que cambiar a productos ecológicos fuera tan fácil hasta que encontré ekoTown. Su catálogo es súper variado, y encuentro todo lo que necesito en un solo lugar. Lo que más valoro es su transparencia: cada producto tiene una descripción clara sobre sus beneficios y origen. ¡Encantada con mi compra!',
      rating: 4
    },
    {
      id: 5,
      name: 'David Lee',
      date: '30/09/2024',
      image: 'https://randomuser.me/api/portraits/men/3.jpg',
      comment: '¡Me encanta ekoTown! Siempre me ha costado encontrar productos de limpieza realmente ecológicos que funcionen bien, pero aquí encontré justo lo que buscaba. Los precios son justos y el proceso de compra es muy intuitivo. Además, su atención al cliente es excelente, responden rápido y son súper amables.',
      rating: 5
    },
    {
      id: 6,
      name: 'Sophia Kim',
      date: '05/09/2024',
      image: 'https://randomuser.me/api/portraits/women/3.jpg',
      comment: 'ekoTown es el mejor ecommerce para quienes buscamos alternativas sostenibles. Compré un kit de cosmética natural y estoy encantada con los resultados. Además, se nota que cuidan cada detalle, desde el empaque hasta la experiencia de usuario en su web. ¡Sin duda seguiré comprando aquí y recomendándolo! 🌿💄',
      rating: 3
    }
  ];

  currentIndex = 0;
  testimonialsPerPage = 3;

  constructor() {
    if (typeof window !== 'undefined') {
      this.updateTestimonialsPerPage(window.innerWidth);
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    if (typeof window !== 'undefined') {
      this.updateTestimonialsPerPage(event.target.innerWidth);
    }
  }

  updateTestimonialsPerPage(width: number) {
    if (width < 768) {
      this.testimonialsPerPage = 1; // 1 card en pantallas pequeñas
    } else if (width < 1024) {
      this.testimonialsPerPage = 2; // 2 cards en pantallas medianas
    } else {
      this.testimonialsPerPage = 3; // 3 cards en pantallas grandes
    }
  }

  nextTestimonial() {
    this.currentIndex =
      (this.currentIndex + 1) % this.testimonials.length; // Avanza al siguiente índice de forma circular
  }

  previousTestimonial() {
    this.currentIndex =
      (this.currentIndex - 1 + this.testimonials.length) % this.testimonials.length; // Retrocede al índice anterior de forma circular
  }

  get visibleTestimonials() {
    // Ajusta los elementos visibles para soportar el desplazamiento infinito
    const visible: Testimonial[] = [];
    for (let i = 0; i < this.testimonialsPerPage; i++) {
      const index = (this.currentIndex + i) % this.testimonials.length; // Índice circular
      visible.push(this.testimonials[index]);
    }
    return visible;
  }

  getStars(rating: number): number[] {
    return Array(5).fill(0).map((_, index) => index < rating ? 1 : 0);
  }

  trackByStar(index: number, star: number): number {
    return star;
  }
}
