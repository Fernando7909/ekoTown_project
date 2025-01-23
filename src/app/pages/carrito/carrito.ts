import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { Producto } from '../../services/product.service';
import { StripeService } from '../../services/stripe.service';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../components/navbar/navbar.component';

@Component({
  selector: 'app-carrito',
  standalone: true,
  templateUrl: './carrito.html',
  styleUrls: ['./carrito.css'],
  imports: [
    CommonModule,
    NavbarComponent,
  ],
})
export class CarritoComponent implements OnInit {
  cartItems: Producto[] = [];

  constructor(
    private cartService: CartService,
    private stripeService: StripeService // Inyectar el servicio de Stripe
  ) {}

  ngOnInit(): void {
    // Suscribirse a los cambios en los productos del carrito
    this.cartService.cartItems$.subscribe((items) => {
      this.cartItems = items.filter((item) => item.id !== undefined);

      // Asegurarse de que los valores de cantidad y cantidad máxima sean correctos
      this.cartItems.forEach((item) => {
        if (!item.cantidad) {
          item.cantidad = 1; // Por defecto, 1 unidad
        }
        if (item.cantidad_maxima === undefined) {
          item.cantidad_maxima = item.stock || 0; // Ajustar según el stock disponible
        }
      });

      console.log('Productos en el carrito:', this.cartItems);
    });
  }

  // Eliminar un producto del carrito
  removeItem(productoId: number): void {
    this.cartService.removeFromCart(productoId);
  }

  // Incrementar la cantidad de un producto
  incrementQuantity(item: Producto): void {
    if (item.cantidad < item.cantidad_maxima) {
      item.cantidad += 1;
      this.cartService.updateCartItem(item);
    } else {
      alert(`No puedes agregar más de ${item.cantidad_maxima} unidades de este producto.`);
    }
  }

  // Decrementar la cantidad de un producto
  decrementQuantity(item: Producto): void {
    if (item.cantidad > 1) {
      item.cantidad -= 1;
      this.cartService.updateCartItem(item);
    }
  }

  // Calcular el subtotal del carrito
  calculateSubtotal(): number {
    return this.cartItems.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
  }

  // Calcular el IVA
  calculateIVA(): number {
    const ivaRate = 0.21; // IVA al 21%
    return this.cartItems.reduce((acc, item) => acc + item.precio * item.cantidad * ivaRate, 0);
  }

  // Calcular el total (subtotal + IVA)
  calculateTotal(): number {
    return this.calculateSubtotal() + this.calculateIVA();
  }

  // Finalizar la compra y procesar los productos en el backend
  async finalizePurchase(): Promise<void> {
    if (this.cartItems.length === 0) {
      alert('El carrito está vacío. Agrega productos antes de finalizar la compra.');
      return;
    }
  
    // Preparar los items para Stripe con IVA incluido
    const items = this.cartItems.map((item) => {
      const priceWithIVA = item.precio * 1.21; // Añadir 21% de IVA
      return {
        name: item.nombre,
        price: Math.round(priceWithIVA * 100), // Convertir el precio a centavos
        quantity: item.cantidad,
      };
    });
  
    try {
      // Crear una sesión de Stripe
      const { sessionId } = await this.stripeService.createCheckoutSession(items);
  
      // Redirigir al usuario a la página de Stripe
      await this.stripeService.redirectToCheckout(sessionId);
    } catch (error) {
      console.error('Error al procesar la compra:', error);
      alert('Hubo un problema al procesar la compra. Por favor, inténtalo de nuevo.');
    }
  }
}
