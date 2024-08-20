import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { SessionService } from './session.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService, 
    private router: Router,
    private sessionService: SessionService
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.sessionService.isSessionActive() && this.authService.isLoggedIn()) {
      return true;  // Allow navigation if session is active and user is logged in
    } else {
      this.sessionService.endSession();  // End session if inactive
      this.router.navigate(['/login']);  // Redirect to login page
      return false;  // Block navigation
    }
  }
}

// export class AuthGuard implements CanActivate {
//   constructor(private authService: AuthService, private router: Router,
//     private sessionService: SessionService
//   ) {}

//   canActivate(
//     next: ActivatedRouteSnapshot,
//     state: RouterStateSnapshot
//   ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
//     if (this.sessionService.isSessionActive() && this.authService.isLoggedIn()) {
//       return true;
//     } else {
//       this.router.navigate(['/login']);
//       return false;
//     }
//     // if (this.authService.isLoggedIn()) {
//     //   return true;
//     // } else {
//     //   this.router.navigate(['/login']);
//     //   return false;
//     // }
//   }
// }
