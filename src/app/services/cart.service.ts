import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Producto } from '../services/product.service';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartItems = new BehaviorSubject<Producto[]>(this.loadCartFromStorage());
  cartItems$ = this.cartItems.asObservable();

  private loadCartFromStorage(): Producto[] {
    const cartData = localStorage.getItem('cartItems');
    return cartData ? JSON.parse(cartData) : [];
  }

  private saveCartToStorage(cart: Producto[]): void {
    localStorage.setItem('cartItems', JSON.stringify(cart));
  }

  addToCart(producto: Producto): void {
    const currentCart = this.cartItems.value;

    const productoCompleto: Producto = {
      ...producto,
      cantidad: 1, // Inicialmente 1 unidad
      cantidad_maxima: producto.stock ?? 0, // Máximo permitido igual al stock
      stock: producto.stock ?? 0, // Stock disponible
    };

    const productoExistente = currentCart.find(item => item.id === producto.id);
    if (productoExistente) {
      console.warn(`El producto con ID ${producto.id} ya está en el carrito.`);
      return;
    }

    const updatedCart = [...currentCart, productoCompleto];
    this.cartItems.next(updatedCart);
    this.saveCartToStorage(updatedCart); // Guardar en localStorage
    console.log('Producto añadido al carrito:', productoCompleto);
  }

  removeFromCart(productoId: number): void {
    const updatedCart = this.cartItems.value.filter(item => item.id !== productoId);
    this.cartItems.next(updatedCart);
    this.saveCartToStorage(updatedCart); // Actualizar localStorage
    console.log('Producto eliminado del carrito:', productoId);
  }

  getCartItems(): Producto[] {
    return this.cartItems.value;
  }

  clearCart(): void {
    this.cartItems.next([]);
    this.saveCartToStorage([]); // Limpiar localStorage
    console.log('Carrito vaciado');
  }

  updateCartItem(updatedItem: Producto): void {
    const currentCart = this.cartItems.value;
    const updatedCart = currentCart.map(item => 
      item.id === updatedItem.id ? updatedItem : item
    );
    this.cartItems.next(updatedCart);
    this.saveCartToStorage(updatedCart); // Actualizar localStorage
    console.log('Carrito actualizado:', updatedCart);
  }
}
