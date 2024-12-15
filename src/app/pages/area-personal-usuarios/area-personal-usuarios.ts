import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { AuthUserService } from '../../services/auth-user.service'; // Importar AuthService
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-area-personal-usuarios',
  standalone: true,
  templateUrl: './area-personal-usuarios.html',
  styleUrls: ['./area-personal-usuarios.css'],
  imports: [
    NavbarComponent,
    FooterComponent,
    FormsModule,
  ]
})
export class AreaPersonalUsuariosPage implements OnInit {
  // Variables para manejar el estado de la vista
  userName: string = '';
  userLastName: string = '';
  userEmail: string = ''; // Nueva variable para el email
  userStatus: string = 'Activo';
  userId: number | undefined; // ID del usuario autenticado
  profileImageUrl: string = ''; // URL de la imagen de perfil

  constructor(private authUserService: AuthUserService, private router: Router, private http: HttpClient) {}

  ngOnInit(): void {
    this.loadUserProfile(); // Cargar el perfil del usuario al inicializar el componente
  }

  private loadUserProfile(): void {
    const userFullName = this.authUserService.getUserFullName();
    console.log('Cargando perfil del usuario:', userFullName);
    if (userFullName) {
      this.userName = userFullName.name;
      this.userLastName = userFullName.lastName;
      this.userEmail = this.authUserService.getUserEmail() || ''; // Actualizar email si es necesario
      this.userId = this.authUserService.getUserId(); // Asegurar que se obtiene el ID

      // Actualizar la URL de la imagen de perfil
      this.profileImageUrl = userFullName.profileImage
        ? `http://localhost:3000/${userFullName.profileImage}`
        : 'profileIcons/usuario.png'; // Imagen por defecto si no hay una imagen subida
    } else {
      console.error('No se encontraron datos del usuario. Redirigiendo al login...');
      this.router.navigate(['/login']);
    }
  }

  logout(): void {
    const confirmation = window.confirm('¿Estás seguro de que deseas cerrar sesión?'); // Mensaje de confirmación
    if (confirmation) {
      this.authUserService.logout(); // Limpia el estado del usuario y el almacenamiento
      this.router.navigate(['/loginregister']); // Redirige a la página de login
    }
  }

  // Métodos específicos de la vista
  actualizarEstado(): void {
    this.userStatus = 'Inactivo';
    console.log('Estado actualizado:', this.userStatus);
  }

  // Eliminar cuenta
  deleteAccount(): void {
    const confirmation = window.confirm('¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.');
    if (confirmation && this.userId) { // Asegúrate de que this.userId está definido
      this.http.delete(`http://localhost:3000/api/users/delete/${this.userId}`).subscribe(
        (response: any) => {
          console.log('Cuenta eliminada correctamente:', response.message);
          this.authUserService.logout(); // Limpia la sesión y redirige
          this.router.navigate(['/loginregister']);
        },
        (error: any) => {
          console.error('Error al eliminar la cuenta:', error);
        }
      );
    } else {
      console.error('No se puede eliminar la cuenta porque el userId no está definido.');
    }
  }

  // Guardar cambios en el perfil
  saveProfile(): void {
    if (!this.userId) {
      console.error('No se puede actualizar el perfil porque el userId no está definido.');
      return;
    }

    const updatedUser = {
      name: this.userName,
      last_name: this.userLastName,
      email: this.userEmail,
    };

    this.http.put(`http://localhost:3000/api/users/update/${this.userId}`, updatedUser).subscribe(
      (response: any) => {
        console.log('Perfil actualizado:', response.message);
        alert('Perfil actualizado con éxito.');
      },
      (error: any) => {
        console.error('Error al actualizar el perfil:', error);
        alert('Error al actualizar el perfil.');
      }
    );
  }

  selectProfileImage(): void {
    // Simula un clic en el input de tipo file
    const fileInput = document.getElementById('profileImageInput') as HTMLInputElement;
    fileInput.click();
  }

  uploadProfileImage(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
  
      // Validar el tipo de archivo
      if (!file.type.startsWith('image/')) {
        alert('Por favor, selecciona un archivo de imagen válido.');
        return;
      }
  
      // Crear un objeto FormData para enviar la imagen al backend
      const formData = new FormData();
      formData.append('profileImage', file);
      formData.append('userId', this.userId?.toString() || ''); // Asegúrate de incluir el userId
  
      // Realizar la solicitud al backend
      this.http.post('http://localhost:3000/api/users/uploadProfileImage', formData).subscribe({
        next: (response: any) => {
          console.log('Imagen de perfil actualizada:', response);
  
          // Actualizar el localStorage directamente
          const userFullName = this.authUserService.getUserFullName();
          if (userFullName) {
            userFullName.profileImage = response.imagePath; // Actualizamos la ruta de la imagen
            this.authUserService.setUserFullName(userFullName); // Guardamos en el localStorage
          }
  
          // Forzar la actualización de la URL en el frontend
          this.profileImageUrl = `http://localhost:3000/${response.imagePath}?t=${new Date().getTime()}`;
  
          alert('Imagen actualizada correctamente.');
        },
        error: (error: any) => {
          console.error('Error al actualizar la imagen de perfil:', error);
          alert('Hubo un problema al subir la imagen. Intenta nuevamente.');
        },
      });
    } else {
      alert('No se seleccionó ningún archivo.');
    }
  }
  
  
}
