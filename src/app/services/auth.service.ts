import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface LoginResponse {
  token: string;
  name?: string; // Ajusta según los datos que tu API devuelve
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/users';
  private apiManagerUrl = 'http://localhost:3000/api/business-managers';

  // BehaviorSubject para gestionar el estado del usuario
  private userNameSubject = new BehaviorSubject<string | null>(null);
  public userName$ = this.userNameSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Método para actualizar el nombre del usuario
  setUserName(name: string): void {
    this.userNameSubject.next(name);
  }

  // Método para limpiar el estado del nombre del usuario
  clearUserName(): void {
    this.userNameSubject.next(null);
  }

  // Método para registrar un nuevo usuario
  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData).pipe(
      tap((response) => console.log('Registro de usuario exitoso:', response))
    );
  }

  registerManager(managerData: any): Observable<any> {
    return this.http.post(`${this.apiManagerUrl}/register`, managerData).pipe(
      tap((response) => console.log('Registro de Business Manager exitoso:', response))
    );
  }

  // Método para iniciar sesión de usuario
  login(credentials: any): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap((response) => {
        localStorage.setItem('token', response.token);

        // Actualiza el estado del nombre del usuario si está presente en la respuesta
        if (response.name) {
          this.setUserName(response.name);
        }

        console.log('Inicio de sesión de usuario exitoso:', response);
      })
    );
  }

  // Método para iniciar sesión de Business Manager
  loginManager(managerCredentials: any): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiManagerUrl}/login`, managerCredentials).pipe(
      tap((response) => {
        localStorage.setItem('token', response.token);

        // Actualiza el estado del nombre del Business Manager si está presente en la respuesta
        if (response.name) {
          this.setUserName(response.name);
        }

        console.log('Inicio de sesión de Business Manager exitoso:', response);
      })
    );
  }

  // Método para cerrar sesión
  logout(): void {
    localStorage.removeItem('token');
    this.clearUserName(); // Limpia el estado del usuario al cerrar sesión
    console.log('Sesión cerrada');
  }

  // Método para verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !!token;
  }
}
