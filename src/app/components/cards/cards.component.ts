import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';

interface Image {
  url: string;
}
interface Card {
  title: string;
  foto_gerente: Image;
  nombre_gerente: string;
  imagen: Image;
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
  styleUrl: './cards.component.css'
})

export class CardsComponent {

  showContent: boolean = true;
  cards: Card[] = [
    {
      title: '4eco',
      foto_gerente: { 
        url: "faces/cara01.jpg" 
      },
      nombre_gerente: 'Francesc Castany',
      imagen: { 
        url: "https://images.pexels.com/photos/1884573/pexels-photo-1884573.jpeg"
      },
      descripcion: 'En las tiendas de 4eco tenemos la mayor variedad de productos de limpieza a granel que puedes encontrar. Desde los productos para la ropa hasta los del hogar. Genéricos, específicos, diferentes superficies, madera, mármol, acero, cristales… Todo lo que se te ocurra. Productos biodegradables, aptos para pieles delicadas, más económicos y más concentrados, lo que los convierte en más rentables aún. Una cosa más.',
      rating: 1
    },
    {
      title: 'El Pí',
      foto_gerente: { 
        url: "faces/cara02.jpg" 
      },
      nombre_gerente: 'Raquel Alvarez',
      imagen: { 
        url: "https://images.pexels.com/photos/2574474/pexels-photo-2574474.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
      },
      descripcion: 'Esta es la tienda 2, especializada en productos de moda.',
      rating: 4
    },
    {
      title: 'Veritas',
      foto_gerente: { 
        url: "faces/cara03.jpg" 
      },
      nombre_gerente: 'Ruben Rámos',
      imagen: { 
        url: "https://images.pexels.com/photos/2651935/pexels-photo-2651935.jpeg" 
      },
      descripcion: 'Esta es la tienda 3, especializada en productos de hogar.',
      rating: 5
    },
    {
      title: 'Ecoaliment',
      foto_gerente: { 
        url: "faces/cara04.jpg" 
      },
      nombre_gerente: 'Pau Alemany',
      imagen: { 
        url: "https://images.pexels.com/photos/4030663/pexels-photo-4030663.jpeg" 
      },
      descripcion: 'Esta es la tienda 4, especializada en productos deportivos.',
      rating: 3
    },
    {
      title: 'Linverd',
      foto_gerente: { 
        url: "faces/cara05.jpg" 
      },
      nombre_gerente: 'Nuria Cardona',
      imagen: { 
        url: "https://images.pexels.com/photos/1597966/pexels-photo-1597966.jpeg" 
      },
      descripcion: 'Esta es la tienda 5, especializada en tecnología.',
      rating: 4
    },
    {
      title: 'Organic Market',
      foto_gerente: { 
        url: "faces/cara06.jpg" 
      },
      nombre_gerente: 'Beatriz González',
      imagen: { 
        url: "https://images.pexels.com/photos/2204533/pexels-photo-2204533.jpeg"
      },
      descripcion: 'Esta es la tienda 6, especializada en juguetes.',
      rating: 2
    },
    {
      title: 'BioBarri',
      foto_gerente: { 
        url: "faces/cara07.jpg" 
      },
      nombre_gerente: 'Marc Oliván',
      imagen: { 
        url: "https://images.pexels.com/photos/1560921/pexels-photo-1560921.jpeg" 
      },
      descripcion: 'Esta es la tienda 7, especializada en libros.',
      rating: 5
    },
    {
      title: 'IDONI BONCOR',
      foto_gerente: { 
        url: "faces/cara08.jpg" 
      },
      nombre_gerente: 'Isabel García',
      imagen: { 
        url: "https://images.pexels.com/photos/1560921/pexels-photo-1560921.jpeg" 
      },
      descripcion: 'Esta es la tienda 8, especializada productos veggie.',
      rating: 1
    }
  ];

  isModalOpen = false;
  fullDescription = '';

  // Función para obtener una descripción corta
  getShortDescription(description: string): string {
    const maxLength = 20; // Limita el número de palabras
    const words = description.split(' ');
    return words.length > maxLength ? words.slice(0, maxLength).join(' ') + '...' : description;
  }

  // Función para verificar si la descripción es larga
  isDescriptionLong(description: string): boolean {
    const maxLength = 20; // Misma longitud que en getShortDescription
    return description.split(' ').length > maxLength;
  }

  // Funciones para abrir y cerrar el modal
  openModal(description: string): void {
    this.fullDescription = description;
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }
}
