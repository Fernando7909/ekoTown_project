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
  profileImage?: string; // Agregar propiedad para manejar la imagen de perfil
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

  constructor(private http: HttpClient, private router: Router) {
    // Inicializar estado del usuario desde localStorage
    const storedUser = localStorage.getItem('userFullName');
    if (storedUser) {
      const userFullName = JSON.parse(storedUser);
      this.userFullName = userFullName;
      this.setUserName(userFullName.name); // Actualizar el nombre en BehaviorSubject
    }
  }

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
    const formattedData = {
      ...userData,
      last_name: userData.lastName, // Mapear lastName a last_name
    };

    return this.http.post(`${this.apiUrl}/register`, formattedData).pipe(
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

        // Guardar nombre, apellido, email y profileImage
        if (response.name && response.last_name && response.email) {
          this.setUserFullName({
            name: response.name,
            lastName: response.last_name,
            email: response.email,
            profileImage: response.profileImage || '', // Asegurarse de manejar la imagen de perfil
          });
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
          this.setUserFullName({
            name: response.name,
            lastName: '',
            email: '',
            profileImage: '', // Imagen vacía para Business Managers
          });
        }

        console.log('Inicio de sesión de Business Manager exitoso:', response);
      })
    );
  }

  // Método para cerrar sesión
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userFullName'); // Limpia también el almacenamiento persistente
    this.clearUserName(); // Limpia el estado del usuario al cerrar sesión
    console.log('Sesión cerrada');

    // Redirigir al login
    this.router.navigate(['/login']);
  }

  // Método para verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !!token;
  }

  // Manejo del nombre, apellido, email y profileImage del usuario
  private userFullName: { name: string; lastName: string; email: string; profileImage?: string } | null = null;

  setUserFullName(fullName: { name: string; lastName: string; email: string; profileImage?: string }): void {
    this.userFullName = fullName;
    localStorage.setItem('userFullName', JSON.stringify(fullName)); // Guarda todos los datos
  }

  getUserFullName(): { name: string; lastName: string; email: string; profileImage?: string } | null {
    if (!this.userFullName) {
      const storedUser = localStorage.getItem('userFullName');
      if (storedUser) {
        this.userFullName = JSON.parse(storedUser);
      }
    }
    return this.userFullName;
  }

  getUserId(): number | undefined {
    const token = localStorage.getItem('token'); // Supongamos que el token almacena el userId
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1])); // Decodifica el JWT
      return payload.userId; // Asegúrate de que el backend incluya userId en el token
    }
    return undefined;
  }

  getUserEmail(): string {
    const user = this.getUserFullName();
    return user ? user.email : ''; // Devuelve el email o una cadena vacía
  }
}
