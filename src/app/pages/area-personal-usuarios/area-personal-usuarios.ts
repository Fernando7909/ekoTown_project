import { Component } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';

@Component({
  selector: 'app-area-personal-usuarios',
  standalone: true,
  templateUrl: './area-personal-usuarios.html',
  styleUrls: ['./area-personal-usuarios.css'],
  imports: [
    NavbarComponent,
  ]
})
export class AreaPersonalUsuariosPage {
  // Variables para manejar el estado de la vista
  userName: string = 'Usuario Ejemplo';
  userStatus: string = 'Activo';

  constructor() { }

  // Métodos específicos de la vista
  actualizarEstado(): void {
    this.userStatus = 'Inactivo';
    console.log('Estado actualizado:', this.userStatus);
  }
}
