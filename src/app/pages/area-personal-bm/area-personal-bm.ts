import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { AuthManagerService } from '../../services/auth-manager.service'; // Importar AuthService
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-area-personal-bm',
  standalone: true,
  templateUrl: './area-personal-bm.html',
  styleUrls: ['./area-personal-bm.css'],
  imports: [
    NavbarComponent,
    FooterComponent,
    FormsModule,
    CommonModule,
    RouterModule
  ]
})
export class AreaPersonalBmPage implements OnInit {
  // Variables para manejar el estado de la vista
  bmName: string = '';
  bmLastName: string = '';
  bmDNI: string = '';
  bmAddress: string = '';
  bmEmail: string = ''; 
  bmStatus: string = 'Activo';
  bmId: number | undefined; 
  profileImageUrl: string = ''; 

  storeExists: boolean = false; // Controla si ya existe una tienda
  editStoreMode: boolean = false; // Define si el modo de edición está activado


  constructor(private authManagerService: AuthManagerService, private router: Router, private http: HttpClient) {}

  ngOnInit(): void {
    this.loadBmProfile();
    this.checkIfStoreExists();
  }

  resetStoreProfile(): void {
    this.storeProfile = {
      nombreComercio: '',
      managerPhoto: { file: undefined, url: '' },
      managerName: '',
      storeImage: { file: undefined, url: '' },
      description: '',
    };
    this.editStoreMode = false; // Asegurarte de que el modo de edición está desactivado
  }
  

  private loadBmProfile(): void {
    const bmFullName = this.authManagerService.getBmFullName();
    console.log('Cargando perfil del Business Manager:', bmFullName);
  
    if (bmFullName) {
      this.bmName = bmFullName.name || 'Nombre no disponible';
      this.bmLastName = bmFullName.lastName || 'Apellido no disponible';
      this.bmEmail = bmFullName.email || 'Email no disponible';
      this.bmId = this.authManagerService.getBmId();
      this.bmDNI = bmFullName.dni || 'DNI no disponible';
      this.bmAddress = bmFullName.address || 'Dirección no disponible';
  
      this.profileImageUrl = bmFullName.profileImage
        ? bmFullName.profileImage
        : 'profileIcons/usuario.png';
  
      console.log('Valor de profileImageUrl:', this.profileImageUrl); // Añadir este log
    } else {
      console.error('No se encontraron datos del Business Manager. Redirigiendo al login...');
      this.router.navigate(['/login']);
    }
  }
  

  logout(): void {
    const confirmation = window.confirm('¿Estás seguro de que deseas cerrar sesión?'); // Mensaje de confirmación
    if (confirmation) {
      this.authManagerService.logout(); // Limpia el estado del usuario y el almacenamiento
      this.router.navigate(['/loginregister']); // Redirige a la página de login
    }
  }

  // Métodos específicos de la vista
  actualizarEstado(): void {
    this.bmStatus = 'Inactivo';
    console.log('Estado actualizado:', this.bmStatus);
  }

  // Eliminar cuenta
  deleteBmAccount(): void {
    const confirmation = window.confirm('¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.');
    if (confirmation && this.bmId) { // Asegúrate de que this.bmId está definido
      this.http.delete(`http://localhost:3000/api/business-managers/delete/${this.bmId}`).subscribe(
        (response: any) => {
          console.log('Cuenta eliminada correctamente:', response.message);
          this.authManagerService.logout(); // Limpia la sesión y redirige
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
  saveBmProfile(): void {
    if (!this.bmId) {
      console.error('No se puede actualizar el perfil porque el bmId no está definido.');
      alert('Error al actualizar el perfil: ID no definido.');
      return;
    }
  
    if (!this.bmName || !this.bmEmail) {
      alert('Por favor, completa los campos obligatorios.');
      return;
    }
  
    const updatedBm = {
      name: this.bmName,
      last_name: this.bmLastName,
      email: this.bmEmail,
      dni: this.bmDNI,
      address: this.bmAddress,
    };
  
    this.http.put(`http://localhost:3000/api/business-managers/update/${this.bmId}`, updatedBm).subscribe({
      next: (response: any) => {
        console.log('Perfil actualizado:', response.message);
        alert('Perfil actualizado con éxito.');
      },
      error: (error: any) => {
        console.error('Error al actualizar el perfil:', error);
        alert('Error al actualizar el perfil. Por favor, intenta nuevamente.');
      },
    });
  }


  // Eliminar tienda
  deleteStoreProfile(): void {
    if (!this.bmId) {
      console.error('No se puede eliminar la tienda porque el ID del Business Manager no está definido.');
      alert('Error: No se puede eliminar la tienda.');
      return;
    }
  
    const confirmation = window.confirm('¿Estás seguro de que deseas eliminar tu tienda? Esta acción no se puede deshacer.');
    if (confirmation) {
      this.http.delete(`http://localhost:3000/api/stores/delete/${this.bmId}`).subscribe({
        next: (response: any) => {
          console.log('Tienda eliminada correctamente:', response);
          alert('Tienda eliminada exitosamente.');
          this.storeExists = false; // Actualiza el estado para reflejar que la tienda ha sido eliminada
          this.storeProfile = {
            nombreComercio: '',
            managerPhoto: { file: undefined, url: '' },
            managerName: '',
            storeImage: { file: undefined, url: '' },
            description: ''
          };
        },
        error: (error: any) => {
          console.error('Error al eliminar la tienda:', error);
          alert('Error al intentar eliminar la tienda.');
        }
      });
    }
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
      formData.append('bmId', this.bmId?.toString() || ''); // Asegúrate de incluir el bmId
  
      // Realizar la solicitud al backend
      this.http.post('http://localhost:3000/api/business-managers/uploadProfileImage', formData).subscribe({
        next: (response: any) => {
          console.log('Imagen de perfil actualizada:', response);
  
          // Actualizar el localStorage directamente
          const bmFullName = this.authManagerService.getBmFullName();
          if (bmFullName) {
            bmFullName.profileImage = response.imagePath; // Actualizamos la ruta de la imagen
            this.authManagerService.setBmFullName(bmFullName); // Guardamos en el localStorage
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




  
  // ================= SECCIÓN PARA EL PERFIL DE LA TIENDA =================

  // Variables para el perfil de la tienda
  storeProfile: {
    nombreComercio: string;
    managerPhoto: { file?: File; url: string }; // Añadido soporte para `file`
    managerName: string;
    storeImage: { file?: File; url: string }; // Añadido soporte para `file`
    description: string;
  } = {
    nombreComercio: '',
    managerPhoto: { file: undefined, url: '' },
    managerName: '',
    storeImage: { file: undefined, url: '' },
    description: ''
  };
  

  // Métodos para manejar la selección de imágenes
  onManagerPhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.storeProfile.managerPhoto = {
        file: file, // Actualiza el archivo seleccionado
        url: URL.createObjectURL(file), // Vista previa de la imagen
      };
    }
  }
  
  onStoreImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.storeProfile.storeImage = {
        file: file, // Actualiza el archivo seleccionado
        url: URL.createObjectURL(file), // Vista previa de la imagen
      };
    }
  }
  
  
  

 // Guardar perfil de la tienda (creación o edición según el caso)
 saveStoreProfile(): void {
  if (!this.storeProfile.nombreComercio || !this.storeProfile.managerName || !this.storeProfile.description) {
    alert('Por favor, completa todos los campos obligatorios.');
    return;
  }

  const formData = new FormData();
  formData.append('businessManagerId', this.bmId?.toString() || '');
  formData.append('nombre_comercio', this.storeProfile.nombreComercio);
  formData.append('nombre_gerente', this.storeProfile.managerName);
  formData.append('descripcion', this.storeProfile.description);

  // Adjuntar nuevas imágenes o mantener las actuales
  if (this.storeProfile.managerPhoto.file) {
    formData.append('foto_gerente', this.storeProfile.managerPhoto.file);
  } else if (this.storeProfile.managerPhoto.url) {
    formData.append('foto_gerente_actual', this.storeProfile.managerPhoto.url);
  }

  if (this.storeProfile.storeImage.file) {
    formData.append('imagen', this.storeProfile.storeImage.file);
  } else if (this.storeProfile.storeImage.url) {
    formData.append('imagen_actual', this.storeProfile.storeImage.url);
  }

  const apiUrl = this.editStoreMode
    ? `http://localhost:3000/api/stores/update/${this.bmId}`
    : 'http://localhost:3000/api/stores/create';

  const requestMethod = this.editStoreMode ? this.http.put : this.http.post;

  requestMethod.call(this.http, apiUrl, formData).subscribe({
    next: (response: any) => {
      console.log('Perfil de la tienda actualizado:', response);
      alert(
        this.editStoreMode
          ? 'Perfil de la tienda actualizado con éxito.'
          : 'Perfil de la tienda guardado exitosamente.'
      );
      this.checkIfStoreExists(); // Refrescar datos
    },
    error: (error: any) => {
      console.error('Error al guardar el perfil de la tienda:', error);
      alert('Hubo un error al guardar el perfil. Por favor, inténtalo de nuevo.');
    },
  });
}



getFileName(url: string): string {
  return url.split('/').pop() || 'Archivo no disponible';
}
  
  


  // Método para verificar si ya existe la tienda
  checkIfStoreExists(): void {
    const businessManagerId = this.authManagerService.getBmId(); // Obtener el ID del usuario actual
    console.log('ID del Business Manager:', businessManagerId);
  
    this.http.get(`http://localhost:3000/api/stores/${businessManagerId}`).subscribe({
      next: (response: any) => {
        console.log('Respuesta de la API:', response);
  
        if (response && response.store) { // Verifica si la respuesta contiene un objeto store
          const store = response.store;
  
          // Validar los campos que llegan desde el backend
          const fotoGerente = store.foto_gerente || '';
          const imagenTienda = store.imagen || '';
  
          console.log('Ruta de foto del gerente:', fotoGerente);
          console.log('Ruta de imagen de la tienda:', imagenTienda);
  
          this.storeExists = true; // Si existe la tienda, habilitar "Editar" y deshabilitar "Generar"
          this.editStoreMode = true; // Activar el modo de edición
  
          // Precargar los datos de la tienda en el formulario
          this.storeProfile = {
            nombreComercio: store.nombre_comercio || '',
            managerPhoto: {
              file: undefined, // No cargamos un archivo aquí
              url: fotoGerente ? `http://localhost:3000/uploads/${fotoGerente}` : '', // URL completa de la imagen
            },
            managerName: store.nombre_gerente || '',
            storeImage: {
              file: undefined, // No cargamos un archivo aquí
              url: imagenTienda ? `http://localhost:3000/uploads/${imagenTienda}` : '', // URL completa de la imagen
            },
            description: store.descripcion || '',
          };
  
          console.log('Datos cargados para edición:', this.storeProfile);
        } else {
          console.error('La respuesta no contiene datos de la tienda:', response);
        }
      },
      error: (err) => {
        if (err.status === 404) {
          this.storeExists = false; // No existe la tienda, habilitar "Generar" y deshabilitar "Editar"
          this.editStoreMode = false; // Desactivar el modo de edición
          console.log('No se encontró una tienda para este Business Manager.');
        } else {
          console.error('Error al verificar si existe la tienda:', err);
        }
      },
    });
  }
   
  
}
