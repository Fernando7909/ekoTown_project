import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

export interface LoginResponse {
  token: string;
  name?: string;
  last_name?: string;
  email?: string;
  profileImage?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthUserService {
  private apiUrl = 'http://localhost:3000/api/users';

  // BehaviorSubject para el nombre del usuario
  private userNameSubject = new BehaviorSubject<string | null>(null);
  public userName$ = this.userNameSubject.asObservable();

  // Variable local para el perfil del usuario
  private userFullName: { name: string; lastName: string; email: string; profileImage?: string } | null = null;

  constructor(private http: HttpClient, private router: Router) {
    // Restaurar sesión del usuario desde localStorage
    const storedUser = localStorage.getItem('userFullName');
    if (storedUser) {
      this.userFullName = JSON.parse(storedUser);
      if (this.userFullName && this.userFullName.name) {
        this.userNameSubject.next(this.userFullName.name); // Actualizar BehaviorSubject
      }
    }
  }
  

  // Actualizar el nombre del usuario
  setUserName(name: string): void {
    this.userNameSubject.next(name);
  }

  // Guardar el perfil completo del usuario
  setUserFullName(fullName: { name: string; lastName: string; email: string; profileImage?: string }): void {
    this.userFullName = fullName;
    localStorage.setItem('userFullName', JSON.stringify(fullName));
    this.setUserName(fullName.name); // Asegurarse de actualizar el BehaviorSubject
  }

  // Obtener el perfil completo del usuario
  getUserFullName(): { name: string; lastName: string; email: string; profileImage?: string } | null {
    if (!this.userFullName) {
      const storedUser = localStorage.getItem('userFullName');
      if (storedUser) {
        this.userFullName = JSON.parse(storedUser);
      }
    }
    return this.userFullName;
  }

  // Obtener el email del usuario
  getUserEmail(): string {
    const user = this.getUserFullName();
    return user ? user.email : '';
  }

  // Obtener el ID del usuario desde el token
  getUserId(): number | undefined {
    const token = localStorage.getItem('token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1])); // Decodificar el token JWT
      return payload.userId; // Asegúrate de que el backend incluya userId en el token
    }
    return undefined;
  }

  // Método para cerrar sesión
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userFullName');
    this.userNameSubject.next(null);
    this.userFullName = null; // Limpia el estado local
    this.router.navigate(['/loginregister']);
    console.log('Sesión cerrada');
  }

  // Método para iniciar sesión de usuario
  login(credentials: any): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap((response) => {
        localStorage.setItem('token', response.token);
        this.setUserFullName({
          name: response.name || '',
          lastName: response.last_name || '',
          email: response.email || '',
          profileImage: response.profileImage || '',
        });
      })
    );
  }

  // Método para registrar un nuevo usuario
  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData).pipe(
      tap((response) => console.log('Registro exitoso:', response))
    );
  }
}

