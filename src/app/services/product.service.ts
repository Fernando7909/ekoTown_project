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
  imagen_url?: string | null; // URL de la imagen guardada en el backend
  imagenFile?: File | null; // Archivo seleccionado en el frontend
  publicado: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = 'http://localhost:3000/api/productos'; // Cambia según tu configuración

  constructor(private http: HttpClient) {}

  // Obtener el token almacenado en el navegador
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); // Obtiene el token del localStorage
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
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
  createProduct(product: FormData): Observable<any> {
    const headers = this.getAuthHeaders(); // Incluir token si es necesario
    return this.http.post(this.apiUrl, product, { headers }); // No configurar manualmente Content-Type
  }

  // Actualizar un producto existente
  updateProduct(id: number, product: FormData): Observable<any> {
    const headers = this.getAuthHeaders(); // Incluir token si es necesario
    return this.http.put(`${this.apiUrl}/${id}`, product, { headers }); // No configurar manualmente Content-Type
  }

  // Eliminar un producto
  deleteProduct(id: number): Observable<void> {
    const headers = this.getAuthHeaders();
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers });
  }
}
