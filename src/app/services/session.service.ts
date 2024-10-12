import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private tokenKey: string = 'authToken';  // Key for storing the token in localStorage

  constructor(private router: Router, private auth: AuthService) {
    this.checkSession();  // Check if there's an existing session on service initialization
  }

  // Start session by saving user data and token
  startSession(userData: any) {
    if (userData.token) {
      // Store the token in localStorage
      localStorage.setItem(this.tokenKey, userData.token);

      // Store the user data in localStorage or sessionStorage
      localStorage.setItem('userData', JSON.stringify(userData));

      // Optionally, set the user value in AuthService
      this.auth.setUserValue(userData);
    } else {
      console.error('No token found in user data.');
    }
  }

  // End session by clearing the token and user data
  endSession() {
    localStorage.removeItem(this.tokenKey); // Clear token
    localStorage.removeItem('userData'); // Clear user data
    sessionStorage.removeItem('userData')
    this.auth.clearUserValue(); // Clear user data from AuthService

    this.router.navigate(['/login']); // Redirect to login page
  }

  // Check if the session is active by checking for the token and user data
  isSessionActive(): boolean {
    const token = localStorage.getItem(this.tokenKey);
    const userData = localStorage.getItem('userData');

    if (token && userData) {
      // Optionally, set the user value in AuthService if it's not already set
      this.auth.setUserValue(JSON.parse(userData));
      return true;
    }
    return false;
  }

  // Check session and redirect if no session is active
  checkSession() {
    if (!this.isSessionActive()) {
      this.router.navigate(['/']);  // Redirect to login if no session
    }
  }

  // Optionally reset session (e.g., in case of re-login or new token)
  resetSession(userData: any) {
    this.endSession(); // Clear previous session
    this.startSession(userData); // Start a new session
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
//       console.log('parsedData',parsedData)
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
