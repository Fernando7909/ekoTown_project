import { Component } from '@angular/core';
import { StoreSearchService } from '../../services/store-search.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-search',
  standalone: true,
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
  imports: [CommonModule, FormsModule, RouterModule, HttpClientModule],
})
export class SearchComponent {
  location: string = ''; // Ciudad o municipio
  categories: string = 'organic_stores,healthmarkets'; // Categorías por defecto
  radius: string = ''; // Radio de búsqueda en metros
  searchResults: any[] = []; // Resultados de la búsqueda
  isLoading: boolean = false; // Indicador de carga
  errorMessage: string = ''; // Mensaje de error

  constructor(private storeSearchService: StoreSearchService) {}

  // Método para manejar la búsqueda
  onSearch() {
    // Validar campos requeridos
    if (!this.location || !this.radius) {
      this.errorMessage = 'Los campos de ubicación y radio son requeridos.';
      return;
    }

    // Resetear estados
    this.errorMessage = '';
    this.searchResults = [];
    this.isLoading = true;

    this.storeSearchService.searchStores(this.location, this.categories, this.radius).subscribe(
      (results) => {
        this.isLoading = false;
        if (results && results.businesses) {
          this.searchResults = results.businesses;
          console.log(this.searchResults); // Mostrar resultados en la consola
        } else {
          this.errorMessage = 'No se encontraron resultados para esta búsqueda.';
        }
      },
      (error) => {
        this.isLoading = false;
        this.errorMessage = 'Ocurrió un error al buscar los comercios. Inténtalo de nuevo más tarde.';
        console.error('Error fetching store data:', error);
      }
    );
  }
}
