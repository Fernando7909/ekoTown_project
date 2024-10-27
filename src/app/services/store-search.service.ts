import { Injectable } from '@angular/core'; 
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StoreSearchService {
  // URL que apunta al backend, no a la API de Yelp directamente
  private apiUrl = 'http://localhost:3000/api/yelp'; 

  constructor(private http: HttpClient) {}

  // Método para buscar tiendas utilizando la API de Yelp a través del backend
  searchStores(location: string, categories: string, radius: string): Observable<any> {
    // Crear parámetros para la solicitud
    const params = { 
      location, 
      categories, 
      radius 
    };

    return this.http.get<any>(this.apiUrl, { params }).pipe(
      catchError(error => {
        console.error('Error al buscar tiendas:', error);
        return throwError(error); // Propaga el error
      })
    );
  }  
}
