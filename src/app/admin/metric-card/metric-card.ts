import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-metric-card',
  imports: [],
  templateUrl: './metric-card.html',
  styleUrl: './metric-card.css',
})
export class MetricCard {
  @Input() title!: string;
  @Input() value!: string;
  @Input() trend!: string;
}
