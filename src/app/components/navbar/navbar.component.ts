import { Component, HostListener, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthUserService } from '../../services/auth-user.service';
import { AuthManagerService } from '../../services/auth-manager.service';

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
  gapSize = 70;
  userName: string | null = null;
  showDropdown = false;
  isScrolled = false;

  isUserLoggedIn: boolean = false;
  isManagerLoggedIn: boolean = false;
  isLoggedIn: boolean = false; // Nueva propiedad que combina ambos estados

  constructor(
    private authUserService: AuthUserService,
    private authManagerService: AuthManagerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Suscribirse al estado del nombre del usuario
    this.authUserService.userName$.subscribe((name: string | null) => {
      this.isUserLoggedIn = !!name;
      this.updateLoggedInState();
    });

    // Suscribirse al estado del nombre del Business Manager
    this.authManagerService.userName$.subscribe((managerName: string | null) => {
      this.isManagerLoggedIn = !!managerName;
      this.updateLoggedInState();
    });
  }

  // Actualizar el estado combinado de "logueado"
  updateLoggedInState(): void {
    this.isLoggedIn = this.isUserLoggedIn || this.isManagerLoggedIn;
    this.userName = this.isUserLoggedIn
      ? this.authUserService.getUserFullName()?.name || null
      : this.authManagerService.getBmFullName()?.name || null;
  }

  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }

  goToAreaPersonal(): void {
    if (this.isUserLoggedIn) {
      this.router.navigate(['/area-personal-usuarios']);
    } else if (this.isManagerLoggedIn) {
      this.router.navigate(['/area-personal-bm']);
    }
  }

  logout(): void {
    const confirmation = window.confirm('¿Estás seguro de que deseas cerrar sesión?');
    if (confirmation) {
      this.authUserService.logout();
      this.authManagerService.logout();
      this.router.navigate(['/loginregister']);
      this.showDropdown = false;
      this.isUserLoggedIn = false;
      this.isManagerLoggedIn = false;
      this.isLoggedIn = false;
      this.userName = null;
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    const scrollOffset = window.scrollY || document.documentElement.scrollTop || 0;
    const maxScroll = 200;
    const maxOpacity = 0.4;
    const maxBlur = 15;
    const minGap = 40;
    const initialGap = 70;

    this.opacity = Math.min((scrollOffset / maxScroll) * maxOpacity, maxOpacity);
    this.blurAmount = Math.min((scrollOffset / maxScroll) * maxBlur, maxBlur);
    this.gapSize = initialGap - (scrollOffset / maxScroll) * (initialGap - minGap);
    this.gapSize = Math.max(this.gapSize, minGap);
    this.isScrolled = scrollOffset > 50;
  }
}
