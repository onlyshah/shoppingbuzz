import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private sessionExpiry = (JSON.parse( sessionStorage.getItem('user')!));
  private sessionTimeout: any;

  constructor() {
    this.resetSession();
  }

  startSession(duration: number) {
    this.sessionExpiry = Date.now() + duration;
    this.sessionTimeout = setTimeout(() => this.endSession(), duration);
  }

  resetSession() {
    const storedExpiry =  sessionStorage.getItem(this.sessionExpiry);
    if (storedExpiry) {
      this.sessionExpiry = parseInt(storedExpiry, 10);
      if (this.sessionExpiry > Date.now()) {
        const remainingTime = this.sessionExpiry - Date.now();
        this.sessionTimeout = setTimeout(() => this.endSession(), remainingTime);
      } else {
        this.endSession();
      }
    } else {
      this.sessionExpiry = 0;
    }
  }

  endSession() {
    clearTimeout(this.sessionTimeout);
    this.sessionExpiry = 0;
     sessionStorage.removeItem('user');
  }

  isSessionActive(): boolean {
    return this.sessionExpiry > Date.now();
  }

  saveSession() {
     sessionStorage.setItem('user', this.sessionExpiry.toString());
  }
}
