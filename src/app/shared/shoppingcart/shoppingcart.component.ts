import { AfterContentChecked, AfterContentInit, AfterViewInit, Component, DoCheck, ElementRef, EventEmitter, HostListener, Injectable, Input, OnChanges, OnDestroy, OnInit, Output, Renderer2, SimpleChanges, inject, input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { values } from 'lodash';
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

export class ShoppingcartComponent  implements OnInit,OnDestroy {
  imagePath = environment.baseUrl;
 userId = this.auth.userValue?.userId
  @Input() categorytdata:any
  @Input() subcategorytdata:any
  @Input() pushproductdata:any
  @Input() getallData:any
  @Input() routeId:any
  @Input() item:any
  userData:any
  @Input() getSearchData:any
  cartcount: number;
  wishlistcount:number;
  itemData:any =[]
  isInWishlist:boolean
  isInCart:any
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
    console.log('...', this.userData?.userId ,this.item,this.categorytdata)
  
   
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
        // if (this.isInCart) {
        //   // Remove from wishlist
        //  // this.deleteWishlist(this.userData.userId ,productId);
        // } else {
        //   // Add to wishlist
        //   this.addTocart(value);
        // }
      
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
      //this.isInCart = true;
      this.comApi.getproducttocart(this.userData.userId).pipe(first())
      .subscribe({
        next: (res: any) => {
          this.cartcount = res.productCount;
          console.log('cartCount', this.cartcount);
        },
      });
    });
  }

  
  ngOnDestroy(): void {
   
  this.userId =  null
  this.categorytdata =[]
  this.subcategorytdata =[]
  this.pushproductdata =[]
  this.getallData =[]
  this.routeId =null
  this.item =null
  this.userData =[]
  this.getSearchData =[]
  this.cartcount =0;
  this.wishlistcount = 0;
  }
 
 
}

