import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Producto {
  id?: number;
  business_manager_id: number;
  codigo: string;
  nombre: string;
  descripcion: string;
  categoria: string;
  cantidad: number;
  precio: number;
  imagen_url?: string;
  publicado: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:3000/api/productos'; // Cambia según tu configuración

  constructor(private http: HttpClient) {}

  // Obtener el token almacenado en el navegador
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); // Obtiene el token del localStorage
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  // Obtener todos los productos (opcional si usas autenticación)
  getProducts(): Observable<Producto[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<Producto[]>(this.apiUrl, { headers });
  }

  // Obtener productos por business_manager_id
  getProductsByBusinessManager(business_manager_id: number): Observable<Producto[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<Producto[]>(`${this.apiUrl}/${business_manager_id}`, { headers });
  }

  // Crear un nuevo producto
  createProduct(product: Producto): Observable<Producto> {
    const headers = this.getAuthHeaders();
    return this.http.post<Producto>(this.apiUrl, product, { headers });
  }

  // Actualizar un producto existente
  updateProduct(id: number, product: Producto): Observable<Producto> {
    const headers = this.getAuthHeaders();
    return this.http.put<Producto>(`${this.apiUrl}/${id}`, product, { headers });
  }

  // Eliminar un producto
  deleteProduct(id: number): Observable<void> {
    const headers = this.getAuthHeaders();
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers });
  }
}
