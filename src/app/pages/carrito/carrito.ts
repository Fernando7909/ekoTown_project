import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { Producto } from '../../services/product.service';
import { CommonModule } from '@angular/common';
import { loadStripe, Stripe } from '@stripe/stripe-js';

@Component({
  selector: 'app-carrito',
  standalone: true,
  templateUrl: './carrito.html',
  styleUrls: ['./carrito.css'],
  imports: [CommonModule],
})
export class CarritoComponent implements OnInit {
  cartItems: Producto[] = [];
  stripe: Stripe | null = null;
  private stripePublicKey = 'pk_test_51QSgOrLqhhGqu8RPHJgAgfjsajmkC6xfaU3AWwqk3FKzt1u0WbiwG8tA1ha1u6Z4anCQJrTmKVKZyJXRfYvmJd1H00OqihvOIV';

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.cartService.cartItems$.subscribe((items) => {
      this.cartItems = items.filter((item) => item.id !== undefined);

      // Verificar que los productos tengan valores correctos
      this.cartItems.forEach((item) => {
        if (!item.cantidad) {
          item.cantidad = 1; // Predeterminar a 1 unidad si no está definido
        }

        if (item.cantidad_maxima === undefined) {
          item.cantidad_maxima = item.stock || 0; // Ajustar el máximo permitido al stock disponible
        }
      });

      console.log('Productos en el carrito:', this.cartItems);
    });

    this.initializeStripe();
  }

  async initializeStripe(): Promise<void> {
    this.stripe = await loadStripe(this.stripePublicKey);
  }

  removeItem(productoId: number): void {
    this.cartService.removeFromCart(productoId);
  }

  incrementQuantity(item: Producto): void {
    if (item.cantidad < item.cantidad_maxima) {
      item.cantidad += 1; // Incrementa la cantidad en 1
     
      this.cartService.updateCartItem(item); // Actualiza el carrito
    } else {
      alert("No puedes agregar más de ${item.cantidad_maxima} unidades de este producto.");
    }
  }
  

  decrementQuantity(item: Producto): void {
    if (item.cantidad > 1) {
      item.cantidad -= 1; // Disminuye la cantidad seleccionada
    }
  }

  calculateSubtotal(): number {
    return this.cartItems.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
  }

  calculateIVA(): number {
    const ivaRate = 0.21; // 21% IVA
    return this.cartItems.reduce((acc, item) => acc + item.precio * item.cantidad * ivaRate, 0);
  }

  calculateTotal(): number {
    return this.calculateSubtotal() + this.calculateIVA();
  }

  async finalizePurchase(): Promise<void> {
    if (!this.stripe) {
        console.error('Stripe no está inicializado.');
        return;
    }

    const ivaRate = 0.21;
    const items = this.cartItems.map((item) => {
        const priceWithIVA = item.precio * (1 + ivaRate);
        return {
            name: item.nombre,
            price: Math.round(priceWithIVA * 100),
            quantity: item.cantidad,
        };
    });

    try {
        const response = await fetch('http://localhost:3000/api/stripe/create-checkout-session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ items }),
        });

        const { sessionId } = await response.json();
        const result = await this.stripe.redirectToCheckout({ sessionId });

        if (result?.error) {
            throw new Error(result.error.message);
        }

        // Si la compra fue exitosa, vaciar el carrito
        this.cartService.clearCart(); // Vacía el carrito
        console.log('Compra completada, carrito vaciado.');
    } catch (error) {
        console.error('Error al procesar la compra:', error);
        alert('Hubo un problema al procesar la compra. Por favor, inténtalo de nuevo.');
    }
}

  
  private async updateStockAfterPurchase(): Promise<void> {
    try {
      const response = await fetch('http://localhost:3000/api/productos/update-stock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: this.cartItems.map((item) => ({
            id: item.id,
            cantidad_comprada: item.cantidad,
          })),
        }),
      });
  
      if (!response.ok) {
        throw new Error('Error al actualizar el stock en la base de datos.');
      }
  
      console.log('El stock se ha actualizado correctamente en la base de datos.');
    } catch (error) {
      console.error('Error al actualizar el stock:', error);
    }
  }  
}