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

  constructor() {
  // Initialize with the current network status
  this.updateNetworkStatus(navigator.onLine);

  window.addEventListener('online', () => this.updateNetworkStatus(true));
  window.addEventListener('offline', () => this.updateNetworkStatus(false));
   // Start periodic checks
   setInterval(() => this.checkConnection(), this.checkInterval);
  }

  private updateNetworkStatus(isOnline: boolean) {
    this.connectionStatus.next(isOnline);
  }

  getNetworkStatus() {
    return this.connectionStatus.asObservable();
  }
  checkConnectionSpeed(): boolean {
    const connection = (navigator as any).connection;
    
    if (connection) {
      // Check if the connection is in a slow type category
      if (this.slowConnectionTypes.includes(connection.effectiveType)) {
        return true;
      }

      // If on 5G, check if the downlink speed is below the threshold
      if (connection.effectiveType === '5g' && connection.downlink < this.slow5GThreshold) {
        return true; // Consider it as slow 5G
      }
    }
    
    return false;
  }
  private checkConnection() {
    // Perform a simple ping to check internet connectivity
    fetch('https://e-commercebackend-6r5v.onrender.com/', { method: 'HEAD', mode: 'no-cors' })
      .then(() => this.updateNetworkStatus(true))
      .catch(() => this.updateNetworkStatus(false));
  }
}
