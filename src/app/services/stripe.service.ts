import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { loadStripe, Stripe } from '@stripe/stripe-js';

@Injectable({
  providedIn: 'root',
})
export class StripeService {
  private apiUrl = 'http://localhost:3000/api/stripe'; // Endpoint del backend
  private stripePromise = loadStripe('pk_test_51QSgOrLqhhGqu8RPHJgAgfjsajmkC6xfaU3AWwqk3FKzt1u0WbiwG8tA1ha1u6Z4anCQJrTmKVKZyJXRfYvmJd1H00OqihvOIV'); // Clave pública de Stripe

  constructor(private http: HttpClient) {}

  /**
   * Crear una sesión de Stripe Checkout
   * @param items Lista de productos con nombre, precio (en centavos) y cantidad
   * @returns Promesa que resuelve con un objeto que contiene el sessionId
   */
  async createCheckoutSession(items: { name: string; price: number; quantity: number }[]): Promise<{ sessionId: string }> {
    try {
      const response = await this.http.post<{ sessionId: string }>(
        `${this.apiUrl}/create-checkout-session`,
        { items }
      ).toPromise();
      
      if (!response || !response.sessionId) {
        throw new Error('La respuesta del servidor no contiene sessionId.');
      }

      return response;
    } catch (error) {
      console.error('Error al crear la sesión de Stripe:', error);
      throw new Error('No se pudo crear la sesión de Stripe.');
    }
  }

  /**
   * Redirigir al usuario a la página de pago de Stripe
   * @param sessionId ID de la sesión de Stripe
   */
  async redirectToCheckout(sessionId: string): Promise<void> {
    try {
      const stripe = await this.stripePromise;
      if (!stripe) {
        throw new Error('Stripe no está inicializado.');
      }

      const { error } = await stripe.redirectToCheckout({ sessionId });
      if (error) {
        throw new Error(`Error en la redirección a Stripe: ${error.message}`);
      }
    } catch (error) {
      console.error('Error al redirigir a Stripe Checkout:', error);
      throw new Error('No se pudo redirigir a la página de pago de Stripe.');
    }
  }
}
