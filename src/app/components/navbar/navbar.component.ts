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
  // Propiedades para controlar el diseño dinámico del navbar
  opacity = 0;
  blurAmount = 0;
  gapSize = 70; // Inicializa el gap a 70px
  userName: string | null = null; // Variable para el nombre del usuario
  showDropdown = false; // Estado del submenú desplegable
  isScrolled = false; // Nueva propiedad para manejar la clase `scrolled`

  constructor(private authService: AuthService, private router: Router) {} // Agrega Router para redirigir tras logout

  ngOnInit(): void {
    // Suscribirse al estado del nombre del usuario desde AuthService
    this.authService.userName$.subscribe((name) => {
      this.userName = name;
    });
  }

  // Alterna el estado del submenú desplegable
  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }

  // Lógica de logout
  logout(): void {
    const confirmation = window.confirm('¿Estás seguro de que deseas cerrar sesión?'); // Mensaje de confirmación
    if (confirmation) {
      this.authService.logout(); // Limpia el estado del usuario y el almacenamiento
      this.router.navigate(['/loginregister']); // Redirige a la página de login
      this.showDropdown = false; // Cierra el menú desplegable
    }
  }
  
  

  goToAreaPersonal(): void {
    this.router.navigate(['/area-personal-usuarios']);
  }
  

  // Detecta el evento de scroll para cambiar propiedades del navbar
  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    const scrollOffset = window.scrollY || document.documentElement.scrollTop || 0; // Obtiene la posición de scroll
    const maxScroll = 200; // Máximo scroll considerado para calcular los efectos
    const maxOpacity = 0.4; // Máxima opacidad del fondo
    const maxBlur = 15; // Máximo desenfoque
    const minGap = 40; // Valor mínimo del gap
    const initialGap = 70; // Valor inicial del gap

    // Calcula opacidad y desenfoque de manera proporcional al scroll
    this.opacity = Math.min((scrollOffset / maxScroll) * maxOpacity, maxOpacity);
    this.blurAmount = Math.min((scrollOffset / maxScroll) * maxBlur, maxBlur);

    // Calcula el gap dinámico de manera proporcional al scroll
    this.gapSize = initialGap - (scrollOffset / maxScroll) * (initialGap - minGap);
    this.gapSize = Math.max(this.gapSize, minGap); // Asegura que el gap no sea menor al mínimo

    // Cambia la propiedad `isScrolled` si el scroll supera un umbral (50px)
    this.isScrolled = scrollOffset > 50; // Cambia a `true` si el scroll es mayor a 50px
  }
}
