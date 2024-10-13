import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

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
  selector: 'app-inicio',
  standalone: true,
  imports: [
    MatCardModule,
    RatingModule,
    FormsModule,
    CommonModule,
    ButtonModule
  ],
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css'] // Corregido: styleUrl -> styleUrls
})
export class InicioComponent {

  showContent: boolean = true;
  cards: Card[] = [
    {
      title: 'Tienda 1',
      foto_gerente: { 
        url: "plant.png" // Imagen segura de un gerente 1
      },
      nombre_gerente: 'Gerente 1',
      imagen: { 
        url: "https://images.pexels.com/photos/1884573/pexels-photo-1884573.jpeg" // Imagen de la tienda 1
      },
      descripcion: 'Esta es la tienda 1, especializada en productos electrónicos.',
      rating: 1
    },
    {
      title: 'Tienda 2',
      foto_gerente: { 
        url: "plant.png" // Imagen segura de un gerente 2
      },
      nombre_gerente: 'Gerente 2',
      imagen: { 
        url: "https://images.pexels.com/photos/2574474/pexels-photo-2574474.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" // Imagen de la tienda 2
      },
      descripcion: 'Esta es la tienda 2, especializada en productos de moda.',
      rating: 4
    },
    {
      title: 'Tienda 3',
      foto_gerente: { 
        url: "plant.png" // Imagen segura de un gerente 3
      },
      nombre_gerente: 'Gerente 3',
      imagen: { 
        url: "https://images.pexels.com/photos/2651935/pexels-photo-2651935.jpeg" // Imagen de la tienda 3
      },
      descripcion: 'Esta es la tienda 3, especializada en productos de hogar.',
      rating: 5
    },
    {
      title: 'Tienda 4',
      foto_gerente: { 
        url: "plant.png" // Imagen segura de un gerente 4
      },
      nombre_gerente: 'Gerente 4',
      imagen: { 
        url: "https://images.pexels.com/photos/4030663/pexels-photo-4030663.jpeg" // Imagen de la tienda 4
      },
      descripcion: 'Esta es la tienda 4, especializada en productos deportivos.',
      rating: 3
    },
    {
      title: 'Tienda 5',
      foto_gerente: { 
        url: "plant.png" // Imagen segura de un gerente 5
      },
      nombre_gerente: 'Gerente 5',
      imagen: { 
        url: "https://images.pexels.com/photos/1597966/pexels-photo-1597966.jpeg" // Imagen de la tienda 5
      },
      descripcion: 'Esta es la tienda 5, especializada en tecnología.',
      rating: 4
    },
    {
      title: 'Tienda 6',
      foto_gerente: { 
        url: "plant.png" // Imagen segura de un gerente 6
      },
      nombre_gerente: 'Gerente 6',
      imagen: { 
        url: "https://images.pexels.com/photos/2204533/pexels-photo-2204533.jpeg" // Imagen de la tienda 6
      },
      descripcion: 'Esta es la tienda 6, especializada en juguetes.',
      rating: 2
    },
    {
      title: 'Tienda 7',
      foto_gerente: { 
        url: "plant.png" // Imagen segura de un gerente 7
      },
      nombre_gerente: 'Gerente 7',
      imagen: { 
        url: "https://images.pexels.com/photos/1560921/pexels-photo-1560921.jpeg" // Imagen de la tienda 7
      },
      descripcion: 'Esta es la tienda 7, especializada en libros.',
      rating: 5
    },
    {
      title: 'Tienda 8',
      foto_gerente: { 
        url: "plant.png" // Imagen segura de un gerente 7
      },
      nombre_gerente: 'Gerente 8',
      imagen: { 
        url: "https://images.pexels.com/photos/1560921/pexels-photo-1560921.jpeg" // Imagen de la tienda 7
      },
      descripcion: 'Esta es la tienda 8, especializada productos veggie.',
      rating: 1
    }
  ];
  
  // Método para ocultar el contenido
  hideContent() {
    this.showContent = false; // Cambia la variable a false para ocultar el contenido
  }
}  
