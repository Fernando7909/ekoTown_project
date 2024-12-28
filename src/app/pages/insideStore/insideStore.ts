import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-inside-store',
  standalone: true,
  templateUrl: './insideStore.html',
  styleUrls: ['./insideStore.css']
})
export class InsideStoreComponent implements OnInit {
  storeId: string | null = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Obtén el ID de la tienda desde la URL
    this.storeId = this.route.snapshot.paramMap.get('storeId');
    console.log('ID de la tienda:', this.storeId);

    // Aquí puedes cargar los productos de la tienda con el ID
  }
}
