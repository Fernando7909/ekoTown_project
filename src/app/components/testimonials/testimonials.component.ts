import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewChild, ElementRef } from '@angular/core';

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
  testimonials = [
    {
      photo: 'https://randomuser.me/api/portraits/women/1.jpg',
      name: 'Emily Ewing',
      role: 'Cliente frecuente',
      text: 'Ekotown ha cambiado mi forma de comprar. Sus productos ecológicos son de alta calidad y el proceso de compra es muy sencillo. ¡Recomiendo Ekotown a todos los que buscan un estilo de vida más sostenible!'
    },
    {
      photo: 'https://randomuser.me/api/portraits/men/2.jpg',
      name: 'John Schnobrich',
      role: 'Amante de la naturaleza',
      text: 'Me encanta comprar en Ekotown. Sus productos son respetuosos con el medio ambiente y el servicio al cliente es excelente. ¡Una experiencia de compra increíble!'
    },
    {
      photo: 'https://randomuser.me/api/portraits/women/3.jpg',
      name: 'Brooke Cagle',
      role: 'Defensora del medio ambiente',
      text: 'Ekotown es mi tienda favorita para productos ecológicos. La variedad de productos es impresionante y siempre llegan en perfectas condiciones. ¡Gracias por hacer del mundo un lugar mejor!'
    },
    {
      photo: 'https://randomuser.me/api/portraits/men/4.jpg',
      name: 'Charles Forerunner',
      role: 'Padre de familia',
      text: 'Comprar en Ekotown ha sido una gran decisión para mi familia. Sus productos son seguros, ecológicos y de gran calidad. ¡No puedo estar más contento con mis compras!'
    },
    {
      photo: 'https://randomuser.me/api/portraits/women/5.jpg',
      name: 'Annie Spratt',
      role: 'Bloguera de vida sostenible',
      text: 'Ekotown es una maravilla. Sus productos no solo son ecológicos, sino que también son asequibles. ¡Es un placer apoyar a una empresa que cuida del planeta!'
    },
    {
      photo: 'https://randomuser.me/api/portraits/men/6.jpg',
      name: 'Tyler Franta',
      role: 'Entusiasta del zero waste',
      text: 'Ekotown ha superado mis expectativas. Sus productos son de alta calidad y el envío es rápido. ¡Definitivamente mi tienda favorita para compras sostenibles!'
    },
    {
      photo: 'https://randomuser.me/api/portraits/men/7.jpg',
      name: 'Sean Pollock',
      role: 'Empresario consciente',
      text: 'Ekotown es una excelente opción para quienes buscan productos ecológicos. La plataforma es fácil de usar y los productos son increíbles. ¡Muy recomendado!'
    },
    {
      photo: 'https://randomuser.me/api/portraits/women/8.jpg',
      name: 'Kelly Sikkema',
      role: 'Diseñadora sostenible',
      text: 'Ekotown ha transformado mi forma de comprar. Sus productos son innovadores y respetuosos con el medio ambiente. ¡Una experiencia de compra única!'
    },
    {
      photo: 'https://randomuser.me/api/portraits/women/9.jpg',
      name: 'Maranda Vandergriff',
      role: 'Activista ambiental',
      text: 'Ekotown es increíble. Sus productos son sostenibles y de alta calidad. ¡Es un placer apoyar a una empresa que realmente hace la diferencia!'
    },
    {
      photo: 'https://randomuser.me/api/portraits/men/10.jpg',
      name: 'Chris Evans',
      role: 'Cliente satisfecho',
      text: 'Ekotown es mi tienda favorita. Sus productos ecológicos son de primera calidad y el servicio al cliente es excepcional. ¡No puedo dejar de recomendar Ekotown!'
    },
    {
      photo: 'https://randomuser.me/api/portraits/women/11.jpg',
      name: 'Sophia King',
      role: 'Madre comprometida',
      text: 'Ekotown ha sido una gran elección para mi familia. Sus productos son seguros, ecológicos y de gran calidad. ¡Gracias por hacer que nuestras compras sean más sostenibles!'
    }
  ];

  showAll = false; // Controla el estado de "mostrar todas"

  @ViewChild('containerWrapper') containerWrapper!: ElementRef;

  toggleShowAll() {
    const element = this.containerWrapper.nativeElement;

    if (!this.showAll) {
      // Expandir: calcular la altura completa del contenido
      const fullHeight = element.scrollHeight;
      element.style.maxHeight = `${fullHeight}px`;
    } else {
      // Contraer: volver a la altura inicial
      element.style.maxHeight = '600px';
    }

    this.showAll = !this.showAll;
  }
}