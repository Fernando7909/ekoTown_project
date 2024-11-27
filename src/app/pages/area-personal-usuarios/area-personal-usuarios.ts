import { Component } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from "../../components/footer/footer.component";

@Component({
  selector: 'app-area-personal-usuarios',
  standalone: true,
  templateUrl: './area-personal-usuarios.html',
  styleUrls: ['./area-personal-usuarios.css'],
  imports: [
    NavbarComponent,
    FooterComponent
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
