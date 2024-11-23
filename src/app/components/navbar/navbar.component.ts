import { Component, HostListener, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router'; // Importa Router para redirecciones
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  imports: [CommonModule, RouterModule]
})
export class NavbarComponent implements OnInit {
  opacity = 0;
  blurAmount = 0;
  gapSize = 70; // Inicializa el gap a 70px
  userName: string | null = null; // Variable para el nombre del usuario
  showDropdown = false; // Estado del submenú

  constructor(private authService: AuthService, private router: Router) {} // Agrega Router para redirigir tras logout

  ngOnInit(): void {
    // Suscribirse al estado del nombre del usuario desde AuthService
    this.authService.userName$.subscribe((name) => {
      this.userName = name;
    });
  }

  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown; // Alterna el estado del submenú
  }

  logout(): void {
    this.authService.logout(); // Llama al método de logout en AuthService
    this.router.navigate(['/loginregister']); // Redirige a la página de login
    this.showDropdown = false; // Cierra el submenú tras cerrar sesión
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollOffset = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
    const maxScroll = 200;
    const maxOpacity = 0.4;
    const maxBlur = 15;
    const minGap = 40; // Valor mínimo del gap
    const initialGap = 70; // Valor inicial del gap

    // Calcula opacidad y desenfoque de manera proporcional al scroll
    this.opacity = Math.min((scrollOffset / maxScroll) * maxOpacity, maxOpacity);
    this.blurAmount = Math.min((scrollOffset / maxScroll) * maxBlur, maxBlur);

    // Calcula el gap de manera proporcional al scroll
    this.gapSize = initialGap - (scrollOffset / maxScroll) * (initialGap - minGap);
    this.gapSize = Math.max(this.gapSize, minGap); // Asegura que el gap no sea menor al mínimo
  }
}
