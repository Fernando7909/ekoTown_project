import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from "./pages/navbar/navbar.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  styleUrls: ['./app.component.css']  // Cambiar 'styleUrl' a 'styleUrls'
})
export class AppComponent {
  title = 'ekoTown_project';
}
