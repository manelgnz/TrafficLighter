import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-introduce-coordinates',
  templateUrl: './introduce-coordinates.component.html',
  styleUrls: ['./introduce-coordinates.component.css'],
  standalone: true,
})
export class IntroduceCoordinatesComponent {
  constructor(private router: Router) { }

  async onSubmit(event: Event): Promise<void> {
    event.preventDefault();

    // Get coordinates from the form
    const form = event.target as HTMLFormElement;
    let initialX = parseFloat(form.querySelector<HTMLInputElement>('#initialX')?.value || '0');
    let initialY = parseFloat(form.querySelector<HTMLInputElement>('#initialY')?.value || '0');
    let finalX = parseFloat(form.querySelector<HTMLInputElement>('#finalX')?.value || '0');
    let finalY = parseFloat(form.querySelector<HTMLInputElement>('#finalY')?.value || '0');

    // Validate that initial and final coordinates are not the same
    if (initialX === finalX && initialY === finalY) {
      alert("Initial and final coordinates cannot be the same");
      return;
    }

    try {
      this.router.navigate(['/map']); // Navigate to the map
      const response = await fetch('http://localhost:3000/api/nodes/route', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ initialX, initialY, finalX, finalY }), // Send initial and final coordinates to the API
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(`Error: ${errorData.message || 'Invalid coordinates'}`);
        return;
      }

      const data = await response.json(); // Get the response from the API
      console.log('API response:', data);
      await new Promise(resolve => setTimeout(resolve, 4000)); // Wait 4 seconds to simulate the ambulance's arrival
      alert('The ambulance has arrived at its destination');
      await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds before navigating back to the menu
      this.router.navigate(['/']);

    } catch (error) {
      console.error('Error sending coordinates:', error);
      alert("An error occurred while sending the coordinates. Please try again.");
    }
  }

  // Method to validate that the input is a number
  validateInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!/^[0-9]?$/.test(input.value)) { // Check if the input is a number
      input.value = '';
    }
  }
}