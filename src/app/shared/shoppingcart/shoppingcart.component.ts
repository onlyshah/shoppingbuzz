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

export class ShoppingcartComponent  implements OnInit,OnDestroy ,AfterContentInit {
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
  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['categorytdata'] ||
      changes['subcategorytdata'] ||
      changes['pushproductdata'] ||
      changes['getallData'] ||
      changes['item']
    ) {
      this.addToItemData(
        this.categorytdata ||
        this.subcategorytdata ||
        this.getallData ||
        this.pushproductdata ||
        this.item
      );
    }
      // Log the updated itemData to ensure it is correct
     
  
   
    
  }
  private async addToItemData(input: any): Promise<void> {
    this.userData = JSON.parse(sessionStorage.getItem('userData')!); // Parse userData from sessionStorage
  
    if (input) {
      console.log("Updated input:", input);
      this.itemData.push(input);

      const productId = this.itemData.length > 0
        ? this.itemData[0]?._id || this.itemData[0]?.id :null// Handle array case

      const data = {
        userId: this.userData?.userId,
        productId: productId, // Assign extracted productId
      };
      try {
        const res: any = await this.comApi.checkWhislist(data).toPromise(); // Convert Observable to Promise
        this.isInWishlist = res.success;
        console.log('##', this.isInWishlist);
      } catch (error) {
        console.error('Error checking wishlist:', error);
      }
      
     
      
      let itemvalue:any  [] =[]
      if (Array.isArray(input)) {
        itemvalue = [...input]; // Only spread if input is an iterable
        console.log('...', itemvalue);
      }
      itemvalue.forEach(async (el:any) => {
        const productId = el?._id || el?.id; // Safely extract productId
         const data = {
        userId: this.userData?.userId,
         productId: productId, // Assign extracted productId
       };
       console.log("Prepared data:",data);
        try {
    const res: any = await this.comApi.checkWhislist(data).toPromise(); // Convert Observable to Promise
    this.isInWishlist = res.success;
    console.log('##', this.isInWishlist);
  } catch (error) {
    console.error('Error checking wishlist:', error);
  }
      });
       
      
    }
  }
  
 async ngAfterContentInit(): Promise<void> {
  
  // // this.itemData.push(this.item);
 

  // const data = {
  //   userId: this.userData?.userId,
  //   productId: this.itemData.length > 0 ? this.itemData[0]?._id : null, // Check for array length to avoid errors
  // };

  // console.log('data', data);

  // try {
  //   const res: any = await this.comApi.checkWhislist(data).toPromise(); // Convert Observable to Promise
  //   this.isInWishlist = res.success;
  //   console.log('##', this.isInWishlist);
  // } catch (error) {
  //   console.error('Error checking wishlist:', error);
  // }
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
        // if (this.isInWishlist) {
        //   // Remove from wishlist
        //   this.deleteWishlist(this.userData.userId ,productId);
        // } else {
        //   // Add to wishlist
        //   this.addToWishlist(value);
        // }
       
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
      //this.isInWishlist = true;
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
  this.getallData =[]
  this.routeId =null
  this.item =null
  this.userData =[]
  this.getSearchData =[]
  this.cartcount =0;
  this.wishlistcount = 0;
  }
 
 
}

