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
    const storedUser = sessionStorage.getItem('userData');
    this.userSubject = new BehaviorSubject(storedUser ? JSON.parse(storedUser) : null);

      //this.userSubject = new BehaviorSubject(JSON.parse( sessionStorage.getItem('userData')!));
     // window.addEventListener('beforeunload', this.clearTokenOnClose);

  }    
  public get userValue() {
      return this.userSubject.value;
  }
  public setUserValue(token: string) {
    const userData = { token }; // Update the userSubject with the token
    this.userSubject.next(userData); // Notify all subscribers of the new user value
    sessionStorage.setItem('userData', JSON.stringify(userData)); // Save to session storage
  }

  public clearUserValue() {
    this.userSubject.next(null); // Clear the user data
    sessionStorage.removeItem('userData'); // Clear from session storage
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
  logoutUser(data:any) {
       console.log('data',data)
      //remove user from local storage to log user out
     return this.http.post(environment.baseUrl+'logout',data) .pipe(map(user => {
  // store user details and jwt token in local storage to keep user logged in between page refreshes
 sessionStorage.removeItem('userData');
  this.userSubject.next(null);
 
  return user;
}))
    
  }
  createOrder(amount: number) {
    return this.http.post(environment.baseUrl+"create-order", { amount });
  }
  verifyPayment(paymentDetails: any) {
    return this.http.post(environment.baseUrl+ "verify-paymen", paymentDetails);
  }
}

