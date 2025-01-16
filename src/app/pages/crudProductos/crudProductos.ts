import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ProductService, Producto } from '../../services/product.service';
import { PublishedProductsService } from '../../services/published-products.service';

@Component({
  selector: 'app-crud-productos',
  standalone: true,
  imports: [
    MatCardModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
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

  constructor(
    private productService: ProductService,
    private publishedProductsService: PublishedProductsService
  ) {}

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
      cantidad_maxima: 10,
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
                this.productos = data.map((producto) => ({
                    ...producto,
                    imagen_url: producto.imagen_url?.replace(/\\/g, '/'), // Normalizar URL
                }));
            },
            error: (error) => {
                console.error('Error al cargar los productos:', error);
            },
        });
    }
}

  
  


  // Selección de la imagen
  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.newProduct.imagenFile = file; // Guardar archivo en una propiedad temporal
      console.log('Archivo seleccionado:', file); // Log para verificar el archivo seleccionado
    }
  }

  private toFormData(product: Producto): FormData {
    const formData = new FormData();

    formData.append('business_manager_id', product.business_manager_id.toString());
    formData.append('codigo', product.codigo);
    formData.append('nombre', product.nombre);
    formData.append('descripcion', product.descripcion);
    formData.append('categoria', product.categoria);
    formData.append('cantidad', product.cantidad.toString());
    formData.append('precio', product.precio.toString());

    // Adjuntar archivo si está presente
    if (product.imagenFile) {
        formData.append('imagen', product.imagenFile);
    } else if (product.imagen_url) {
        formData.append('imagen_url', product.imagen_url); // Asegurar que la URL existente se incluya
    }

    return formData;
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
    const formData = this.toFormData(this.newProduct); // Convertir a FormData
  
    if (this.isEditMode && this.newProduct.id) {
      this.productService.updateProduct(this.newProduct.id, formData).subscribe({
        next: () => {
          this.loadProducts(); // Recargar productos
          this.closeModal();
        },
        error: (error) => {
          console.error('Error al actualizar el producto:', error);
        },
      });
    } else {
      this.productService.createProduct(formData).subscribe({
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
    console.log('Publicando producto desde CRUD:', producto);

    if (producto.id && producto.nombre && producto.imagen_url && producto.business_manager_id) {
        const productoActualizado = {
            publicado: true,
            nombre: producto.nombre,
            descripcion: producto.descripcion,
            categoria: producto.categoria,
            cantidad: producto.cantidad,
            precio: producto.precio,
        }; // Incluye todos los campos necesarios

        console.log('Datos enviados al backend:', productoActualizado);

        this.productService.updateProduct(producto.id, productoActualizado).subscribe({
            next: () => {
                console.log(`Producto publicado en la base de datos: ${producto.nombre} (ID: ${producto.id})`);
                alert(`Producto "${producto.nombre}" publicado con éxito.`);
                this.loadProducts();
            },
            error: (err) => {
                console.error('Error al publicar el producto:', err);
                alert('Hubo un error al publicar el producto. Por favor, inténtalo de nuevo.');
            }
        });
    } else {
        console.warn('El producto no tiene todos los datos necesarios para publicarlo:', producto);
        alert('No se puede publicar el producto. Faltan datos.');
    }
}

  
  

  // Cierra el modal
  closeModal(): void {
    this.isModalOpen = false;
    this.newProduct = this.initializeProduct();
    this.isEditMode = false;
  }
}
