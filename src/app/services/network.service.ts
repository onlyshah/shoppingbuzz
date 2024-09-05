import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NetworkService {
  private connectionStatus = new BehaviorSubject<boolean>(navigator.onLine);
  private slowConnectionTypes = ['slow-2g', '2g', '3g', '4g'];
  private slow5GThreshold = 10; // Example threshold for slow 5G (in Mbps)
  private checkInterval: number = 10000; // Check every 10 seconds
  private speedSubject = new BehaviorSubject<string>('Unknown'); // Holds speed information

  constructor() {
    // Initialize with the current network status
    this.updateNetworkStatus(navigator.onLine);

    window.addEventListener('online', () => this.updateNetworkStatus(true));
    window.addEventListener('offline', () => this.updateNetworkStatus(false));
    
    // Start periodic checks
   // setInterval(() => this.checkConnection(), this.checkInterval);
  }

  private updateNetworkStatus(isOnline: boolean) {
    this.connectionStatus.next(isOnline);
    if (isOnline) {
      this.measureSpeed(); // Trigger speed measurement when online
    }
  }

  getNetworkStatus() {
    return this.connectionStatus.asObservable();
  }

  getSpeedStatus() {
    return this.speedSubject.asObservable();
  }

  checkConnectionSpeed(): { isSlow: boolean, speed: string } {
    const connection = (navigator as any).connection;
    let isSlow = false;
    let speed = 'Unknown';

    if (connection) {
      // Check if the connection is in a slow type category
      if (this.slowConnectionTypes.includes(connection.effectiveType)) {
        isSlow = true;
        speed = connection.downlink + ' Mbps'; // Get speed in Mbps
      }

      // If on 5G, check if the downlink speed is below the threshold
      if (connection.effectiveType === '5g') {
        speed = connection.downlink + ' Mbps';
        if (connection.downlink < this.slow5GThreshold) {
          isSlow = true; // Consider it as slow 5G
        }
      }
    }

    return { isSlow, speed };
  }

  // private checkConnection() {
  //   // Perform a simple ping to check internet connectivity
  //   fetch('https://e-commercebackend-6r5v.onrender.com/', { method: 'HEAD', mode: 'no-cors' })
  //     .then(() => this.updateNetworkStatus(true))
  //     .catch(() => this.updateNetworkStatus(false));
  // }

  private async measureSpeed() {
    const testFileUrl = 'https://e-commercebackend-6r5v.onrender.com/'; // Use a small file from a reliable source
    const startTime = Date.now();

    try {
      const response = await fetch(testFileUrl);
      const sizeInBytes = parseInt(response.headers.get('Content-Length') || '1000000', 10); // Approximate size in bytes
      const endTime = Date.now();
      const durationInSeconds = (endTime - startTime) / 1000;
      const speedMbps = (sizeInBytes / durationInSeconds / 1024 / 1024).toFixed(2); // Convert bytes to Mbps

      this.speedSubject.next(`${speedMbps} Mbps`); // Update the speed
    } catch (error) {
      this.speedSubject.next('Error measuring speed');
      console.error('Speed measurement failed:', error);
    }
  }
}
