import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { map, Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService  {

  private userSubject: BehaviorSubject<any>;
  private loggedInStatus = false;
 

  constructor(
      private router: Router,
      private http: HttpClient
  ) {
      this.userSubject = new BehaviorSubject(JSON.parse( sessionStorage.getItem('userData')!));
     // window.addEventListener('beforeunload', this.clearTokenOnClose);

  }    
  public get userValue() {
      return this.userSubject.value;
  }
  public setUserValue(userData: any) {
    // Update the userSubject with the new user data
    this.userSubject.next(userData);
    
    // Optionally store it in sessionStorage to persist it across refreshes
    sessionStorage.setItem('userData', JSON.stringify(userData));
  }

  public clearUserValue() {
    // Clear the userSubject and session storage
    this.userSubject.next(null);
    sessionStorage.removeItem('userData');
  }
  SignUp(data:any){
    return this.http.post<any>(environment.baseUrl+'signup',data)
  }
  login(data:any) {
    this.loggedInStatus = true;
    return this.http.post<any>(environment.baseUrl+'login',data)
        .pipe(map(user => {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
             sessionStorage.setItem('userData', JSON.stringify(user));
             console.log('authsession',sessionStorage.getItem('userData'))
            this.userSubject.next(user);
            console.log("userSubject",this.userSubject)
            return user;
        }));
}

logout(data:any) {
  this.loggedInStatus = false;
    // remove user from local storage to log user out
   return  this.http.post(environment.baseUrl+'logout',data).pipe(map(user => {
      sessionStorage.removeItem('userData');
      this.userSubject.next(null);
      this.router.navigate(['']).then(() => {
        location.reload();
    });
    return user;
    }))
    
}
getUser(id:any){
 return this.http.get(environment.baseUrl+'getuser/'+id)
}
AddUseraddress(data:any , userId:any){
    return this.http.post(environment.baseUrl+'addUseraddress/'+userId,data)
}
billsendtoEmail(data:any){
    return this.http.post(environment.baseUrl+'email',data)
  }
  isLoggedIn() {

    return this.loggedInStatus;
  }
  // private clearTokenOnClose = () => {
  //   this.logout();
  // }

  sendResetLink(data:any): Observable<any>{
    return this.http.post(environment.baseUrl+'forgotpassword',data)
  }
  resetuserPassword(data:any){
    console.log(data)
    return this.http.post(environment.baseUrl+'resetpassword',data)
  }
  createOrder(amount: number) {
    return this.http.post(environment.baseUrl+"create-order", { amount });
  }
  verifyPayment(paymentDetails: any) {
    return this.http.post(environment.baseUrl+ "verify-paymen", paymentDetails);
  }
}

