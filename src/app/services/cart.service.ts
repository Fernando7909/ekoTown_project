import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Producto } from '../services/product.service';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartItems = new BehaviorSubject<Producto[]>([]);
  cartItems$ = this.cartItems.asObservable();

  addToCart(producto: Producto): void {
    const currentCart = this.cartItems.value;
    this.cartItems.next([...currentCart, producto]);
    console.log('Producto añadido al carrito:', producto);
  }

  removeFromCart(productoId: number): void {
    const updatedCart = this.cartItems.value.filter((item) => item.id !== productoId);
    this.cartItems.next(updatedCart);
    console.log('Producto eliminado del carrito:', productoId);
  }

  getCartItems(): Producto[] {
    return this.cartItems.value;
  }
}
