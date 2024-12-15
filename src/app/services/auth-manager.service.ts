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
export class AuthManagerService {
  private apiManagerUrl = 'http://localhost:3000/api/business-managers';

  // BehaviorSubject para el nombre del Business Manager
  private managerNameSubject = new BehaviorSubject<string | null>(null);
  public userName$ = this.managerNameSubject.asObservable();

  private bmFullName: { name: string; lastName: string; email: string; profileImage?: string } | null = null;

  constructor(private http: HttpClient, private router: Router) {
    // Inicializa la sesión si existe en localStorage
    const storedBm = localStorage.getItem('bmFullName');
    if (storedBm) {
      this.bmFullName = JSON.parse(storedBm);
      if (this.bmFullName && this.bmFullName.name) {
        this.managerNameSubject.next(this.bmFullName.name); // Actualiza el BehaviorSubject con el nombre
      }
    }
  }
  

  // Actualizar el nombre del Business Manager en el BehaviorSubject
  setManagerName(name: string): void {
    this.managerNameSubject.next(name);
  }

  // Registrar un nuevo Business Manager
  registerManager(managerData: any): Observable<any> {
    console.log('Datos enviados al backend para registro de Business Manager:', managerData);
    return this.http.post(`${this.apiManagerUrl}/register`, managerData).pipe(
      tap((response) => console.log('Registro exitoso de Business Manager:', response))
    );
  }

  // Guardar el perfil completo del Business Manager
  setBmFullName(fullName: { name: string; lastName: string; email: string; profileImage?: string }): void {
    this.bmFullName = fullName;
    localStorage.setItem('bmFullName', JSON.stringify(fullName));
    this.setManagerName(fullName.name); // Actualizar BehaviorSubject con el nombre
  }

  // Obtener el perfil completo del Business Manager
  getBmFullName(): { name: string; lastName: string; email: string; profileImage?: string } | null {
    if (!this.bmFullName) {
      const storedBm = localStorage.getItem('bmFullName');
      if (storedBm) {
        this.bmFullName = JSON.parse(storedBm);
      }
    }
    return this.bmFullName;
  }

  getBmEmail(): string {
    const bm = this.getBmFullName();
    return bm ? bm.email : '';
  }

  getBmId(): number | undefined {
    const token = localStorage.getItem('token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.managerId;
    }
    return undefined;
  }

  loginManager(managerCredentials: any): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiManagerUrl}/login`, managerCredentials).pipe(
      tap((response) => {
        localStorage.setItem('token', response.token);
        this.setBmFullName({
          name: response.name || '',
          lastName: response.last_name || '',
          email: response.email || '',
          profileImage: response.profileImage || '',
        });
        this.setManagerName(response.name || ''); // Actualizar BehaviorSubject
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('bmFullName');
    this.managerNameSubject.next(null);
    this.bmFullName = null; // Limpia el estado interno
    console.log('Sesión de Business Manager cerrada');
    this.router.navigate(['/loginregister']);
  }
}

