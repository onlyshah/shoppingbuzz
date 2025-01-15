import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, Subject, map, tap } from 'rxjs';
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

  private wishliststatusSubject: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  wishlistStatus$: Observable<any> = this.wishliststatusSubject.asObservable();

  private cartstatusSubject: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  cartStatus$: Observable<any> = this.cartstatusSubject.asObservable();

 
  constructor(private http: HttpClient) {
  
  }
  ngOnInit(): void {}
  // Set methods to update the values
  setCardCount(count: number): void {
    this.cardCountSubject.next(count);
  }

  setWishlistCount(count: number): void {
    this.wishlistCountSubject.next(count);
  }
 
  getCardCount(): number {
    return this.cardCountSubject.getValue();
  }

  getWishlistCount(): number {
    return this.wishlistCountSubject.getValue();
  }
  getCatgeory() :Observable<any>{
    return this.http.get(environment.baseUrl + 'getcategory');
  }
  getsubCatgeory():Observable<any> {
    return this.http.get(environment.baseUrl + 'viewSubcategory');
  }
  // getall():Observable<any> {
  //   return this.http.get(environment.baseUrl + 'getall');
  // }
  getall(page: number = 1, pageSize: number = 10): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());
  
    return this.http.get<any>(environment.baseUrl + 'getall', { params });
  }
  
  getcarousel():Observable<any> {
    return this.http.get(environment.baseUrl + 'getcarousle');
  }
  getCardcarousel():Observable<any> {
    return this.http.get(environment.baseUrl + 'getcardcarousel');
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
  deleteWishlistprod(userId:any ,productId:any) :Observable<any>{
    console.log(productId)
    return this.http.delete(environment.baseUrl+'wishlist/deletewishlist/'+userId+ '/' + productId)
    .pipe(map((response:any) => {
      // store user details and jwt token in local storage to keep user logged in between page refreshes
      this.subjectOBJ.asObservable();
      this.subjectOBJ.next(response);
      return response;
  }));
  }
  deletecartItem(userId:any ,productId:any):  Observable<any>{
    return this.http.delete(environment.baseUrl+'cart/deletecartitem/'+ userId + '/' + productId).pipe(map((response:any) => {
      // store user details and jwt token in local storage to keep user logged in between page refreshes
      this.subjectOBJ.asObservable();
      this.subjectOBJ.next(response);
      return response;
  }));
  }
  deletecartItemByuserId(userId:any):  Observable<any>{
    return this.http.delete(environment.baseUrl+'cart/deleteByuId/'+ userId).pipe(map((response:any) => {
      // store user details and jwt token in local storage to keep user logged in between page refreshes
      this.subjectOBJ.asObservable();
      this.subjectOBJ.next(response);
      return response;
  }));
  }
  SearchData(data:any): Observable<any> {
    return this.http.get(`${environment.baseUrl}search?searchValue=${data}`)
    .pipe(map((response:any) => {
      // store user details and jwt token in local storage to keep user logged in between page refreshes
      this.searchSubject.asObservable();
      this.searchSubject.next(response);
      return response;
      // this.searchSubject.next(response);
      // return response;
  }));
  }
  getSearchObservable(): Observable<any> {
    return this.searchSubject.asObservable();
  }
  updateSearchResults(results: any[]): void {
    console.log("*****",results)
    this.searchSubject.next(results);
    console.log(results)
  }
  updateOrderStatus(orderId:any,data:any){
    return this.http.put(environment.baseUrl+'order/update-status/'+ orderId ,data).pipe(map((response:any) => {
      // store user details and jwt token in local storage to keep user logged in between page refreshes
      this.orderStatussubject.asObservable();
      this.orderStatussubject.next(response);
      return response;
  }));
  }
  checkcart(data:any):Observable<any>{
    return this.http.post(environment.baseUrl+'cart/checkcart',data).pipe(map((response: any) => {
      const cart = response.success; // Assuming response contains productCount
      this.cartstatusSubject.next(cart);
      console.log('Updated cartStatus', this.cartstatusSubject.value);
      return response;
    }));
  }
  checkWhislist(data:any): Observable<any>{
    return this.http.post(environment.baseUrl+'wishlist/check-wishlist',data).pipe(map((response: any) => {
      const wishList = response.success; // Assuming response contains productCount
      this.wishliststatusSubject.next(wishList);
      console.log('Updated wishListStatus', this.wishliststatusSubject.value);
      return response;
    }));
  }
  setWishlistStatus(status: boolean): void {
    this.wishliststatusSubject.next(status);
  }
  
  getWishlistStatus(): Observable<boolean> {
    return this.wishliststatusSubject.asObservable();
  }
 
}
