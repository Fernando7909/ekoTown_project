import { Component, Input, OnChanges } from '@angular/core';
import { Producto } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card-productos',
  standalone: true,
  templateUrl: './card-productos.component.html',
  styleUrls: ['./card-productos.component.css'],
  imports: [CommonModule],
})
export class CardProductosComponent implements OnChanges {
  @Input() producto!: Producto;

  isModalOpen = false;
  selectedImageUrl: string | null = null;

  mensajeAlerta: string | null = null; // Variable para mostrar mensajes al usuario

  constructor(private cartService: CartService) {}

  ngOnChanges(): void {
    if (!this.producto || !this.producto.nombre) {
      console.warn('El producto recibido no es válido:', this.producto);
    }
  }

  onAddToCart(): void {
    const isAuthenticated = localStorage.getItem('token'); // Verifica si el token de autenticación existe

    if (isAuthenticated) {
      this.cartService.addToCart(this.producto);
      alert(`Producto "${this.producto.nombre}" añadido al carrito.`);
    } else {
      // Muestra un mensaje en pantalla
      this.mensajeAlerta = 'Debes estar registrado para realizar compras.';
      setTimeout(() => {
        this.mensajeAlerta = null; // Oculta el mensaje después de unos segundos
      }, 3000); // 3 segundos de duración
    }
  }

  // Método para abrir el modal con la imagen seleccionada
  openImageModal(imageUrl: string | null | undefined): void {
    if (imageUrl) {
      this.selectedImageUrl = imageUrl;
      this.isModalOpen = true;
    }
  }
  

  // Método para cerrar el modal
  closeImageModal(): void {
    this.isModalOpen = false;
    this.selectedImageUrl = null;
  }
}
