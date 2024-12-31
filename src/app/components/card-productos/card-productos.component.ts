import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { Producto } from '../../services/product.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card-productos',
  standalone: true,
  templateUrl: './card-productos.component.html',
  styleUrls: ['./card-productos.component.css'],
  imports: [
    CommonModule
  ],
})
export class CardProductosComponent implements OnChanges {
  @Input() producto!: Producto; // Recibe un producto como entrada
  @Output() addToCart = new EventEmitter<Producto>(); // Evento para el carrito

  // Validar que el producto sea válido al recibir cambios
  ngOnChanges(): void {
    if (!this.producto || !this.producto.nombre) {
      console.warn('El producto recibido no es válido:', this.producto);
    }
  }

  // Método que emite el producto cuando se agrega al carrito
  onAddToCart(): void {
    console.log(`Producto añadido al carrito: ${this.producto.nombre}`);
    this.addToCart.emit(this.producto);
  }
}
