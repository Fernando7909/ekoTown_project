import { Component, OnInit } from '@angular/core';
import { BlogService } from '../../../services/blog.service';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router'; // Importar ActivatedRoute
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { NavbarComponent } from '../../../components/navbar/navbar.component';

@Component({
  selector: 'app-blogs-public',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule,
    NavbarComponent,
  ],
  templateUrl: './blogs-public.component.html',
  styleUrls: ['./blogs-public.component.css'],
})
export class BlogsPublicComponent implements OnInit {
  blogs: any[] = [];
  blog: any; // Para almacenar un blog individual
  errorMessage: string = '';

  constructor(private blogService: BlogService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.loadBlogs(); // Cargar blogs al inicio
    this.route.paramMap.subscribe(params => {
      const blogId = params.get('id'); // Obtener el id de la ruta
      if (blogId) {
        this.loadBlogById(blogId); // Cargar el blog específico si existe el id
      }
    });
  }

  loadBlogs(): void {
    this.blogService.getAllBlogs().pipe(
      catchError((error) => {
        this.errorMessage = 'Hubo un error al cargar los blogs. Por favor, inténtalo más tarde.';
        return of([]);
      })
    ).subscribe((data) => {
      this.blogs = data;
    });
  }

  loadBlogById(id: string): void {
    this.blogService.getBlogById(Number(id)).subscribe(
      (data) => {
        this.blog = data; // Asignar el blog cargado
      },
      (error) => {
        this.errorMessage = 'No se pudo cargar el blog. Intenta nuevamente más tarde.';
      }
    );
  }
}
