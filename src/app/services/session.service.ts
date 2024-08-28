import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private sessionExpiry: number = 0; 
  private sessionTimeout: any;
  private idleTimeout: any;
  private idleDuration: number = 5 * 60 * 1000; // 5 minutes of inactivity

  constructor(private router: Router) {
    this.resetSession();  // Check if there's an existing session on service initialization
    this.initializeIdleDetection(); // Initialize idle detection
  }

  startSession(duration: number) {
    this.sessionExpiry = Date.now() + duration;
    this.sessionTimeout = setTimeout(() => this.endSession(), duration);
    let userData = sessionStorage.getItem('userData')
    this.saveSession(userData);  //  // Save the session expiry in session storage
  }

  resetSession() {
    const storedExpiry = sessionStorage.getItem('userData');
    if (storedExpiry) {
      this.sessionExpiry = parseInt(storedExpiry, 10);
      if (this.sessionExpiry > Date.now()) {
        const remainingTime = this.sessionExpiry - Date.now();
        this.sessionTimeout = setTimeout(() => this.endSession(), remainingTime);
      } else {
        this.endSession();  // End session if expired
      }
    }
  }

  endSession() {
    clearTimeout(this.sessionTimeout);
    clearTimeout(this.idleTimeout);
    this.sessionExpiry = 0;
    sessionStorage.removeItem('userData');  // Clear user data as well
    this.router.navigate(['/login']); // Redirect to login
  }

  isSessionActive(): boolean {
    return this.sessionExpiry > Date.now();
  }

  saveSession(userData:any) {
    userData.sessionExpiry = this.sessionExpiry;
    sessionStorage.setItem('userData', JSON.stringify(userData));
  }

  private initializeIdleDetection() {
    // Detect user activity to reset idle timer
    const events = ['mousemove', 'keydown', 'scroll', 'click'];
    events.forEach(event => window.addEventListener(event, this.resetIdleTimer.bind(this)));

    // Set initial idle timeout
    this.idleTimeout = setTimeout(() => this.endSession(), this.idleDuration);
  }

  private resetIdleTimer() {
    clearTimeout(this.idleTimeout);
    this.idleTimeout = setTimeout(() => this.endSession(), this.idleDuration);
  }
}












