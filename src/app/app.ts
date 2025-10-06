import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('gym-app');

  protected readonly items = [
    // { title: 'Explore the Docs', link: 'https://angular.dev' },
  ];
}
