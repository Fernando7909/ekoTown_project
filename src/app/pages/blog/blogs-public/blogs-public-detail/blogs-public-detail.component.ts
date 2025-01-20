import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BlogService } from '../../../../services/blog.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../../../components/navbar/navbar.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-blogs-public-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  templateUrl: './blogs-public-detail.component.html',
  styleUrls: ['./blogs-public-detail.component.css'],
})
export class BlogsPublicDetailComponent implements OnInit {
  blog: any = {};  // Para almacenar el blog que se va a mostrar
  errorMessage: string = '';  // Para mostrar un mensaje de error si no se carga el blog

  constructor(
    private route: ActivatedRoute,
    private blogService: BlogService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const blogId = this.route.snapshot.paramMap.get('id');  // Obtener el id desde la URL
    if (blogId) {
      const blogIdNumber = Number(blogId);  // Convertir el id a número
      if (!isNaN(blogIdNumber)) {
        this.getBlog(blogIdNumber);  // Llamar a la función para obtener el blog
      } else {
        this.errorMessage = 'ID no válido';
      }
    }
  }

  // Función para obtener los detalles del blog desde el backend
  getBlog(id: number): void {
    this.blogService.getBlogById(id).pipe(
      catchError((error) => {
        this.errorMessage = 'Hubo un error al cargar el blog. Por favor, inténtalo más tarde.';
        return of(null);  // Retornar un valor null en caso de error
      })
    ).subscribe(
      (data) => {
        if (data) {
          this.blog = data;  // Asignar los datos al blog
        } else {
          this.errorMessage = 'Blog no encontrado';
          this.router.navigate(['/blogs/public']);  // Redirigir al listado de blogs si no se encuentra el blog
        }
      }
    );
  }
}
