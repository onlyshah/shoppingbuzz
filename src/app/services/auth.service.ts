import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { map, Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnInit, OnDestroy {

  private userSubject: BehaviorSubject<any>;
  private loggedInStatus = false;
 

  constructor(
      private router: Router,
      private http: HttpClient
  ) {
      this.userSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('user')!));
     // window.addEventListener('beforeunload', this.clearTokenOnClose);

  }

 
  ngOnInit(): void {
    throw new Error('Method not implemented.');
   }

    
  public get userValue() {
      return this.userSubject.value;
  }
  SignUp(data:any){
    return this.http.post<any>(environment.baseUrl+'signup',data)
  }
  login(data:any) {
    this.loggedInStatus = true;
    return this.http.post<any>(environment.baseUrl+'login',data)
        .pipe(map(user => {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('user', JSON.stringify(user));
            this.userSubject.next(user);
            console.log("userSubject",this.userSubject)
            return user;
        }));
}

logout() {
  this.loggedInStatus = false;
    // remove user from local storage to log user out
    localStorage.removeItem('user');
    this.userSubject.next(null);
    this.router.navigate(['/login']);
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
  ngOnDestroy(): void {
    //window.removeEventListener('beforeunload', this.clearTokenOnClose);
  }
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

