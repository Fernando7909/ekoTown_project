import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';  // Mantén otros módulos que no estén relacionados con BrowserModule

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [
    RouterOutlet,
    NavbarComponent,
    CommonModule,
    ButtonModule,  
  ],
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ekoTown_project';
}
