import { AfterViewInit, Component, EventEmitter, Injectable, Input, OnInit, Output, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs';
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
 // userId = this.auth.userValue.userId
  @Input() categorytdata:any
  @Input() subcategorytdata:any
  @Input() pushproductdata:any
  @Input() getCategoryData:any
  @Input() routeId:any
  @Input() item:any
  userData:any
  cartcount: number;
  wishlistcount:number;
  
  constructor(private comApi:CommonService , private route: Router , private router: ActivatedRoute ,
    public auth:AuthService) {
  
      

     }
  
  ngOnInit() {
    this.userData=(JSON.parse(localStorage.getItem('user')!))
    console.log('...', this.userData?.userId)
   
    console.log('***',this.pushproductdata)
    
   
   
  }
  
  // addItem(event:any){
  //   console.log('id',event);
  //   this.categorytdata =  this.categorytdata.filter(
  //     (id:any) => id.SubCategoryId._id === event 
     
  //    )
  //    this.categorytdata =  this.categorytdata.filter(
  //     (id:any) =>  id.features[0].ram === event
  //    )
     
  // }
  addtocartbyWishList(productId :any ,userId:any)
  {
    var data ={
      "userId":userId,
      "products":{
      "productId":productId,
      "quantity":1
      
    }
    }
    console.log(data)
    this.comApi.addtocart(data).subscribe((response:any)=>{
      console.log(response);
    
    })

  
  }
  addcart(productId:any){  
    console.log(productId)
    console.log(this.userData?.userId)
  var value= {
    "userId":this.userData?.userId,
    "products":{
      "productId":productId,
      "quantity":1
      
    }
    
  }
  console.log(value)
  // debugger
   this.comApi.addtocart(value).subscribe((response:any)=>{
      console.log(response);
    
    })
    this.userData = JSON.parse(localStorage.getItem('user')!);
    
    if (this.userData?.userId != null) {
      this.comApi.getproducttocart(this.userData.userId).pipe(first())
      .subscribe({
        next: (res: any) => {
          this.cartcount = res.productCount;
          console.log('cartCount',this.cartcount)
          //this.comApi.setCartCount(this.cartcount);
        },
      });
    }
  
}
  Wishlist(productId:any){
    var value= {
      "userId":this.userData?.userId,
      "List":{
        "productId":productId,
        
        
      }
    }
    // console.log(value)
    this.comApi.addtowishlist(value).subscribe((res:any)=>{
      let wishlist = res;
      console.log('wishlist',wishlist)
    })
    this.userData = JSON.parse(localStorage.getItem('user')!);
    
    if (this.userData?.userId != null) {
      this.comApi.getwishlist(this.userData.userId).pipe(first())
      .subscribe({
        next: (res: any) => {
          this.wishlistcount = res.ListCount;
          console.log('wishlistcount',this.wishlistcount)
        },
      });
    }
  }
  
}
