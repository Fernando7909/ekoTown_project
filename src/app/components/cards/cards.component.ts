import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
import { Input } from '@angular/core';


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
        url: "fotosTiendas/tienda1.jpg"
      },
      descripcion: 'En las tiendas de 4eco tenemos la mayor variedad de productos de limpieza a granel que puedes encontrar. Desde los productos para la ropa hasta los del hogar. Genéricos, específicos, diferentes superficies, madera, mármol, acero, cristales… Todo lo que se te ocurra. Productos biodegradables, aptos para pieles delicadas, más económicos y más concentrados, lo que los convierte en más rentables aún.',
      rating: 2
    },
    {
      title: 'El Pí',
      foto_gerente: { 
        url: "faces/cara02.jpg" 
      },
      nombre_gerente: 'Raquel Alvarez',
      imagen: { 
        url: "fotosTiendas/tienda2.jpg"
      },
      descripcion: 'En EL PÍ, nos dedicamos a ofrecer frutas y verduras frescas, cultivadas de manera sostenible y sin químicos. Nuestro compromiso es brindar productos de temporada directamente de productores locales para asegurar la frescura y calidad en cada bocado. Además, contamos con una amplia selección de granos, legumbres y productos ecológicos para ayudarte a mantener una dieta saludable y equilibrada. Visítanos y descubre el sabor auténtico de lo natural.',
      rating: 4
    },
    {
      title: 'Veritas',
      foto_gerente: { 
        url: "faces/cara03.jpg" 
      },
      nombre_gerente: 'Ruben Rámos',
      imagen: { 
        url: "fotosTiendas/tienda3.jpg" 
      },
      descripcion: 'VERITAS es más que una tienda, es un espacio donde la alimentación ecológica cobra vida. Aquí encontrarás una selección cuidada de productos orgánicos: desde aceites de oliva virgen extra y vinos ecológicos hasta snacks saludables y alimentos sin gluten. Creemos en una alimentación consciente y de calidad, por eso trabajamos directamente con agricultores y productores comprometidos con el medio ambiente. Ven y déjate sorprender por nuestra variedad de productos frescos y artesanales.',
      rating: 5
    },
    {
      title: 'Ecoaliment',
      foto_gerente: { 
        url: "faces/cara04.jpg" 
      },
      nombre_gerente: 'Pau Alemany',
      imagen: { 
        url: "fotosTiendas/tienda4.jpg" 
      },
      descripcion: 'En ECOALIMENT, nos especializamos en productos ecológicos y sostenibles, ideales para quienes buscan cuidar de su salud y del planeta. Nuestro catálogo incluye desde alimentos frescos como frutas, verduras, carnes y lácteos, hasta productos de despensa sin aditivos ni conservantes. Además, contamos con opciones veganas, sin gluten y libres de transgénicos para adaptarnos a todas las dietas y estilos de vida. Haz de tu alimentación un acto de respeto hacia la naturaleza con BioMarket.',
      rating: 3
    },
    {
      title: 'Linverd',
      foto_gerente: { 
        url: "faces/cara05.jpg" 
      },
      nombre_gerente: 'Nuria Cardona',
      imagen: { 
        url: "fotosTiendas/tienda5.jpg" 
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
        url: "fotosTiendas/tienda6.jpg"
      },
      descripcion: 'ORGANIC MARKET es el lugar perfecto para los amantes de la alimentación natural y saludable. Ofrecemos productos ecológicos de alta calidad, cultivados de manera responsable y sin pesticidas. Aquí podrás encontrar desde panes artesanales y quesos locales hasta alimentos frescos y suplementos naturales. Nuestro equipo está comprometido en brindarte asesoría para ayudarte a hacer elecciones saludables que respeten el medio ambiente. Mejora tu calidad de vida con los productos de Sabores Orgánicos..',
      rating: 2
    },
    {
      title: 'BioBarri',
      foto_gerente: { 
        url: "faces/cara07.jpg" 
      },
      nombre_gerente: 'Marc Oliván',
      imagen: { 
        url: "fotosTiendas/tienda7.jpg" 
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
        url: "fotosTiendas/tienda8.jpg" 
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


  /* RATING */
  @Input() rating: number = 1.0;          // Calificación entre 1 y 5
  @Input() reviewsCount: number = 1;      // Cantidad de reseñas
  stars: number[] = [1, 2, 3, 4, 5];      // Para iterar y mostrar estrellas
}
