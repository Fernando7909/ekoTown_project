import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-area-personal-bm',
  standalone: true,
  templateUrl: './area-personal-bm.html',
  styleUrls: ['./area-personal-bs.css'],
  imports: [
    NavbarComponent,
    FooterComponent,
    FormsModule,
  ],
})
export class AreaPersonalBmPage implements OnInit {
  // Variables para manejar el estado de la vista
  bmName: string = '';
  bmLastName: string = '';
  bmEmail: string = '';
  bmStatus: string = 'Activo';
  bmId: number | undefined; // ID del Business Manager autenticado
  profileImageUrl: string = ''; // URL de la imagen de perfil

  constructor(private authService: AuthService, private router: Router, private http: HttpClient) {}

  ngOnInit(): void {
    this.loadBmProfile(); // Cargar el perfil del Business Manager al inicializar el componente
  }

  private loadBmProfile(): void {
    const bmFullName = this.authService.getBmFullName(); // Adaptado para Business Manager
    console.log('Cargando perfil del Business Manager:', bmFullName);
    if (bmFullName) {
      this.bmName = bmFullName.name;
      this.bmLastName = bmFullName.lastName;
      this.bmEmail = this.authService.getBmEmail() || ''; // Obtener el email del Business Manager
      this.bmId = this.authService.getBmId(); // Obtener el ID del Business Manager

      // Actualizar la URL de la imagen de perfil
      this.profileImageUrl = bmFullName.profileImage
        ? `http://localhost:3000/${bmFullName.profileImage}`
        : 'profileIcons/business_manager.png'; // Imagen por defecto para Business Managers
    } else {
      console.error('No se encontraron datos del Business Manager. Redirigiendo al login...');
      this.router.navigate(['/login']);
    }
  }

  logout(): void {
    const confirmation = window.confirm('¿Estás seguro de que deseas cerrar sesión?');
    if (confirmation) {
      this.authService.logout();
      this.router.navigate(['/loginregister']);
    }
  }

  // Métodos específicos de la vista
  actualizarEstado(): void {
    this.bmStatus = 'Inactivo';
    console.log('Estado actualizado:', this.bmStatus);
  }

  // Eliminar cuenta
  deleteAccount(): void {
    const confirmation = window.confirm(
      '¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.'
    );
    if (confirmation && this.bmId) {
      this.http.delete(`http://localhost:3000/api/business-managers/delete/${this.bmId}`).subscribe(
        (response: any) => {
          console.log('Cuenta eliminada correctamente:', response.message);
          this.authService.logout();
          this.router.navigate(['/loginregister']);
        },
        (error: any) => {
          console.error('Error al eliminar la cuenta:', error);
        }
      );
    } else {
      console.error('No se puede eliminar la cuenta porque el bmId no está definido.');
    }
  }

  // Guardar cambios en el perfil
  saveProfile(): void {
    if (!this.bmId) {
      console.error('No se puede actualizar el perfil porque el bmId no está definido.');
      return;
    }

    const updatedBm = {
      name: this.bmName,
      last_name: this.bmLastName,
      email: this.bmEmail,
    };

    this.http.put(`http://localhost:3000/api/business-managers/update/${this.bmId}`, updatedBm).subscribe(
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
    const fileInput = document.getElementById('profileImageInput') as HTMLInputElement;
    fileInput.click();
  }

  uploadProfileImage(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      if (!file.type.startsWith('image/')) {
        alert('Por favor, selecciona un archivo de imagen válido.');
        return;
      }

      const formData = new FormData();
      formData.append('profileImage', file);
      formData.append('bmId', this.bmId?.toString() || '');

      this.http.post('http://localhost:3000/api/business-managers/uploadProfileImage', formData).subscribe({
        next: (response: any) => {
          console.log('Imagen de perfil actualizada:', response);

          const bmFullName = this.authService.getBmFullName();
          if (bmFullName) {
            bmFullName.profileImage = response.imagePath;
            this.authService.setBmFullName(bmFullName);
          }

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
