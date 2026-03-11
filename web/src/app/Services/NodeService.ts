import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs'; // Using Observables to handle API requests
import { catchError } from 'rxjs/operators';

export interface Node {
  id: string;
  semaphore_up: number;
  semaphore_right: number;
  semaphore_down: number;
  semaphore_left: number;
}

@Injectable({
  providedIn: 'root'
})
export class NodeService {
  private apiUrl = 'http://localhost:3000/api/nodes';

  constructor(private http: HttpClient) { }

  // Get all nodes from the API 
  getAllNodes(): Observable<Node[]> {
    return this.http.get<Node[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Error communicating with the API:', error);
    return throwError('An error occurred with the request. Please try again later.');
  }

  // Get the coordinates of the ambulance 
  getCoordinates(): Observable<{ previous: { x: number; y: number }, actual: { x: number; y: number }, next: { x: number; y: number } }[]> {
    return this.http.get<{ previous: { x: number; y: number }, actual: { x: number; y: number }, next: { x: number; y: number } }[]>(`${this.apiUrl}/coordinates`).pipe(
      catchError(this.handleError)
    );
  }

  // Get the starting and ending times of each route
  getTime(): Observable<{ id: number; start_time: string; stop_time: string }[]> {
    return this.http.get<{ id: number; start_time: string; stop_time: string }[]>(`${this.apiUrl}/time`).pipe(
      catchError(this.handleError)
    );
  }

}
