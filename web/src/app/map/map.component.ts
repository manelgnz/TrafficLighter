import { Component, OnInit, OnDestroy } from '@angular/core';
import * as L from 'leaflet';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NodeService } from '../Services/NodeService';
import 'leaflet-rotatedmarker';

declare module 'leaflet' {
  interface Marker {
    setRotationAngle(angle: number): this;
    setRotationOrigin(origin: string): this;
  }
}

interface Node {
  coordinates: string;
  position: L.LatLng;
  marker: L.Marker;
  semaphore_up?: number | null;
  semaphore_down?: number | null;
  semaphore_left?: number | null;
  semaphore_right?: number | null;
}

@Component({
  selector: 'app-mapa',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent implements OnInit, OnDestroy {
  map!: L.Map;
  nodes: Node[] = [];
  intervalId: any; // For the interval that loads the nodes

  initialX: number = 0;
  initialY: number = 0;
  finalX: number = 0;
  finalY: number = 0;
  ambulanceMarker: L.Marker | null = null;
  lastPosition: L.LatLng | null = null; // Last position of the ambulance
  currentRouteIndex: number = 0; // To keep track of the current route index
  ambulanceInterval: any; // For the ambulance movement interval  

  nodePositions: { [key: string]: { [key: string]: L.LatLng } } = {
    'node00': { //NODE 00
      up: L.latLng(173, 221),
      right: L.latLng(148, 250),
      down: L.latLng(123, 221),
      left: L.latLng(148, 190),
    },
    'node01': { //NODE 01
      up: L.latLng(326, 221),
      right: L.latLng(301, 250),
      down: L.latLng(279, 221),
      left: L.latLng(301, 190),
    },
    'node02': { //NODE 02
      up: L.latLng(479, 221),
      right: L.latLng(454, 250),
      down: L.latLng(432, 221),
      left: L.latLng(454, 190),
    },
    'node03': { //NODE 03
      up: L.latLng(637, 221),
      right: L.latLng(607, 250),
      down: L.latLng(585, 221),
      left: L.latLng(607, 190),
    },
    'node04': { //NODE 10
      up: L.latLng(173, 431),
      right: L.latLng(148, 461),
      down: L.latLng(123, 431),
      left: L.latLng(148, 401),
    },
    'node05': { //NODE 11
      up: L.latLng(326, 431),
      right: L.latLng(301, 461),
      down: L.latLng(279, 431),
      left: L.latLng(301, 401),
    },
    'node06': { //NODE 12
      up: L.latLng(479, 431),
      right: L.latLng(454, 461),
      down: L.latLng(429, 431),
      left: L.latLng(454, 401),
    },
    'node07': { //NODE 13
      up: L.latLng(632, 431),
      right: L.latLng(607, 461),
      down: L.latLng(585, 431),
      left: L.latLng(607, 401),
    },
    'node08': { //NODE 21
      up: L.latLng(326, 642),
      right: L.latLng(301, 672),
      down: L.latLng(279, 642),
      left: L.latLng(301, 612),
    },
    'node09': { //NODE 22
      up: L.latLng(479, 642),
      right: L.latLng(454, 672),
      down: L.latLng(429, 642),
      left: L.latLng(454, 612),
    },
  };

  constructor(private nodeService: NodeService) { }

  ngOnInit(): void {
    this.initMap();
    this.intervalId = setInterval(() => {
      this.loadNodes();
      this.updateAmbulancePosition();
    }, 1000);
  }

  initMap(): void {
    this.map = L.map('map', {
      crs: L.CRS.Simple,
      minZoom: 0,
      maxZoom: 0,
      zoomControl: false,
      dragging: false
    });

    const bounds = L.latLngBounds([[0, 0], [768, 858]]); // Set the limits of the map
    L.imageOverlay('assets/images/map5_bw.jpg', bounds).addTo(this.map);
    this.map.fitBounds(bounds);
  }

  // Load the nodes from the API and display them on the map
  loadNodes(): void {
    this.nodeService.getAllNodes().subscribe({
      next: (nodes) => { // When the nodes are loaded
        this.nodes.forEach(node => { // Remove the markers from the map 
          node.marker.remove();
        });
        this.nodes = []; // Clear the nodes array

        nodes.forEach((node, index) => {
          const nodeId = `node${index.toString().padStart(2, '0')}`;

          console.log(`Loading node: ${nodeId}, State: ${JSON.stringify(node)}`);

          ['up', 'right', 'down', 'left'].forEach(direction => { // Iterate over the directions
            const semaphoreState = (node as any)[`semaphore_${direction}`];  // Get the semaphore state
            if (semaphoreState !== null) {
              const position = this.nodePositions[nodeId]?.[direction]; // Get the position of the node
              const state = semaphoreState === 1 ? 'green' : 'red'; // Set the color of the semaphore
              if (position) {
                this.addMarker(position, state, `${nodeId}-${direction}`);
                console.log(`Node ${nodeId} position towards ${direction}: ${position.lat}, ${position.lng} - State: ${state}`);
              }
            }
          });
        });
      },
      error: (err) => {
        console.error('Error loading nodes:', err);
      }
    });
  }

  addMarker(latlng: L.LatLng, state: 'red' | 'green', nodeId: string): void {
    const iconUrl = state === 'red' ? 'assets/images/red.png' : 'assets/images/green.png';
    const customIcon = L.icon({
      iconUrl,
      iconSize: [20, 20],
      iconAnchor: [10, 20],
      popupAnchor: [0, -20],
    });

    const existingNode = this.nodes.find(node => node.coordinates === nodeId); // Check if the node already exists
    if (existingNode) {
      existingNode.marker.setLatLng(latlng); // Update the position of the marker  
      existingNode.marker.getPopup()?.setContent(`${nodeId} - ${state}`); // Update the popup content
      existingNode.marker.openPopup();
    } else {
      const marker = L.marker(latlng, { icon: customIcon, zIndexOffset: 500 }).addTo(this.map);
      this.nodes.push({ coordinates: nodeId, position: latlng, marker }); // Add the new node to the array
    }
  }

  positionMapping: { [key: string]: L.LatLng } = {

    'position_0_0': L.latLng(155, 220), // ON node 00
    'position_0_1': L.latLng(300, 220), // ON node 01
    'position_0_2': L.latLng(455, 220), // ON node 02
    'position_0_3': L.latLng(605, 220), // ON node 03

    'position_1_0': L.latLng(155, 427), // ON node 10
    'position_1_1': L.latLng(300, 427), // ON node 11
    'position_1_2': L.latLng(455, 427), // ON node 12
    'position_1_3': L.latLng(605, 427), // ON node 13

    'position_2_1': L.latLng(300, 640), // ON node 21
    'position_2_2': L.latLng(455, 640), // ON node 22

    'position_0_0_to_0_1': L.latLng(220, 220), // BETWEEN node 00 and node 01
    'position_0_1_to_0_0': L.latLng(220, 220), // BETWEEN node 01 and node 00

    'position_0_1_to_0_2': L.latLng(380, 220), // BETWEEN node 01 and node 02
    'position_0_2_to_0_1': L.latLng(380, 220), // BETWEEN node 02 and node 01

    'position_0_2_to_0_3': L.latLng(530, 220), // BETWEEN node 02 and node 03
    'position_0_3_to_0_2': L.latLng(530, 220), // BETWEEN node 03 and node 02

    'position_0_0_to_1_0': L.latLng(155, 320), // BETWEEN node 00 and node 10
    'position_1_0_to_0_0': L.latLng(155, 320), // BETWEEN node 10 and node 00

    'position_0_1_to_1_1': L.latLng(300, 320), // BETWEEN node 01 and node 11
    'position_1_1_to_0_1': L.latLng(300, 320), // BETWEEN node 11 and node 01

    'position_0_2_to_1_2': L.latLng(455, 320), // BETWEEN node 02 and node 12
    'position_1_2_to_0_2': L.latLng(455, 320), // BETWEEN node 12 and node 02

    'position_0_3_to_1_3': L.latLng(605, 320), // BETWEEN node 03 and node 13
    'position_1_3_to_0_3': L.latLng(605, 320), // BETWEEN node 13 and node 03

    'position_1_0_to_1_1': L.latLng(220, 427), // BETWEEN node 10 and node 11
    'position_1_1_to_1_0': L.latLng(220, 427), // BETWEEN node 11 and node 10

    'position_1_1_to_1_2': L.latLng(380, 427), // BETWEEN node 11 and node 12
    'position_1_2_to_1_1': L.latLng(380, 427), // BETWEEN node 12 and node 11

    'position_1_2_to_1_3': L.latLng(530, 427), // BETWEEN node 12 and node 13
    'position_1_3_to_1_2': L.latLng(530, 427), // BETWEEN node 13 and node 12

    'position_1_1_to_2_1': L.latLng(300, 530), // BETWEEN node 11 and node 21
    'position_2_1_to_1_1': L.latLng(300, 530), // BETWEEN node 21 and node 11

    'position_1_2_to_2_2': L.latLng(455, 530), // BETWEEN node 12 and node 22
    'position_2_2_to_1_2': L.latLng(455, 530), // BETWEEN node 22 and node 12

    'position_2_1_to_2_2': L.latLng(380, 640), // BETWEEN node 21 and node 22
    'position_2_2_to_2_1': L.latLng(380, 640), // BETWEEN node 22 and node 21

  };

private isAnimating: boolean = false;
private lastPositionVehicle: L.LatLng | null = null;

updateAmbulancePosition(): void {
  this.nodeService.getCoordinates().subscribe((data) => {
    if (data.length > 0) {
      const { previous, actual, next } = data[0];

      const previousToActualKey = `position_${previous.x}_${previous.y}_to_${actual.x}_${actual.y}`;
      const actualKey = `position_${actual.x}_${actual.y}`;
      const actualToNextKey = `position_${actual.x}_${actual.y}_to_${next.x}_${next.y}`;

      const previousToActualPosition = this.positionMapping[previousToActualKey];
      const actualToNextPosition = this.positionMapping[actualToNextKey];
      const actualPosition = this.positionMapping[actualKey];

      if (previousToActualPosition && actualToNextPosition) {
        if (this.lastPositionVehicle && this.lastPositionVehicle.equals(actualToNextPosition)) {
          console.log('The ambulance is now at the target position.');
          return;
        }

        if (!this.isAnimating) {
          this.isAnimating = true;

          if (!this.ambulanceMarker) {
            this.ambulanceMarker = L.marker(previousToActualPosition, {
              icon: L.icon({
                iconUrl: 'assets/images/ambulance.png',
                iconSize: [45, 45],
                iconAnchor: [15, 30], //
              }),
              zIndexOffset: 1000,
            }).addTo(this.map);

            this.lastPositionVehicle = previousToActualPosition;
            this.isAnimating = false;
          } else {
            // Chaining animations sequentially
            this.animateMarker(this.ambulanceMarker, previousToActualPosition, actualPosition, 1000)
              .then(() => {
                this.lastPositionVehicle = actualToNextPosition;
                if (this.ambulanceMarker) {
                  return this.animateMarker(this.ambulanceMarker, actualPosition, actualToNextPosition, 1000);
                } else {
                  console.error('The ambulance marker is not initialized.');
                  return Promise.resolve(); 
                }
              })
              .then(() => {
                this.lastPositionVehicle = actualToNextPosition;
                this.isAnimating = false;
              })
              .catch((error) => {
                console.error('Animation error:', error);
                this.isAnimating = false;
              });
          }
        }
      } else {
        console.error('The positions are not defined correctly.');
      }
    }
  });
}

animateMarker(marker: L.Marker, from: L.LatLng, to: L.LatLng, duration: number): Promise<void> {
  return new Promise((resolve, reject) => {
    const startTime = performance.now();

    // Calculate the rotation angle at the start
    const rotationAngle = this.calculateRotationAngle(from, to);
    marker.setRotationAngle(rotationAngle); // Apply the initial rotation

    const animate = (currentTime: number) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);

      const lat = from.lat + (to.lat - from.lat) * progress;
      const lng = from.lng + (to.lng - from.lng) * progress;

      marker.setLatLng([lat, lng]); // Move the marker

      if (progress < 1) {
        requestAnimationFrame(animate); // Keep animating
      } else {
        resolve(); // Animation ended
      }
    };

    requestAnimationFrame(animate);
  });
}


calculateRotationAngle(from: L.LatLng, to: L.LatLng): number {
  const deltaX = to.lng - from.lng; // Difference in length
  const deltaY = from.lat - to.lat; // Invert the difference in latitude
  const angleRad = Math.atan2(deltaY, deltaX); // Calculate the angle in radians
  const angleDeg = (angleRad * 180) / Math.PI; // Convert to degrees
  return angleDeg; 
}




  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}