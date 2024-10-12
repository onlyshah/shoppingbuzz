import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { SessionService } from './session.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router,
    private sessionService: SessionService
  ) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
     // Check if the session is active and the user is logged in
     if (this.sessionService.isSessionActive() && this.authService.isLoggedIn()) {
      return true;  // Allow access to the route
    } else {
      // End the session and redirect to login if session is inactive or user is not logged in
      this.sessionService.endSession();  
      this.router.navigate(['/login'])// Optionally pass the return URL
      return false;  // Block access to the route
    }
  }
}

