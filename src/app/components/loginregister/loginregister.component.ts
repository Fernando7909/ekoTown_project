import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { NavbarComponent } from "../navbar/navbar.component";

@Component({
  selector: 'app-login-register',
  standalone: true,
  templateUrl: './loginregister.component.html',
  styleUrls: ['./loginregister.component.css'],
  imports: [CommonModule, FormsModule, NavbarComponent]
})
export class LoginregisterComponent {
  // Control del panel de login/registro de usuarios y Business Managers
  isRegisterActive: boolean = false;
  isBusinessManagerActive: boolean = false;

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
  // loginCommerceId: string = ''; // Comentado: Campo relacionado con ID Comercio
  loginManagerPassword: string = '';

  // Variables para el formulario de registro de Business Manager
  managerName: string = '';
  managerLastName: string = '';
  managerDNI: string = '';
  managerEmail: string = '';
  managerAddress: string = '';
  managerPassword: string = '';

  // Variables para controlar mensajes dinámicos
  successMessage: string = ''; // Texto del mensaje
  showMessage: boolean = false; // Control de visibilidad del mensaje
  isError: boolean = false; // Indica si el mensaje es un error

  constructor(
    private authService: AuthService, 
    private router: Router
  ) {}

  // Método para mostrar mensajes de éxito o error
  displayMessage(message: string, isError: boolean = false) {
    this.successMessage = message;
    this.showMessage = true;
    this.isError = isError;

    // Ocultar el mensaje después de 5 segundos
    setTimeout(() => {
      this.showMessage = false;
      this.successMessage = '';
    }, 5000);
  }

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
    
        // Extraer y usar el nombre del usuario
        const userName = response?.name; 
        this.authService.setUserName(userName); // Guardar el nombre en el estado global
    
        // Mostrar mensaje de éxito
        this.displayMessage(`Inicio de sesión exitoso. Bienvenido, ${userName}.`);
    
        // Redirigir después de 4 segundos
        setTimeout(() => {
          this.router.navigate(['']); 
        }, 4000);
      },
      (error: any) => {
        console.error('Error al iniciar sesión:', error);
        this.displayMessage('Error al iniciar sesión. Verifica tus credenciales.', true);
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
        this.authService.setUserFullName({
          name: this.registerName,
          lastName: this.registerLastName,
          email: this.registerEmail 
        });

        this.router.navigate(['/area-personal-usuarios']);
      },
      (error: any) => {
        console.error('Error al registrarse:', error);
      }
    );
  }

  // Método para iniciar sesión de Business Manager
 // Método para iniciar sesión de Business Manager
onManagerLogin() {
  const managerCredentials = {
    email: this.loginManagerEmail,
    password: this.loginManagerPassword,
  };

  console.log('Credenciales enviadas al backend:', managerCredentials); // Log de las credenciales enviadas

  this.authService.loginManager(managerCredentials).subscribe(
    (response: any) => {
      console.log('Respuesta del backend:', response); // Log de la respuesta exitosa del backend

      const managerName = response?.name || 'Manager';
      console.log('Nombre del Business Manager recibido:', managerName); // Log del nombre recibido

      this.authService.setUserName(managerName);

      this.displayMessage(`Inicio de sesión de Business Manager exitoso. Bienvenido, ${managerName}.`);

      setTimeout(() => {
        console.log('Redirigiendo a la página principal...'); // Log antes de redirigir
        this.router.navigate(['']);
      }, 4000);
    },
    (error: any) => {
      console.error('Error recibido del backend:', error); // Log detallado del error recibido
      if (error.status === 400) {
        console.error('Error 400: Credenciales inválidas o problema con el backend.');
      } else {
        console.error('Error desconocido:', error);
      }
      this.displayMessage('Error al iniciar sesión de Business Manager. Verifica tus credenciales.', true);
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
        this.displayMessage('Business Manager registrado exitosamente. Ahora puedes iniciar sesión.');
        this.toggleManagerPanel();
      },
      (error: any) => {
        console.error('Error al registrarse como Business Manager:', error);
        this.displayMessage('Error al registrarse como Business Manager. Por favor, intenta de nuevo.', true);
      }
    );
  }  
}
