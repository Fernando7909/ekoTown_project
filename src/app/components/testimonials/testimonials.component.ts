import { Component } from '@angular/core';
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
      comment: 'Nam ultrices, ex lacinia dapibus facilisis, ipsum dolor scelerisque massa, quis tempor quam ex sit amet tortor. Ut libero torquent per conubia nostra, per inceptos.',
      rating: 5
    },
    {
      id: 2,
      name: 'Mark Smith',
      date: '01/03/2024',
      image: 'https://randomuser.me/api/portraits/men/1.jpg',
      comment: 'Nam ultrices, ex lacinia dapibus facilisis, ipsum dolor scelerisque massa, quis tempor quam ex sit amet tortor. Ut libero torquent per conubia nostra, per inceptos.',
      rating: 4
    },
    {
      id: 3,
      name: 'Luke Reeves',
      date: '20/08/2024',
      image: 'https://randomuser.me/api/portraits/men/2.jpg',
      comment: 'Nam ultrices, ex lacinia dapibus facilisis, ipsum dolor scelerisque massa, quis tempor quam ex sit amet tortor. Ut libero torquent per conubia nostra, per inceptos.',
      rating: 5
    },
    {
      id: 4,
      name: 'Emily Carter',
      date: '16/07/2023',
      image: 'https://randomuser.me/api/portraits/women/2.jpg',
      comment: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed a tellus. Sed at nulla. Mauris metus. In nec metus. Sed a tellus. Sed at nulla. Mauris metus.',
      rating: 4
    },
    {
      id: 5,
      name: 'David Lee',
      date: '30/09/2024',
      image: 'https://randomuser.me/api/portraits/men/3.jpg',
      comment: 'Vestibulum purus quam, scelerisque ut, mollis sed, nonummy id, metus. Nullam accumsan lorem in dui. Cras ultricies mi eu turpis hendrerit fringilla.',
      rating: 5
    },
    {
      id: 6,
      name: 'Sophia Kim',
      date: '05/09/2024',
      image: 'https://randomuser.me/api/portraits/women/3.jpg',
      comment: 'Nulla tellus. Integer feugiat. Curabitur non nulla. Nullam arcu. Vivamus feugiat. Curabitur non nulla. Nullam arcu. Vivamus feugiat.',
      rating: 3
    }
  ];

  currentIndex = 0;
  testimonialsPerPage = 3;

  nextTestimonial() {
    // Avanzar solo si hay más testimonios a la derecha
    if (this.currentIndex < this.testimonials.length - this.testimonialsPerPage) {
      this.currentIndex += 1;
    }
  }
  
  previousTestimonial() {
    // Retroceder solo si no estamos al inicio
    if (this.currentIndex > 0) {
      this.currentIndex -= 1;
    }
  }
  
  get visibleTestimonials() {
    return this.testimonials.slice(this.currentIndex, this.currentIndex + this.testimonialsPerPage);
  }
  
  getStars(rating: number): number[] {
    return Array(5).fill(0).map((_, index) => index < rating ? 1 : 0);
  }

  trackByStar(index: number, star: number): number {
    return star;
  }  
}