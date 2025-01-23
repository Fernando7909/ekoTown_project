import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root', // Esto es opcional si lo provees directamente en el componente
})
export class DarkModeService {
  private isDarkModeSubject = new BehaviorSubject<boolean>(false);
  isDarkMode$ = this.isDarkModeSubject.asObservable();

  constructor(private router: Router) {}

  toggleDarkMode() {
    const currentMode = this.isDarkModeSubject.value;
    this.isDarkModeSubject.next(!currentMode);
    this.applyDarkMode(!currentMode);
  }

  private applyDarkMode(isDarkMode: boolean) {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }
}