import { Component, OnInit } from '@angular/core';
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
  private cart:ShoppingcartComponent){

 }
  ngOnInit() {
    console.log(this.userId)
   this.comApi.getwishlist(this.userId).subscribe((res:any)=>{
    this.wishlist = res.List;
    console.log('wishlist',this.wishlist)
   })
  }

  addtocart(productId:any){
    this.cart.addtocartbyWishList(productId ,this.userId)
  }
  deleteWishlist(productId:any){
      let  data ={
        "productId":productId,
       }
    this.comApi.deleteWishlistprod(productId ,data).subscribe((res:any)=>{
      console.log('product delete from wishlist',res)
    })
  }
}
