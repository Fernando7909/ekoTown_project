import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  private apiUrl = 'http://localhost:3000/api/blogs'; // URL base de la API de blogs

  constructor(private http: HttpClient) {}

  // Obtener todos los blogs
  getAllBlogs(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      catchError((error) => {
        console.error('Error al obtener blogs:', error);
        return throwError(error); // Re-emitir el error para que lo maneje el componente
      })
    );
  }

  // Obtener un blog por ID
  getBlogById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        console.error('Error al obtener el blog:', error);
        return throwError(error);
      })
    );
  }

  // Crear un nuevo blog
  createBlog(blogData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, blogData).pipe(
      catchError((error) => {
        console.error('Error al crear el blog:', error);
        return throwError(error);
      })
    );
  }

  // Actualizar un blog existente
  updateBlog(id: number, blogData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, blogData).pipe(
      catchError((error) => {
        console.error('Error al actualizar el blog:', error);
        return throwError(error);
      })
    );
  }

  // Eliminar un blog
  deleteBlog(id: number): Observable<any> {
    if (id === null || id === undefined) {
      throw new Error('El ID es obligatorio');
    }
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  // Obtener blogs por businessManagerId
  getBlogsByBusinessManagerId(businessManagerId: number): Observable<any[]> {
    const url = `${this.apiUrl}/businessManager/${businessManagerId}`;
    return this.http.get<any[]>(url).pipe(
      catchError((error) => {
        console.error('Error al obtener blogs por businessManagerId:', error);
        return throwError(error);
      })
    );
  }
}