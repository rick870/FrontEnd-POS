import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet], 
  templateUrl: './app.html', 
  styleUrl: './app.css'      
})
export class App { // 👈 Cámbialo aquí: Debe decir 'App' en vez de 'AppComponent'
  protected readonly title = signal('FrontEnd');
}