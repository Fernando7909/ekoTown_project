import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Producto } from '../../services/product.service';
import { PublishedProductsService } from '../../services/published-products.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { CardProductosComponent } from '../../components/card-productos/card-productos.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';

// Interfaz para los detalles de la tienda
interface StoreDetails {
  id: number;
  nombre_comercio: string;
  foto_gerente: string | null;
  nombre_gerente: string;
  imagen: string | null;
  descripcion: string;
  rating: number;
}

@Component({
  selector: 'app-inside-store',
  standalone: true,
  templateUrl: './insideStore.html',
  styleUrls: ['./insideStore.css'],
  imports: [
    CommonModule,
    MatCardModule,
    CardProductosComponent,
    NavbarComponent,
  ],
})
export class InsideStoreComponent implements OnInit {
  storeId: string | null = null;
  storeDetails: StoreDetails | null = null; // Detalles de la tienda
  productos: Producto[] = []; // Lista de productos publicados en la tienda

  constructor(
    private route: ActivatedRoute,
    private publishedProductsService: PublishedProductsService
  ) {}

  ngOnInit(): void {
    console.log('Iniciando InsideStoreComponent...');
    // Obtén el ID de la tienda desde la URL
    this.storeId = this.route.snapshot.paramMap.get('storeId');
    console.log('Store ID obtenido de la URL:', this.storeId);

    if (this.storeId) {
      this.loadStoreDetails();
      this.loadPublishedProducts(); // Cargar productos iniciales

      // Suscribirse a los productos publicados y filtrarlos por storeId
      this.publishedProductsService.publishedProducts$.subscribe((productos) => {
        console.log('Productos emitidos por el servicio:', productos);

        const storeIdNumber = Number(this.storeId); // Convertir el storeId a número
        console.log('Store ID convertido a número:', storeIdNumber);

        this.productos = productos.filter(
          (producto) => producto.business_manager_id === storeIdNumber
        );

        console.log('Productos publicados para esta tienda después del filtro:', this.productos);

        // Verificar si los productos se asignaron correctamente
        if (this.productos.length > 0) {
          console.log('Productos disponibles para mostrar:', this.productos);
        } else {
          console.warn('No hay productos publicados para esta tienda.');
        }
      });
    } else {
      console.error('No se proporcionó un ID de tienda válido.');
    }
  }

  // Cargar los detalles de la tienda
  loadStoreDetails(): void {
    console.log('Cargando detalles de la tienda...');
    fetch(`http://localhost:3000/api/stores/${this.storeId}`)
      .then((response) => {
        console.log('Respuesta del servidor para detalles de la tienda:', response);
        return response.json();
      })
      .then((data) => {
        this.storeDetails = {
          ...data.store,
          foto_gerente: data.store.foto_gerente?.replace(/\\/g, '/'),
          imagen: data.store.imagen?.replace(/\\/g, '/'),
        };
        console.log('Detalles de la tienda cargados correctamente:', this.storeDetails);
      })
      .catch((error) => {
        console.error('Error al cargar los detalles de la tienda:', error);
      });
  }

  // Cargar los productos publicados desde el backend
  loadPublishedProducts(): void {
    const storeIdNumber = Number(this.storeId);
    console.log('Cargando productos publicados para la tienda con ID:', storeIdNumber);
    fetch(`http://localhost:3000/api/stores/${storeIdNumber}/products`)
      .then((response) => {
        console.log('Respuesta del servidor para productos publicados:', response);
        return response.json();
      })
      .then((data: Producto[]) => {
        console.log('Datos de productos publicados recibidos del backend:', data);

        // Mapear `cantidad` al atributo `stock`
        this.productos = data.map((producto) => ({
          ...producto,
          stock: producto.cantidad, // Mapear cantidad a stock
          imagen_url: producto.imagen_url?.replace(/\\/g, '/'), // Normalizar URL
        }));
        console.log('Productos publicados cargados y procesados:', this.productos);
      })
      .catch((error) => {
        console.error('Error al cargar los productos publicados:', error);
      });
  }
}
