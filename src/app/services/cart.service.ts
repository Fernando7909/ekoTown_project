import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Producto } from '../services/product.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartItems = new BehaviorSubject<Producto[]>(this.loadCartFromStorage());
  cartItems$ = this.cartItems.asObservable();

  private apiUrl = 'http://localhost:3000/api/productos'; // URL del backend

  constructor(private http: HttpClient) {}

  // Cargar productos del carrito desde el almacenamiento local
  private loadCartFromStorage(): Producto[] {
    const cartData = localStorage.getItem('cartItems');
    return cartData ? JSON.parse(cartData) : [];
  }

  // Guardar productos del carrito en el almacenamiento local
  private saveCartToStorage(cart: Producto[]): void {
    localStorage.setItem('cartItems', JSON.stringify(cart));
  }

  // Añadir producto al carrito
  addToCart(producto: Producto): void {
    const currentCart = this.cartItems.value;

    const productoCompleto: Producto = {
      ...producto,
      cantidad: 1,
      cantidad_maxima: producto.stock ?? 0,
      stock: producto.stock ?? 0,
    };

    const productoExistente = currentCart.find(item => item.id === producto.id);
    if (productoExistente) {
      console.warn(`El producto con ID ${producto.id} ya está en el carrito.`);
      return;
    }

    const updatedCart = [...currentCart, productoCompleto];
    this.cartItems.next(updatedCart);
    this.saveCartToStorage(updatedCart);
    console.log('Producto añadido al carrito:', productoCompleto);
  }

  // Eliminar producto del carrito
  removeFromCart(productoId: number): void {
    const updatedCart = this.cartItems.value.filter(item => item.id !== productoId);
    this.cartItems.next(updatedCart);
    this.saveCartToStorage(updatedCart);
    console.log('Producto eliminado del carrito:', productoId);
  }

  // Obtener productos del carrito
  getCartItems(): Producto[] {
    return this.cartItems.value;
  }

  // Vaciar el carrito
  clearCart(): void {
    this.cartItems.next([]);
    localStorage.removeItem('cartItems');
    console.log('Carrito vaciado');
  }

  // Actualizar un producto del carrito
  updateCartItem(updatedItem: Producto): void {
    const currentCart = this.cartItems.value;
    const updatedCart = currentCart.map(item =>
      item.id === updatedItem.id ? updatedItem : item
    );
    this.cartItems.next(updatedCart);
    this.saveCartToStorage(updatedCart);
    console.log('Carrito actualizado:', updatedCart);
  }

  // Procesar compra y enviar datos al backend
  processPurchase(items: { id: number; cantidad: number }[]): void {
    this.http.post(`${this.apiUrl}/process-purchase`, { items }).subscribe({
      next: () => {
        console.log('Compra procesada con éxito.');
        this.clearCart(); // Vaciar carrito tras la compra
        alert('¡Compra realizada con éxito!');
      },
      error: (error) => {
        console.error('Error al procesar la compra:', error);
        alert('Hubo un error al procesar la compra. Por favor, inténtalo de nuevo.');
      },
    });
  }
}
