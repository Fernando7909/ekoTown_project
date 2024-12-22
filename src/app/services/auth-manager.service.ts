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

  private bmFullName: { 
    name: string; 
    lastName: string; 
    email: string; 
    profileImage?: string; 
    dni?: string; 
    address?: string; 
  } | null = null;

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


  registerManager(managerData: any): Observable<any> {
    return this.http.post(`${this.apiManagerUrl}/register`, managerData).pipe(
      tap((response) => {
        console.log('Registro de Business Manager exitoso:', response);
      })
    );
  }
  

  // Actualizar el nombre del Business Manager en el BehaviorSubject
  setManagerName(name: string): void {
    this.managerNameSubject.next(name);
  }

  // Guardar el perfil completo del Business Manager
  setBmFullName(fullName: { 
    name: string; 
    lastName: string; 
    email: string; 
    profileImage?: string; 
    dni?: string; 
    address?: string; 
  }): void {
    console.log('Objeto recibido en setBmFullName:', fullName);
  
    this.bmFullName = { 
      name: fullName.name || '',
      lastName: fullName.lastName || '',
      email: fullName.email || '',
      profileImage: fullName.profileImage || '',
      dni: fullName.dni ? fullName.dni : this.bmFullName?.dni || '', // No sobrescribir si ya existe un valor válido
      address: fullName.address ? fullName.address : this.bmFullName?.address || '' // Igual para dirección
    };
  
    console.log('Objeto final antes de guardar en localStorage:', this.bmFullName);
    localStorage.setItem('bmFullName', JSON.stringify(this.bmFullName));
    this.setManagerName(fullName.name);
    console.log('Guardado en localStorage:', localStorage.getItem('bmFullName'));
  }
  



  // Obtener el perfil completo del Business Manager
  getBmFullName(): { name: string; lastName: string; email: string; profileImage?: string; dni?: string; address?: string } | null {
    if (!this.bmFullName) {
      const storedBm = localStorage.getItem('bmFullName');
      if (storedBm) {
        this.bmFullName = JSON.parse(storedBm);
        console.log("auth-manager: " + this.bmFullName);
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
      try {
        const payloadBase64 = token.split('.')[1];
        if (!payloadBase64) {
          console.error('Token malformado, no contiene payload');
          return undefined;
        }
        const decodedPayload = JSON.parse(atob(payloadBase64));
        return decodedPayload.managerId;
      } catch (error) {
        console.error('Error al decodificar el token:', error);
      }
    } else {
      console.warn('No se encontró un token en localStorage');
    }
    return undefined;
  }
  


  // Método de Login del Business Manager (simplificado)
  loginManager(managerCredentials: any): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiManagerUrl}/login`, managerCredentials).pipe(
      tap((response: any) => {
        // Log de la respuesta completa del backend
        console.log('Respuesta completa del backend en loginManager:', response);

        // Preparar el objeto fullName
        const fullName = {
          name: response?.name || '',
          lastName: response?.last_name || '',
          email: response?.email || '',
          profileImage: response?.profileImage || '',
          dni: response?.dni || '',
          address: response?.address || '',
        };
        

        // Log del objeto fullName antes de guardarlo
        console.log('Objeto fullName antes de guardarlo en localStorage:', fullName);

        // Guardar token en localStorage
        console.log('Guardando token en localStorage:', response.token);
        localStorage.setItem('token', response.token);

        // Llamada a setBmFullName con el objeto completo
        console.log('Llamando a setBmFullName con el objeto:', fullName);
        this.setBmFullName(fullName);

        // Actualizar el BehaviorSubject del nombre
        console.log('Actualizando el nombre en BehaviorSubject:', response.name || '');
        this.setManagerName(response.name || '');
      })
    );
  }

  


  // Método para cerrar sesión
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('bmFullName');
    this.managerNameSubject.next(null);
    this.bmFullName = null; // Limpia el estado interno
    console.log('Sesión de Business Manager cerrada');
    this.router.navigate(['/loginregister']);
  }
}
