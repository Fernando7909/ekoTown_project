import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoginResponse } from './types';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/users';
  private apiManagerUrl = 'http://localhost:3000/api/business-managers';


  constructor(private http: HttpClient) {}

  // Método para registrar un nuevo usuario
  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData).pipe(
      tap(response => console.log('Registro de usuario exitoso:', response))
    );
  }

  // Método para iniciar sesión de usuario
  login(credentials: any): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
        console.log('Inicio de sesión de usuario exitoso:', response);
      })
    );
  }

  // Método para registrar un nuevo Business Manager
  registerManager(managerData: any): Observable<any> {
    return this.http.post(`${this.apiManagerUrl}/register`, managerData).pipe(
      tap(response => console.log('Registro de Business Manager exitoso:', response))
    );
  }

  // Método para iniciar sesión de Business Manager
  loginManager(managerCredentials: any): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiManagerUrl}/login`, managerCredentials).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
        console.log('Inicio de sesión de Business Manager exitoso:', response);
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
    return !!token; 
  }
}
