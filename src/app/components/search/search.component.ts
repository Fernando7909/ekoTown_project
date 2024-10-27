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
  location: string = '';  // Ciudad o municipio
  categories: string = 'organic_stores,healthmarkets';  // Categorías por defecto
  radius: string = '';  // Radio de búsqueda en metros
  searchResults: any[] = [];  // Resultados de la búsqueda

  constructor(private storeSearchService: StoreSearchService) {}

  // Método para manejar la búsqueda
  onSearch() {
    if (!this.location || !this.radius) {
      console.log('Los campos de ubicación y radio son requeridos');
      return;
    }
  
    this.storeSearchService.searchStores(this.location, this.categories, this.radius).subscribe(
      (results) => {
        this.searchResults = results.businesses; // Asigna solo la lista de negocios
        console.log(this.searchResults); // Muestra los resultados en la consola
      },
      (error) => {
        console.error('Error fetching store data:', error);
        this.searchResults = []; // Limpia resultados en caso de error
      }
    );
  }  
}
