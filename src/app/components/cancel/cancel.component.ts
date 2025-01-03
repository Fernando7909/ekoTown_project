import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cancel',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="cancel-container">
      <h1>Compra cancelada</h1>
      <p>La transacción fue cancelada. Si deseas intentarlo de nuevo, puedes volver al carrito.</p>
      <a routerLink="/carrito" class="retry-link">Volver al carrito</a>
    </div>
  `,
  styles: [`
    .cancel-container {
      text-align: center;
      margin-top: 50px;
    }
    .retry-link {
      display: inline-block;
      margin-top: 20px;
      color: #FF0000;
      text-decoration: none;
      font-weight: bold;
    }
    .retry-link:hover {
      text-decoration: underline;
    }
  `]
})
export class CancelComponent {}
