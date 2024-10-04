import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
 
  constructor(private router: Router,private auth:AuthService) {
    this.checkSession();  // Check if a valid session exists on service initialization
  }
  private tokenKey: any = this.auth.userValue?.token;;  // Key for storing the token in localStorage

  // Start a session by saving the token
  startSession(token: string) {
    localStorage.setItem(this.tokenKey, token);  // Save the token in localStorage
  }

  // Check if a session is active by verifying if the token exists in localStorage
  isSessionActive(): boolean {
    return !!localStorage.getItem(this.tokenKey);  // Return true if token exists
  }

  // End the session by clearing the token and redirecting to login
  endSession() {
    sessionStorage.removeItem('userData');
    localStorage.removeItem('userData'); // Clear user data
    this.auth.clearUserValue(); // Clear token from AuthService
    this.router.navigate(['']); // Redirect to login
  }

  // Logout function to explicitly log out the user and end the session
  logout() {
    this.endSession();  // Clear token and end session
  }

  // Check if session exists, redirect to login if no token is found
  checkSession() {
    if (!this.isSessionActive()) {
      this.router.navigate(['/login']);  // Redirect to login if no active session
    }
  }
}


// export class SessionService {
//   private sessionExpiry: number = 0; 
//   private sessionTimeout: any;
//   private idleTimeout: any;
//   private idleDuration: number = 5 * 60 * 1000; // 5 minutes of inactivity

//   constructor(private router: Router) {
//     this.resetSession();  // Check if there's an existing session on service initialization
//     this.initializeIdleDetection(); // Initialize idle detection
//   }

//   startSession(duration: number) {
//     this.sessionExpiry = Date.now() + duration;
//     this.sessionTimeout = setTimeout(() => this.endSession(), duration);
    
//     let userData = localStorage.getItem('userData');

//     if (userData !== null) {
//       const parsedData = JSON.parse(userData);
//       if (typeof parsedData === 'object' && parsedData !== null) {
//         parsedData.sessionExpiry = this.sessionExpiry;  // Add sessionExpiry to the parsed data
//         this.saveSession(parsedData);  // Save the session expiry in local storage
//       }
//     }
//   }

//   resetSession() {
//     const storedData = localStorage.getItem('userData');

//     if (storedData) {
//       const parsedData = JSON.parse(storedData);
//       this.sessionExpiry = parsedData.sessionExpiry || 0;

//       if (this.sessionExpiry > Date.now()) {
//         const remainingTime = this.sessionExpiry - Date.now();
//         this.sessionTimeout = setTimeout(() => this.endSession(), remainingTime);
//       } else {
//         this.endSession();  // End session if expired
//       }
//     }
//   }

//   endSession() {
//     clearTimeout(this.sessionTimeout);
//     clearTimeout(this.idleTimeout);
//     this.sessionExpiry = 0;
//     localStorage.removeItem('userData');  // Clear user data as well
//     this.router.navigate(['/login']);  // Redirect to login
//   }

//   isSessionActive(): boolean {
//     return this.sessionExpiry > Date.now();
//   }

//   saveSession(userData: any) {
//     userData.sessionExpiry = this.sessionExpiry;
//     localStorage.setItem('userData', JSON.stringify(userData));
//   }

//   private initializeIdleDetection() {
//     const events = ['mousemove', 'keydown', 'scroll', 'click'];
//     events.forEach(event => window.addEventListener(event, this.resetIdleTimer.bind(this)));

//     this.idleTimeout = setTimeout(() => this.endSession(), this.idleDuration);
//   }

//   private resetIdleTimer() {
//     clearTimeout(this.idleTimeout);
//     this.idleTimeout = setTimeout(() => this.endSession(), this.idleDuration);
//   }
// }
