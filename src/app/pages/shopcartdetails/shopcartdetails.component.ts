import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { first ,Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { ShoppingcartComponent } from 'src/app/shared/shoppingcart/shoppingcart.component';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-shopcartdetails',
  templateUrl: './shopcartdetails.component.html',
  styleUrls: ['./shopcartdetails.component.css']
})
export class ShopcartdetailsComponent  implements OnInit{
  data:any =[];
  show = false;
  imagePath = environment.baseUrl;
  updateprices:any;
  userId = this.auth.userValue.userId
  productquantity:any
  upprice:any;
  downprice:any;
  quantityplus:any;
  quantityminus:any;
  mySubscription:Subscription
 constructor(private comApi:CommonService ,private auth:AuthService,
  private route: Router , private router: ActivatedRoute ,
) {
  this.route.routeReuseStrategy.shouldReuseRoute = function () {
    return false;
  };
  
  this.mySubscription = this.route.events.subscribe((event) => {
    if (event instanceof NavigationEnd) {
      // Trick the Router into believing it's last link wasn't previously loaded
      this.route.navigated = false;
    }
  });
 
  }

  ngOnInit(): void {
   this.comApi.getproducttocart(this.userId).subscribe((response:any)=>{
    this.data = response.products    ;
    console.log('data',this.data)
    this.updateprices =0;
    this.data.forEach((el:any) => {
      this.productquantity = el.quantity
      this.updateprices +=el.quantity*el.productId.price
      //console.log(this.updateprices)
    });
   
   

    
   })
  
  }
 
  quantity(value:any ,index:any ,productId:any ,proid:any){
    if(value == 'max'){
    this.data[index].quantity =this.data[index].quantity+1
    this.quantityplus = this.data[index].quantity
    console.log('id',proid ,this.userId , this.data[index].quantity)
    let data = {
        "userId": this.userId,
        "products": {
        "productId": proid,
        "quantity": this.quantityplus
    }
    
    }
    this.comApi.onUpdatecart(data).subscribe((res:any)=>{
      let data = res
      console.log('cart update',data)
    })
    }
    else if(value == 'min'){
      this.data[index].quantity =this.data[index].quantity-1
      this.quantityminus = this.data[index].quantity  
      let data = {
        "userId": this.userId,
        "products": {
        "productId": proid,
        "quantity": this.quantityminus
    }
    
    }
    this.comApi.onUpdatecart(data).subscribe((res:any)=>{
      let data = res
      console.log('cart update',data)
    })
    }
    this.doTotalPrice(index ,value)
  }
  doTotalPrice(index:any ,value:any) {
    if(value == 'max'){
      this.updateprices +=this.data[index].productId.price
      console.log(this.data[index].quantity*this.data[index].productId.price)
      this.upprice = this.updateprices
      }
      else if(value == 'min'){
        this.updateprices -=this.data[index].productId.price
        console.log(this.data[index].quantity*this.data[index].productId.price)
        this.downprice = this.updateprices
      }
      this.onUpdadte(value)
  
  }
  onUpdadte(value:any){}

  // from  cart to wishlist
  movetoWishList(productId:any){
    var value= {
      "userId":this.userId,
      "List":{
        "productId":productId,
        
        
      }
    }
    // console.log(value)
    this.comApi.addtowishlist(value).subscribe((res:any)=>{
      let wishlist = res;
      console.log('wishlist',wishlist)
    })
    this.deletecartItem(productId)

  }
  deletecartItem(productId:any){
    console.log('delete',productId ,this.userId) 
    this.comApi.deletecartItem(this.userId,productId).pipe(first())
    .subscribe({
      next: (res: any) => {
         console.log('deleted',res)
      },
    });

  }
   
  
  
 

  
}
