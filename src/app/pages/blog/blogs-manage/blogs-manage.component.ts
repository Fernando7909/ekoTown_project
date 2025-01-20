import { Component, OnInit } from '@angular/core';
import { BlogService } from '../../../services/blog.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../../components/navbar/navbar.component';

// Interfaz para los datos de los blogs
interface Blog {
  id?: number; // Opcional para creación
  title: string;
  content: string;
  category: string;
  author: string; // Agregado
  businessManagerId: number; // Agregado
}

@Component({
  selector: 'app-blogs-manage',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    NavbarComponent,
  ],
  templateUrl: './blogs-manage.component.html',
  styleUrls: ['./blogs-manage.component.css'],
})
export class BlogsManageComponent implements OnInit {
  blogs: Blog[] = [];
  blogForm: Blog = {
    title: '',
    content: '',
    category: 'General',
    author: '', // Asegúrate de que esta propiedad se maneje también
    businessManagerId: 0, // Asegúrate de que esta propiedad se maneje también
  };
  isEditing = false;
  editingBlogId: number | null = null;

  constructor(private blogService: BlogService) {}

  ngOnInit(): void {
    this.loadBlogs();
  }

  // Cargar blogs
  loadBlogs(): void {
    this.blogService.getAllBlogs().subscribe(
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
      author: blog.author, // Asegúrate de que esta propiedad también se copie
      businessManagerId: blog.businessManagerId, // Asegúrate de que esta propiedad también se copie
    };
  }


  // Método en el componente para eliminar un blog
deleteBlog(id: number): void {
  // Asegúrate de que el ID es válido antes de hacer la solicitud
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
      author: '', // Resetear la propiedad 'author'
      businessManagerId: 0, // Resetear la propiedad 'businessManagerId'
    };
    this.isEditing = false;
    this.editingBlogId = null;
  }

  // Cancelar edición
  cancelEdit(): void {
    this.resetForm();
  }
}
