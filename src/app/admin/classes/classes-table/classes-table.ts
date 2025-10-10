import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

interface GymClass {
  id: string;
  title: string;
  description: string;
  image?: string;
  trainer: string;
  date: string;
  takenSpots: number;
  totalSpots: number;
  createdAt: string;
  updatedAt: string;
}

@Component({
  selector: 'app-classes-table',
  imports: [MatTableModule, MatButtonModule, MatIconModule, DatePipe],
  templateUrl: './classes-table.html',
  styleUrl: './classes-table.css',
})
export class ClassesTable {
  displayedColumns: string[] = ['title', 'trainer', 'date', 'spots', 'actions'];
  dataSource: GymClass[] = [
    {
      id: '1',
      title: 'HIIT Bootcamp',
      image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48',
      description: 'High-intensity interval training to burn calories and build endurance',
      trainer: 'Sarah Johnson',
      date: '2025-10-15T09:00:00',
      takenSpots: 15,
      totalSpots: 20,
      createdAt: '2025-10-01T10:00:00',
      updatedAt: '2025-10-05T14:30:00',
    },
    {
      id: '2',
      title: 'Yoga Flow',
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b',
      description: 'Relaxing vinyasa flow for flexibility and mindfulness',
      trainer: 'Michael Chen',
      date: '2025-10-16T18:00:00',
      takenSpots: 20,
      totalSpots: 25,
      createdAt: '2025-10-02T11:15:00',
      updatedAt: '2025-10-06T09:20:00',
    },
    {
      id: '3',
      title: 'Spin Class',
      image: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f',
      description: 'Intense cycling workout with energizing music',
      trainer: 'David Martinez',
      date: '2025-10-17T07:00:00',
      takenSpots: 12,
      totalSpots: 15,
      createdAt: '2025-10-03T08:45:00',
      updatedAt: '2025-10-07T16:10:00',
    },
    {
      id: '4',
      title: 'CrossFit WOD',
      image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438',
      description: 'Workout of the day featuring functional movements at high intensity',
      trainer: 'Emily Rodriguez',
      date: '2025-10-18T17:30:00',
      takenSpots: 10,
      totalSpots: 15,
      createdAt: '2025-10-04T12:00:00',
      updatedAt: '2025-10-08T11:45:00',
    },
    {
      id: '5',
      title: 'Pilates Core',
      image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a',
      description: 'Strengthen your core with controlled movements and breathing',
      trainer: 'Amanda Lee',
      date: '2025-10-19T10:30:00',
      takenSpots: 18,
      totalSpots: 20,
      createdAt: '2025-10-05T09:30:00',
      updatedAt: '2025-10-09T10:00:00',
    },
  ];
}
