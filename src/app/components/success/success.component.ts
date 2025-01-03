import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-success',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="success-container">
      <h1>¡Compra completada con éxito!</h1>
      <p>Gracias por tu compra. Te hemos enviado un correo con los detalles.</p>
      <a routerLink="/" class="home-link">Volver a la página principal</a>
    </div>
  `,
  styles: [`
    .success-container {
      text-align: center;
      margin-top: 50px;
    }
    .home-link {
      display: inline-block;
      margin-top: 20px;
      color: #007BFF;
      text-decoration: none;
      font-weight: bold;
    }
    .home-link:hover {
      text-decoration: underline;
    }
  `]
})
export class SuccessComponent {}
