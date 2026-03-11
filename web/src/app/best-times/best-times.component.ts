import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NodeService } from '../Services/NodeService';

@Component({
  selector: 'app-best-times',
  templateUrl: './best-times.component.html',
  styleUrls: ['./best-times.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class BestTimesComponent implements OnInit {
  rows: { id: number; start_time: string; stop_time: string; duration: string }[] = [];
  columns: string[] = ['ID', 'Start Time', 'Stop Time', 'Elapsed Time'];

  constructor(private nodeService: NodeService) { }

  ngOnInit(): void {
    this.fetchTimes();
  }

  // Void that obtains the starting and ending times of each route
  fetchTimes(): void {
    this.nodeService.getTime().subscribe({
      next: (data) => {
        this.rows = data.map(row => ({ // Mapping the data to the rows array
          id: row.id,
          start_time: row.start_time,
          stop_time: row.stop_time,
          duration: this.calculateDuration(row.start_time, row.stop_time)
        }));
        console.log('Times obtained:', this.rows);
      },
      error: (err) => {
        console.error('Error obtaining times:', err);
      },
    });
  }

  // Method that calculates the duration of each route
  calculateDuration(startTime: string, stopTime: string): string {
    const start = new Date(`1970-01-01T${startTime}`);
    const stop = new Date(`1970-01-01T${stopTime}`);
    const diffMs = stop.getTime() - start.getTime();
    const diffMins = Math.floor(diffMs / 60000); // 1 minute = 60000 milliseconds
    const diffSecs = Math.floor((diffMs % 60000) / 1000); // 1 second = 1000 milliseconds
    return `${diffMins}m ${diffSecs}s`;
  }
}