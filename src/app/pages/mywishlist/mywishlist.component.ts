import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { first } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { ShoppingcartComponent } from 'src/app/shared/shoppingcart/shoppingcart.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-mywishlist',
  templateUrl: './mywishlist.component.html',
  styleUrls: ['./mywishlist.component.css']
})
export class MywishlistComponent  implements OnInit{
  userId = this.auth.userValue.userId
  wishlist:any;
  imagePath = environment.baseUrl;
 constructor(private comApi:CommonService ,private auth:AuthService,
  private cart:ShoppingcartComponent , private router: Router){

 }
  ngOnInit() {
    console.log(this.userId)
   this.comApi.getwishlist(this.userId).subscribe((res:any)=>{
    this.wishlist = res.List;
    console.log('wishlist',this.wishlist)
   })
  }

  addtocart(productId:any){
    var value= {
      "userId":this.userId,
      "products":{
        "productId":productId,
        "quantity":1
        
      }
      
    }
    this.comApi.addtocart(value).subscribe((response:any)=>{
      console.log(response);
    
    })
    this.deleteWishlist(productId)
   //this.router.navigateByUrl('/cart')
    
  }
  deleteWishlist(productId:any){
    this.comApi.deleteWishlistprod(this.userId,productId).pipe(first())
    .subscribe({
      next: (res: any) => {
         console.log('deleted',res)
      },
    });
  }
}
