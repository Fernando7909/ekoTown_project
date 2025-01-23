import { Component, OnInit } from '@angular/core';
import { BlogService } from '../../../services/blog.service';
import { AuthManagerService } from '../../../services/auth-manager.service'; // Importa el servicio de autenticación
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../../components/navbar/navbar.component';

// Interfaz para los datos de los blogs
interface Blog {
  id?: number;
  title: string;
  content: string;
  category: string;
  author: string;
  businessManagerId: number;
}

@Component({
  selector: 'app-blogs-manage',
  standalone: true,
  imports: [FormsModule, CommonModule, NavbarComponent],
  templateUrl: './blogs-manage.component.html',
  styleUrls: ['./blogs-manage.component.css'],
})
export class BlogsManageComponent implements OnInit {
  blogs: Blog[] = [];
  blogForm: Blog = {
    title: '',
    content: '',
    category: 'General',
    author: '',
    businessManagerId: 0,
  };
  isEditing = false;
  editingBlogId: number | null = null;

  // Obtén el businessManagerId del usuario actual desde el servicio de autenticación
  currentBusinessManagerId: number = 0;

  constructor(
    private blogService: BlogService,
    private authManagerService: AuthManagerService // Inyecta el servicio de autenticación
  ) {}

  ngOnInit(): void {
    // Obtén el businessManagerId del usuario logueado
    const bmId = this.authManagerService.getBmId();
    if (bmId !== undefined) {
      this.currentBusinessManagerId = bmId;
      this.loadBlogs();
    } else {
      console.error('No se pudo obtener el businessManagerId del usuario logueado.');
    }
  }

  // Cargar blogs filtrados por businessManagerId
  loadBlogs(): void {
    this.blogService
      .getBlogsByBusinessManagerId(this.currentBusinessManagerId)
      .subscribe(
        (data: Blog[]) => {
          this.blogs = data;
        },
        (error) => {
          console.error('Error al cargar los blogs:', error);
        }
      );
  }

  // Crear o actualizar un blog
  handleSubmit(): void {
    // Validar que todos los campos necesarios estén presentes
    if (!this.blogForm.title || !this.blogForm.content || !this.blogForm.author || !this.blogForm.businessManagerId) {
      console.error('Todos los campos son obligatorios');
      return; // Detener el envío si algún campo falta
    }

    if (this.isEditing) {
      // Actualizar blog
      this.blogService.updateBlog(this.editingBlogId!, this.blogForm).subscribe(
        (response) => {
          this.loadBlogs();
          this.resetForm();
          console.log('Blog actualizado exitosamente', response);
        },
        (error) => {
          console.error('Error al actualizar el blog:', error);
        }
      );
    } else {
      // Crear nuevo blog
      this.blogForm.businessManagerId = this.currentBusinessManagerId; // Asignar el ID del business manager
      this.blogService.createBlog(this.blogForm).subscribe(
        (response) => {
          this.loadBlogs();
          this.resetForm();
          console.log('Blog creado exitosamente', response);
        },
        (error) => {
          console.error('Error al crear el blog:', error);
        }
      );
    }
  }

  // Editar un blog
  editBlog(blog: Blog): void {
    this.isEditing = true;
    this.editingBlogId = blog.id || null;
    this.blogForm = {
      title: blog.title,
      content: blog.content,
      category: blog.category,
      author: blog.author,
      businessManagerId: blog.businessManagerId,
    };
  }

  // Eliminar un blog
  deleteBlog(id: number): void {
    if (id !== null && id !== undefined) {
      this.blogService.deleteBlog(id).subscribe(
        () => {
          this.loadBlogs();
          console.log('Blog eliminado exitosamente.');
        },
        (error) => {
          console.error('Error al eliminar el blog:', error);
        }
      );
    } else {
      console.error('Error: ID del blog no válido');
    }
  }

  // Resetear formulario
  resetForm(): void {
    this.blogForm = {
      title: '',
      content: '',
      category: 'General',
      author: '',
      businessManagerId: this.currentBusinessManagerId, // Restablecer el ID del business manager
    };
    this.isEditing = false;
    this.editingBlogId = null;
  }

  // Cancelar edición
  cancelEdit(): void {
    this.resetForm();
  }
}