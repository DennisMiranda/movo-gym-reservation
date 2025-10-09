import { Component } from '@angular/core';
import { MetricCard } from '../metric-card/metric-card';

@Component({
  selector: 'app-dashboard',
  imports: [MetricCard],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  metrics = [
    {
      title: 'Total Classes',
      value: '24',
      // icon: Dumbbell,
      trend: '+3 this week',
    },
    {
      title: 'Total Reservations',
      value: '156',
      // icon: Calendar,
      trend: '+12% vs last week',
    },
    {
      title: 'Available Spots',
      value: '89',
      // icon: TrendingUp,
      trend: 'Across all classes',
    },
    {
      title: 'Active Users',
      value: '342',
      // icon: Users,
      trend: '+24 this month',
    },
  ];
}
