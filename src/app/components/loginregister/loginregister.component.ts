import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthUserService } from '../../services/auth-user.service';
import { AuthManagerService } from '../../services/auth-manager.service';
import { Router } from '@angular/router';
import { NavbarComponent } from "../navbar/navbar.component";
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-login-register',
  standalone: true,
  templateUrl: './loginregister.component.html',
  styleUrls: ['./loginregister.component.css'],
  imports: [
    CommonModule, 
    FormsModule, 
    NavbarComponent,
    FooterComponent,
  ]
})
export class LoginregisterComponent {
  // Control del panel de login/registro de usuarios y Business Managers
  isRegisterActive: boolean = false;
  isBusinessManagerActive: boolean = false;

  // Variables para el formulario de login de usuarios
  loginEmail: string = '';
  loginPassword: string = '';
  isPasswordVisible: boolean = false;

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
    private authUserService: AuthUserService,
    private authManagerService: AuthManagerService,
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
  togglePanel(): void {
    this.isRegisterActive = !this.isRegisterActive;
  }
  

  // Cambiar entre los paneles de registro/login de Business Manager
  toggleManagerPanel() {
    this.isBusinessManagerActive = !this.isBusinessManagerActive;
  }

  // Función para alternar entre mostrar y ocultar la contraseña
  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  // Método para iniciar sesión de usuario
  onLogin() {
    const credentials = {
      email: this.loginEmail,
      password: this.loginPassword,
    };

    this.authUserService.login(credentials).subscribe(
      (response: any) => {
        console.log('Inicio de sesión exitoso:', response);
    
        // Extraer y usar el nombre del usuario
        const userName = response?.name; 
        this.authUserService.setUserName(userName); // Guardar el nombre en el estado global
    
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
    console.log('Datos antes de enviar al servicio:', {
      name: this.registerName,
      lastName: this.registerLastName,
      email: this.registerEmail,
      password: this.registerPassword,
    });
  
    const userData = {
      name: this.registerName,
      last_name: this.registerLastName,
      email: this.registerEmail,
      password: this.registerPassword,
    };
  
    this.authUserService.register(userData).subscribe(
      (response: any) => {
        console.log('Registro exitoso:', response);
        // Muestra un mensaje de éxito sin actualizar el estado global
        this.displayMessage('Registro exitoso. Por favor, inicia sesión para continuar.');
  
        // Limpia los campos del formulario
        this.registerName = '';
        this.registerLastName = '';
        this.registerEmail = '';
        this.registerPassword = '';
  
        // Redirige al formulario de inicio de sesión
        this.togglePanel();
      },
      (error: any) => {
        console.error('Error al registrarse:', error);
        this.displayMessage('Error al registrarse. Intenta de nuevo.', true);
      }
    );
  }
  
  




 // Método para iniciar sesión de Business Manager
 onManagerLogin() {
  const managerCredentials = {
    email: this.loginManagerEmail,
    password: this.loginManagerPassword,
  };

  console.log('Credenciales enviadas al backend:', managerCredentials);

  this.authManagerService.loginManager(managerCredentials).subscribe(
    (response: any) => {
      console.log('Respuesta del backend:', response);

      // Almacenar el token y el ID del Business Manager en el localStorage
      localStorage.setItem('token', response.token); // Guardar el token
      localStorage.setItem('business_manager_id', response.managerId); // Guardar el ID del Business Manager

      const managerName = response?.name || 'Manager';
      console.log('Nombre del Business Manager recibido:', managerName);

      this.authManagerService.setBmFullName({
        name: managerName,
        lastName: response?.last_name || '',
        email: response?.email || '',
      });

      this.displayMessage(`Inicio de sesión de Business Manager exitoso. Bienvenido, ${managerName}.`);

      setTimeout(() => {
        console.log('Redirigiendo a la página principal...');
        this.router.navigate(['']);
      }, 4000);
    },
    (error: any) => {
      console.error('Error recibido del backend:', error);
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
  
    this.authManagerService.registerManager(managerData).subscribe(
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
