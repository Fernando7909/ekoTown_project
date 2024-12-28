import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ProductService, Producto } from '../../services/product.service';

@Component({
  selector: 'app-crud-productos',
  standalone: true,
  imports: [
    MatCardModule,
    CommonModule,
    FormsModule,
    HttpClientModule
  ],
  templateUrl: './crudProductos.html',
  styleUrls: ['./crudProductos.css'],
})
export class CrudProductosComponent implements OnInit {
  productos: Producto[] = [];
  businessManagerId: number | null = null; // Variable para almacenar el ID del Business Manager
  isModalOpen: boolean = false;
  isEditMode: boolean = false;
  newProduct: Producto = this.initializeProduct();
  categorias: string[] = [
    'Alimentación', 'Limpieza', 'Cosmética', 'Electrónica', 'Ropa',
    'Calzado', 'Muebles', 'Papelería', 'Deportes', 'Juguetes',
    'Salud', 'Hogar', 'Mascotas', 'Libros', 'Otros'
  ];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    // Obtener los datos del Business Manager desde bmFullName en localStorage
    const bmFullName = localStorage.getItem('bmFullName');
    if (bmFullName) {
      const parsedBm = JSON.parse(bmFullName);
      this.businessManagerId = parsedBm?.id || null; // Utiliza el campo "id" para obtener el Business Manager ID
    }
  
    if (this.businessManagerId) {
      console.log('ID del Business Manager obtenido:', this.businessManagerId);
      this.loadProducts(); // Cargar productos relacionados con este ID
    } else {
      console.error('No se pudo obtener el ID del Business Manager.');
    }
  }
  
  

  initializeProduct(): Producto {
    return {
      business_manager_id: this.businessManagerId || 0, // Asegura que el ID esté definido
      codigo: '',
      nombre: '',
      descripcion: '',
      categoria: '',
      cantidad: 0,
      precio: 0,
      imagen_url: '',
      publicado: false
    };
  }

  loadProducts(): void {
    if (this.businessManagerId) {
      this.productService.getProductsByBusinessManager(this.businessManagerId).subscribe({
        next: (data) => {
          console.log('Productos cargados:', data);
          this.productos = data;
        },
        error: (error) => {
          console.error('Error al cargar los productos:', error);
        }
      });
    } else {
      console.error('No se puede cargar productos sin un ID de Business Manager.');
    }
  }
  



  // Selección de la imagen
  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        this.newProduct.imagen_url = reader.result as string;
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  // Abre el modal para añadir un producto
  openAddProductModal(): void {
    this.isEditMode = false;
    this.newProduct = this.initializeProduct();
    this.isModalOpen = true;
  }

  // Abre el modal para editar un producto
  editProduct(producto: Producto): void {
    this.isEditMode = true;
    this.newProduct = { ...producto };
    this.isModalOpen = true;
  }

  // Guarda el producto (agregar o editar)
  saveProduct(): void {
    this.newProduct.cantidad = +this.newProduct.cantidad; // Conversión explícita a número
    this.newProduct.precio = +this.newProduct.precio; // Conversión explícita a número

    if (this.isEditMode) {
      this.productService.updateProduct(this.newProduct.id!, this.newProduct).subscribe({
        next: () => {
          this.loadProducts(); // Recargar productos
          this.closeModal();
        },
        error: (error) => {
          console.error('Error al actualizar el producto:', error);
        },
      });
    } else {
      this.productService.createProduct(this.newProduct).subscribe({
        next: () => {
          this.loadProducts(); // Recargar productos
          this.closeModal();
        },
        error: (error) => {
          console.error('Error al crear el producto:', error);
        },
      });
    }
  }

  // Elimina un producto por su ID
  deleteProduct(id: number): void {
    const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar este producto?');
    if (confirmDelete) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          this.loadProducts(); // Recargar productos
        },
        error: (error) => {
          console.error('Error al eliminar el producto:', error);
        },
      });
    }
  }

  // Publicar producto
  publishProduct(producto: Producto): void {
    producto.publicado = true;
    this.productService.updateProduct(producto.id!, producto).subscribe({
      next: () => {
        alert(`Producto "${producto.nombre}" publicado con éxito.`);
        this.loadProducts();
      },
      error: (error) => {
        console.error('Error al publicar el producto:', error);
      },
    });
  }

  // Cierra el modal
  closeModal(): void {
    this.isModalOpen = false;
    this.newProduct = this.initializeProduct();
    this.isEditMode = false;
  }
}
