import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoginResponse } from './types';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // URL del backend donde se procesan las solicitudes de registro e inicio de sesión
  private apiUrl = 'http://localhost:3000/api/users';

  constructor(private http: HttpClient) {}

  // Método para registrar un nuevo usuario
  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData).pipe(
      tap(response => {
        console.log('Registro exitoso:', response);
      })
    );
  }

  // Método para iniciar sesión
  login(credentials: any): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        // Guardar el token en el almacenamiento local si el login es exitoso
        localStorage.setItem('token', response.token);
        console.log('Inicio de sesión exitoso:', response);
      })
    );
  }

  // Método para cerrar sesión
  logout() {
    localStorage.removeItem('token');
    console.log('Sesión cerrada');
  }

  // Método para verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !!token; // Devuelve true si hay un token almacenado, false si no
  }
}
