import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Producto } from './product.service';

@Injectable({
  providedIn: 'root',
})
export class PublishedProductsService {
  private publishedProductsSubject = new BehaviorSubject<Producto[]>([]);
  publishedProducts$ = this.publishedProductsSubject.asObservable();

  publishProduct(product: Producto): void {
    console.log('Producto publicado desde el servicio:', product);
    const currentProducts = this.publishedProductsSubject.value;

    // Validar si el producto ya está publicado
    const exists = currentProducts.some((p) => p.id === product.id);
    if (exists) {
        console.warn(`El producto con ID ${product.id} ya está publicado.`);
        return;
    }

    this.publishedProductsSubject.next([...currentProducts, product]);
    console.log(`Producto publicado:`, product);
    console.log('Estado completo de productos publicados:', this.publishedProductsSubject.value);
}


  // Método adicional para filtrar productos por manager ID
  getProductsByManagerId(managerId: number): Producto[] {
    return this.publishedProductsSubject.value.filter(
      (product) => product.business_manager_id === managerId
    );
  }
}
