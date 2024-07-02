import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Injectable, Input, OnInit, Output, Renderer2, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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

export class ShoppingcartComponent  implements OnInit {
  imagePath = environment.baseUrl;
 userId = this.auth.userValue?.userId
  @Input() categorytdata:any
  @Input() subcategorytdata:any
  @Input() pushproductdata:any
  @Input() getCategoryData:any
  @Input() routeId:any
  @Input() item:any
  userData:any
  //@Input () dataitem :any
  cartcount: number;
  wishlistcount:number;
 
  
  constructor(private comApi:CommonService , private route: Router ,
     private router: ActivatedRoute ,
    public auth:AuthService,
    public guard:AuthGuard,
    private el: ElementRef, private renderer: Renderer2
    

  ) {
      //console.log('***',this.dataitem)
    
      

     }
  
  ngOnInit() {
    this.userData=(JSON.parse(localStorage.getItem('user')!))
    console.log('...', this.userData?.userId)
   
  
   
   
  }
  
 
 
  addcart(productId: any) {  
    console.log(productId);
    
    this.userData = JSON.parse(localStorage.getItem('user')!);
    
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
        
        this.comApi.addtocart(value).subscribe((response: any) => {
          console.log(response);
          
          this.comApi.getproducttocart(this.userData.userId).pipe(first())
          .subscribe({
            next: (res: any) => {
              this.cartcount = res.productCount;
              console.log('cartCount', this.cartcount);
            },
          });
        });
      }
    } else {
      // User is not logged in, navigate to the login page or show a message
      this.route.navigate(['/login']);
      // Or show a message
      // alert('You must be logged in to add items to the cart');
    }
  }
  
  Wishlist(productId: any) {
    this.userData = JSON.parse(localStorage.getItem('user')!);
  
    if (this.auth.isLoggedIn()) {
      if (this.userData?.userId != null) {
        var value = {
          "userId": this.userData.userId,
          "List": {
            "productId": productId,
          }
        };
        console.log(value);
  
        this.comApi.addtowishlist(value).subscribe((res: any) => {
          let wishlist = res;
          console.log('wishlist', wishlist);
          
          this.comApi.getwishlist(this.userData.userId).pipe(first())
          .subscribe({
            next: (res: any) => {
              this.wishlistcount = res.ListCount;
              console.log('wishlistcount', this.wishlistcount);
            },
          });
        });
      }
    } else {
      // User is not logged in, navigate to the login page or show a message
      this.route.navigate(['/login']);
      // Or show a message
      // alert('You must be logged in to add items to the wishlist');
    }
  }
  @HostListener('window:resize')
  onResize() {
    this.setResponsiveWidth();
  }

  @HostListener('window:load')
  onLoad() {
    this.setResponsiveWidth();
  }

  private setResponsiveWidth() {
    const width = window.innerWidth;
    if (width <= 768) { // Assuming 768px is the breakpoint for mobile
      this.renderer.setStyle(this.el.nativeElement, 'width', '100px'); // Adjust the width as needed
    } else {
      this.renderer.setStyle(this.el.nativeElement, 'width', '75px'); // Original width
    }
  }
}

