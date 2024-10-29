import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Injectable, Input, OnChanges, OnDestroy, OnInit, Output, Renderer2, SimpleChanges, inject, input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs';
import { AuthGuard } from 'src/app/services/auth.guard';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-shoppingcart',
  templateUrl: './shoppingcart.component.html',
  styleUrls: ['./shoppingcart.component.css']
})
@Injectable({
providedIn:'root'
})

export class ShoppingcartComponent  implements OnInit,OnDestroy{
  imagePath = environment.baseUrl;
 userId = this.auth.userValue?.userId
  @Input() categorytdata:any
  @Input() subcategorytdata:any
  @Input() pushproductdata:any
  @Input() getCategoryData:any
  @Input() routeId:any
  @Input() item:any
  userData:any
  @Input() getSearchData:any
  //@Input () dataitem :any
  cartcount: number;
  wishlistcount:number;
  @Input() isInWishlist  =  false;
  @Input() isInCart  = false;
  
 
  
  constructor(private comApi:CommonService , private route: Router ,
     private router: ActivatedRoute ,
    public auth:AuthService,
    public guard:AuthGuard,
    private spinner: NgxSpinnerService,
    private toster : ToastrService
    
  ) {
    console.log('searchitem',this.getSearchData)
     
    
      

     }
  

  ngOnInit() {
    this.userData=(JSON.parse( sessionStorage.getItem('userData')!))
    console.log('...', this.userData?.userId)
    let data= { userId: this.userData?.userId, productId: this.item?._id }
   
    this.checkWishlist(data);
    this.checkCart(data);

   
   
  }
  checkCart(data:any){
    this.comApi.checkcart(data).subscribe((res:any)=>{
      this.isInCart = res.success
      console.log('checkcart',this.isInCart)

    })
  }
  checkWishlist(data:any){
    this.comApi.checkWhislist(data).subscribe((res:any)=>{
      this.isInWishlist = res.success
      console.log('checkwishlist',this.isInWishlist)

    })

  }
 
 
  addcart(productId: any) {  
    console.log(productId);
    
    this.userData = this.auth.userValue
   console.log(this.auth.isLoggedIn(), this.userData?.userId )
    if (this.auth.isLoggedIn()) {
      if (this.userData?.userId != null) {
        var value = {
          "userId": this.userData.userId,
          "products": {
            "productId": productId,
            "quantity": 1
          }
        };
        console.log(value);
        if (this.isInCart) {
          // Remove from wishlist
         // this.deleteWishlist(this.userData.userId ,productId);
        } else {
          // Add to wishlist
          this.addTocart(value);
        }
      
      }
    } else {
      // User is not logged in, navigate to the login page or show a message
      this.route.navigate(['/login']);
      // Or show a message
      // alert('You must be logged in to add items to the cart');
    }
  }
  addTocart(value:any){
    this.comApi.addtocart(value).subscribe((response: any) => {
      console.log("addcard",response);
      console.log('user',this.userData.userId)
      this.isInCart = true;
      this.comApi.getproducttocart(this.userData.userId).pipe(first())
      .subscribe({
        next: (res: any) => {
          this.cartcount = res.productCount;
          console.log('cartCount', this.cartcount);
        },
      });
    });
  }

  Wishlist(productId: any ,type:any) {
    console.log(productId ,type)
    this.userData = JSON.parse( sessionStorage.getItem('userData')!);
  
    if (this.auth.isLoggedIn()) {
      if (this.userData?.userId != null) {
        var value = {
          "userId": this.userData.userId,
          "List": {
            "productId": productId,
          }
        };
        console.log(value);
        if (this.isInWishlist) {
          // Remove from wishlist
          this.deleteWishlist(this.userData.userId ,productId);
        } else {
          // Add to wishlist
          this.addToWishlist(value);
        }
       
      }
    } 
    else {
      // User is not logged in, navigate to the login page or show a message
      this.route.navigate(['/login']);
      // Or show a message
      // alert('You must be logged in to add items to the wishlist');
    }
  }

  addToWishlist(value: any) {
    this.spinner.show()
    this.comApi.addtowishlist(value).subscribe((res: any) => {
      let wishlist = res;
      console.log('wishlist', wishlist);
      this.isInWishlist = true;
      this.comApi.getwishlist(this.userData.userId).pipe(first())
      .subscribe({
        next: (res: any) => {
          this.wishlistcount = res.ListCount;
          console.log('wishlistcount', this.wishlistcount);
        },
        complete: () => {
          // Hide spinner after deletion
          this.spinner.hide();
        },
        error: () => {
          // Hide spinner if there is an error
          this.spinner.hide();
        },
      });
    });
  }
  
  deleteWishlist(userId: any ,productId:any) {
    this.comApi.deleteWishlistprod(userId, productId)
      .pipe(first())
      .subscribe({
        next: (res: any) => {
          console.log('deleted', res);
        },
        complete: () => {
          // Hide spinner after deletion
          this.spinner.hide();
        },
        error: () => {
          // Hide spinner if there is an error
          this.spinner.hide();
        },
      });
  }
  ngOnDestroy(): void {
   
  this.userId =  null
  this.categorytdata =[]
  this.subcategorytdata =[]
  this.pushproductdata =[]
  this.getCategoryData =[]
  this.routeId =null
  this.item =null
  this.userData =[]
  this.getSearchData =[]
  this.cartcount =0;
  this.wishlistcount = 0;
  }
 
 
}

