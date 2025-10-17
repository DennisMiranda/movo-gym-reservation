import { Component } from '@angular/core';
import { ClassesSection } from '../../classes/classes-section/classes-section';
import { Hero } from '../../hero/hero';

@Component({
  selector: 'app-landing-page',
  imports: [Hero, ClassesSection],
  templateUrl: './landing-page.html',
  styleUrl: './landing-page.scss',
})
export class LandingPage {}
