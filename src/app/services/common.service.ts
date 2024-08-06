import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, Subject, map } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CommonService implements OnInit {
  public subjectOBJ = new Subject<any>();
  private cardCountSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  cardCount$: Observable<number> = this.cardCountSubject.asObservable();

  private wishlistCountSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  wishlistCount$: Observable<number> = this.wishlistCountSubject.asObservable();

  private searchSubject = new BehaviorSubject<any[]>([]);
  public searchData$: Observable<any[]> = this.searchSubject.asObservable();

  private orderStatussubject = new BehaviorSubject<any[]>([]);
  public orderStatussubjec$: Observable<any[]> = this.orderStatussubject.asObservable();

  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Accept': '*/*'
  });

  constructor(private http: HttpClient) {}

  ngOnInit(): void {}

  private getOptions(): { headers: HttpHeaders } {
    return { headers: this.headers };
  }

  getCategory(): Observable<any> {
    return this.http.get(environment.baseUrl + 'getcategory', this.getOptions());
  }

  getSubCategory(): Observable<any> {
    return this.http.get(environment.baseUrl + 'viewSubcategory', this.getOptions());
  }

  getAll(): Observable<any> {
    return this.http.get(environment.baseUrl + 'getall', this.getOptions());
  }

  getCarousel(): Observable<any> {
    return this.http.get(environment.baseUrl + 'getcarousle', this.getOptions());
  }

  getCardCarousel(): Observable<any> {
    return this.http.get(environment.baseUrl + 'getcardcarousel', this.getOptions());
  }

  addToCart(data: any): Observable<any> {
    return this.http.post(environment.baseUrl + 'cart/addtocart', data, this.getOptions());
  }

  onUpdateCart(data: any): Observable<any> {
    return this.http.put(environment.baseUrl + 'cart/updatecart', data, this.getOptions());
  }

  getProduct(): Observable<any> {
    return this.http.get(environment.baseUrl + 'viewProducts', this.getOptions());
  }

  addToWishlist(data: any): Observable<any> {
    return this.http.post(environment.baseUrl + 'wishlist/createwishlist', data, this.getOptions());
  }

  getProductToCart(userId: any): Observable<any> {
    return this.http.get(environment.baseUrl + 'cart/getcart/' + userId, this.getOptions())
      .pipe(map((response: any) => {
        const productCount = response.productCount;
        this.cardCountSubject.next(productCount);
        console.log('Updated cartState', this.cardCountSubject.value);
        return response;
      }));
  }

  getWishlist(userId: any): Observable<any> {
    return this.http.get(environment.baseUrl + 'wishlist/getwishlist/' + userId, this.getOptions())
      .pipe(map((response: any) => {
        const listCount = response.ListCount;
        this.wishlistCountSubject.next(listCount);
        console.log('Updated wishlistState', this.wishlistCountSubject.value);
        return response;
      }));
  }

  orderCreate(order: any): Observable<any> {
    return this.http.post(environment.baseUrl + 'order/createorder', order, this.getOptions());
  }

  getOrder(userId: any): Observable<any> {
    return this.http.get(environment.baseUrl + 'order/getorderbyuserId/' + userId, this.getOptions());
  }

  deleteWishlistProd(userId: any, productId: any): Observable<any> {
    console.log(productId);
    return this.http.delete(environment.baseUrl + 'wishlist/deletewishlist/' + userId + '/' + productId, this.getOptions())
      .pipe(map((response: any) => {
        this.subjectOBJ.next(response);
        return response;
      }));
  }

  deleteCartItem(userId: any, productId: any): Observable<any> {
    return this.http.delete(environment.baseUrl + 'cart/deletecartitem/' + userId + '/' + productId, this.getOptions())
      .pipe(map((response: any) => {
        this.subjectOBJ.next(response);
        return response;
      }));
  }

  deleteCartItemByUserId(userId: any): Observable<any> {
    return this.http.delete(environment.baseUrl + 'cart/deleteByuId/' + userId, this.getOptions())
      .pipe(map((response: any) => {
        this.subjectOBJ.next(response);
        return response;
      }));
  }

  searchData(data: any): Observable<any> {
    return this.http.get(`${environment.baseUrl}search?searchValue=${data}`, this.getOptions())
      .pipe(map((response: any) => {
        this.searchSubject.next(response);
        return response;
      }));
  }

  getSearchObservable(): Observable<any> {
    return this.searchSubject.asObservable();
  }

  updateSearchResults(results: any[]): void {
    console.log("*****", results);
    this.searchSubject.next(results);
    console.log(results);
  }

  updateOrderStatus(orderId: any, data: any): Observable<any> {
    return this.http.put(environment.baseUrl + 'order/update-status/' + orderId, data, this.getOptions())
      .pipe(map((response: any) => {
        this.orderStatussubject.next(response);
        return response;
      }));
  }
}
