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
  // Control del panel de login/registro
  isRegisterActive: boolean = false;

  // Variables para el formulario de login
  loginEmail: string = '';
  loginPassword: string = '';

  // Variables para el formulario de registro
  registerName: string = '';
  registerLastName: string = '';
  registerEmail: string = '';
  registerPassword: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  togglePanel() {
    this.isRegisterActive = !this.isRegisterActive;
  }

  // Método para iniciar sesión
  onLogin() {
    const credentials = {
      email: this.loginEmail,
      password: this.loginPassword,
    };

    this.authService.login(credentials).subscribe(
      (response: any) => {
        console.log('Inicio de sesión exitoso:', response);
        this.router.navigate(['/dashboard']); // Cambiar por la ruta que desees
      },
      (error: any) => {
        console.error('Error al iniciar sesión:', error);
        alert('Error al iniciar sesión. Verifica tus credenciales.');
      }
    );
  }

  // Método para registrarse
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
}
