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
  foto_gerente: { url: string }; // Vuelve a ser un objeto con `url`
  nombre_gerente: string;
  imagen: { url: string }; // Vuelve a ser un objeto con `url`
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

export class CardsComponent implements OnInit {

  showContent: boolean = true;
  cards: Card[] = [
    {
      nombre_comercio: '4eco',
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
      nombre_comercio: 'El Pí',
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
      nombre_comercio: 'Veritas',
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
      nombre_comercio: 'Ecoaliment',
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
      nombre_comercio: 'Linverd',
      foto_gerente: { 
        url: "faces/cara05.jpg" 
      },
      nombre_gerente: 'Nuria Cardona',
      imagen: { 
        url: "fotosTiendas/tienda5.jpg" 
      },
      descripcion: 'En el 2020 Esteve Domenech decide poner rumbo a abrir un supermercado más acorde con las necesidades del consumidor y el planeta, un lugar donde el cliente puede sentirse cómodo y puede comprar producto a granel, de proximidad, ecológico y justo para el planeta. Dar la oportunidad al consumidor de encontrar un lugar transparente y cercano, dónde el cliente sea el pilar del proyecto y juntos podamos trabajar para lograr una alimentación responsable para todos y el planeta. Y por ello abrimos el primer supermercado ecológico donde los valores eran firmes y claros, productos ecológicos, próximos, transparentes y minimizando el plástico al máximo. Lo hicimos la ilusión de crear un espacio dónde solo hubiera alimentos con vida, sin químicos y nada perjudicial para las personas y el planeta. Dónde lo prioritario sea el consumidor y el planeta, de verdad.',
      rating: 4
    },
    {
      nombre_comercio: 'Organic Market',
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
      nombre_comercio: 'BioBarri',
      foto_gerente: { 
        url: "faces/cara07.jpg" 
      },
      nombre_gerente: 'Marc Oliván',
      imagen: { 
        url: "fotosTiendas/tienda7.jpg" 
      },
      descripcion: 'Bio Barri es un negocio de alimentación súper bonito y cuidado. Aquí podéis encontrar un sinfín de productos orgánicos, dietéticos, cosméticos, etc. Todos con certificados biológico y ecológico, tanto en frescos como en envasados. La idea de este negocio es volver a encontrar una tienda “como las de antes”. Un sitio donde prima el trato con el cliente y su bienestar, donde podéis pedir consejo y recomendaciones y donde seguro que vais a querer volver, ya que tienen un montón de productos con una pinta deliciosa e irresistible. Además, ¡hay unas neveritas donde podéis encontrar LOV en todos los sabores y tamaños disponibles!',
      rating: 5
    },
    {
      nombre_comercio: 'IDONI BONCOR',
      foto_gerente: { 
        url: "faces/cara08.jpg" 
      },
      nombre_gerente: 'Isabel García',
      imagen: { 
        url: "fotosTiendas/tienda8.jpg" 
      },
      descripcion: 'IDONI-BONCOR es el resultado de la unión de dos historias con valores compartidos y un objetivo común: transformar la economía hacia un modelo más sostenible y social. La fusión de IDONI, fundada en 2014 para promover un consumo responsable y saludable, y Botiga Bon Cor, nacida de la colaboración entre las cooperativas Menjar dHort y Solucions Socials Sostenibles, da vida a un proyecto que apuesta por la soberanía alimentaria, la inclusión social y el respeto al medio ambiente. En IDONI-BONCOR trabajamos para ofrecer productos locales, de temporada y ecológicos, a la vez que promovemos la inserción laboral de personas en riesgo de exclusión. Nuestra misión es clara: transformar la economía en una actividad con un impacto social positivo y sostenible, respetando nuestro entorno y apoyando a los pequeños productores locales.',
      rating: 1
    }
  ];

  isModalOpen = false;
  fullDescription = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadCardsFromDatabase();
  }

  loadCardsFromDatabase(): void {
    this.http.get<Card[]>('http://localhost:3000/api/stores/all').subscribe({
      next: (data) => {
        const mappedData = data.map((store) => ({
          ...store,
          foto_gerente: { url: `http://localhost:3000/uploads/${store.foto_gerente}` },
          imagen: { url: `http://localhost:3000/uploads/${store.imagen}` },
        }));
        this.cards = [...this.cards, ...mappedData];
        console.log('Datos cargados desde la base de datos:', mappedData);
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