import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';  // Importa RouterModule
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  imports: [CommonModule, RouterModule]  // Asegúrate de incluir RouterModule aquí
})
export class NavbarComponent {}
