import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-register',
  standalone: true,
  templateUrl: './loginregister.component.html',
  styleUrls: ['./loginregister.component.css'],
  imports: [CommonModule, FormsModule]
})
export class LoginregisterComponent {
  // Control del panel de login/registro de usuarios y Business Managers
  isRegisterActive: boolean = false;
  isBusinessManagerActive: boolean = false; // Nueva propiedad para Business Managers

  // Variables para el formulario de login de usuarios
  loginEmail: string = '';
  loginPassword: string = '';

  // Variables para el formulario de registro de usuarios
  registerName: string = '';
  registerLastName: string = '';
  registerEmail: string = '';
  registerPassword: string = '';

  // Variables para el formulario de login de Business Manager
  loginManagerEmail: string = '';
  loginCommerceId: string = '';
  loginManagerPassword: string = '';

  // Variables para el formulario de registro de Business Manager
  managerName: string = '';
  managerLastName: string = '';
  managerDNI: string = '';
  managerEmail: string = '';
  managerAddress: string = '';
  managerPassword: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  // Cambiar entre los paneles de registro/login de usuario
  togglePanel() {
    this.isRegisterActive = !this.isRegisterActive;
  }

  // Cambiar entre los paneles de registro/login de Business Manager
  toggleManagerPanel() {
    this.isBusinessManagerActive = !this.isBusinessManagerActive;
  }

  // Método para iniciar sesión de usuario
  onLogin() {
    const credentials = {
      email: this.loginEmail,
      password: this.loginPassword,
    };

    this.authService.login(credentials).subscribe(
      (response: any) => {
        console.log('Inicio de sesión exitoso:', response);
        this.router.navigate(['/dashboard']); // Cambia por la ruta deseada
      },
      (error: any) => {
        console.error('Error al iniciar sesión:', error);
        alert('Error al iniciar sesión. Verifica tus credenciales.');
      }
    );
  }

  // Método para registrar un usuario
  onRegister() {
    const userData = {
      name: this.registerName,
      last_name: this.registerLastName,
      email: this.registerEmail,
      password: this.registerPassword,
    };

    this.authService.register(userData).subscribe(
      (response: any) => {
        console.log('Registro exitoso:', response);
        alert('Usuario registrado exitosamente. Ahora puedes iniciar sesión.');
        this.togglePanel();
      },
      (error: any) => {
        console.error('Error al registrar usuario:', error);
        alert('Error al registrarse. Por favor, intenta de nuevo.');
      }
    );
  }

  // Método para iniciar sesión de Business Manager
  onManagerLogin() {
    const managerCredentials = {
      email: this.loginManagerEmail,
      commerce_id: this.loginCommerceId,
      password: this.loginManagerPassword,
    };

    this.authService.login(managerCredentials).subscribe(
      (response: any) => {
        console.log('Inicio de sesión de Business Manager exitoso:', response);
        this.router.navigate(['/business-dashboard']); // Cambia por la ruta de Business Manager
      },
      (error: any) => {
        console.error('Error al iniciar sesión de Business Manager:', error);
        alert('Error al iniciar sesión de Business Manager. Verifica tus credenciales.');
      }
    );
  }

  // Método para registrar un Business Manager
  onManagerRegister() {
    const managerData = {
      name: this.managerName,
      last_name: this.managerLastName,
      dni: this.managerDNI,
      email: this.managerEmail,
      address: this.managerAddress,
      password: this.managerPassword,
    };

    this.authService.registerManager(managerData).subscribe(
      (response: any) => {
        console.log('Registro de Business Manager exitoso:', response);
        alert('Business Manager registrado exitosamente. Ahora puedes iniciar sesión.');
        this.toggleManagerPanel();
      },
      (error: any) => {
        console.error('Error al registrar Business Manager:', error);
        alert('Error al registrarse. Por favor, intenta de nuevo.');
      }
    );
  }
}
