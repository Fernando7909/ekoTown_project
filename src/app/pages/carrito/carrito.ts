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
    });

    this.initializeStripe();
  }

  async initializeStripe(): Promise<void> {
    this.stripe = await loadStripe(this.stripePublicKey);
  }

  removeItem(productoId: number): void {
    this.cartService.removeFromCart(productoId);
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
    } catch (error) {
      console.error('Error al procesar la compra:', error);
      alert('Hubo un problema al procesar la compra. Por favor, inténtalo de nuevo.');
    }
  }
}
