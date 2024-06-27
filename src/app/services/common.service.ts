import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, Subject, map, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CommonService implements OnInit {
  public data = new Subject<any>();
  private cardCountSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  cardCount$: Observable<number> = this.cardCountSubject.asObservable();

  private wishlistCountSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  wishlistCount$: Observable<number> = this.wishlistCountSubject.asObservable();
 
  constructor(private http: HttpClient) {}
  

 
  ngOnInit(): void {}
  getCatgeory() :Observable<any>{
    return this.http.get(environment.baseUrl + 'getcategory');
  }
  getsubCatgeory():Observable<any> {
    return this.http.get(environment.baseUrl + 'viewSubcategory');
  }
  getall():Observable<any> {
    return this.http.get(environment.baseUrl + 'getall');
  }
  getcarousel():Observable<any> {
    return this.http.get(environment.baseUrl + 'getcarousle');
  }
  addtocart(data: any):Observable<any> {
    return this.http.post(environment.baseUrl + 'cart/addtocart', data);
  }
 
  onUpdatecart(data: any):Observable<any> {
    return this.http.put(environment.baseUrl + 'cart/updatecart', data);
  }
  getproduct():Observable<any> {
    return this.http.get(environment.baseUrl + 'viewProducts');
  }
  addtowishlist(data: any):Observable<any> {
    return this.http.post(
      environment.baseUrl + 'wishlist/createwishlist',
      data
    );
  }
  getproducttocart(userId: any):Observable<any> {
    return this.http.get(environment.baseUrl + 'cart/getcart/' + userId)
    .pipe(map((response: any) => {
      const productCount = response.productCount; // Assuming response contains productCount
      this.cardCountSubject.next(productCount);
      console.log('Updated cartState', this.cardCountSubject.value);
      return response;
    }));
  }

  getwishlist(userId: any):Observable<any> {
    return this.http.get(
      environment.baseUrl + 'wishlist/getwishlist/' + userId)
      .pipe(map((response: any) => {
        const ListCount = response.ListCount; // Assuming response contains productCount
        this.wishlistCountSubject.next(ListCount);
        console.log('Updated cartState', this.wishlistCountSubject.value);
        return response;
      }));
    }
  
  orderCreate(order:any):Observable<any>{
    return this.http.post(environment.baseUrl+'order/createorder',order)
  }
  
  getOrder(userId:any):Observable<any>{
    return this.http.get(environment.baseUrl+'order/getorderbyuserId/'+userId)
  }
  deleteWishlistprod(userId:any ,data:any){
    return this.http.delete(environment.baseUrl+'wishlist/deletewishlist/'+userId ,data)
  }
  
}
