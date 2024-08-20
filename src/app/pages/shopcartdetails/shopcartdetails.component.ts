import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
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
  status:any
 constructor(private comApi:CommonService ,private auth:AuthService,
  private route: Router , private router: ActivatedRoute ,
  private spinner: NgxSpinnerService, // Inject the spinner service
  private toster : ToastrService
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
    this.spinner.show(); // Show spinner when data fetching starts
    this.comApi.getproducttocart(this.userId).subscribe((response: any) => {
      this.data = response.products;
      console.log('data', this.data);
      this.updateprices = 0;
      this.data.forEach((el: any) => {
        this.productquantity = el.quantity;
        this.updateprices += el.quantity * el.productId.price;
        // console.log(this.updateprices)
      });
      this.spinner.hide(); // Hide spinner when data fetching completes
    }, (error) => {
      this.status = error.status
      if(error.status === 404){
       this.toster.error(error.error.message)
      }
     // console.error(error.status);
      this.spinner.hide(); // Hide spinner if there's an error
    });
  }
 
  quantity(value: any, index: any, productId: any, proid: any) {
    this.spinner.show(); // Show spinner when updating cart
    if (value === 'max') {
      this.data[index].quantity += 1;
      this.quantityplus = this.data[index].quantity;
      console.log('id', proid, this.userId, this.data[index].quantity);
      let data = {
        "userId": this.userId,
        "products": {
          "productId": proid,
          "quantity": this.quantityplus
        }
      };
      this.comApi.onUpdatecart(data).subscribe((res: any) => {
        let data = res;
        console.log('cart update', data);
        this.spinner.hide(); // Hide spinner after update
      }, (error) => {
        console.error('Error updating cart:', error);
        this.spinner.hide(); // Hide spinner if there's an error
      });
    } else if (value === 'min') {
      this.data[index].quantity -= 1;
      this.quantityminus = this.data[index].quantity;
      let data = {
        "userId": this.userId,
        "products": {
          "productId": proid,
          "quantity": this.quantityminus
        }
      };
      this.comApi.onUpdatecart(data).subscribe((res: any) => {
        let data = res;
        console.log('cart update', data);
        this.spinner.hide(); // Hide spinner after update
      }, (error) => {
        console.error('Error updating cart:', error);
        this.spinner.hide(); // Hide spinner if there's an error
      });
    }
    this.doTotalPrice(index, value);
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
   
  movetoWishList(productId: any) {
    this.spinner.show(); // Show spinner when moving to wishlist
    var value = {
      "userId": this.userId,
      "List": {
        "productId": productId,
      }
    };
    this.comApi.addtowishlist(value).subscribe((res: any) => {
      let wishlist = res;
      console.log('wishlist', wishlist);
      this.spinner.hide(); // Hide spinner after adding to wishlist
    },(error) => {
        this.status = error.status
        if(error.status === 404){
         this.toster.error(error.error.message)
        }
      this.spinner.hide(); // Hide spinner if there's an error
    });
    this.deletecartItem(productId);
  }
  
  deletecartItem(productId: any) {
    console.log('delete', productId, this.userId);
    this.spinner.show(); // Show spinner when deleting cart item
    this.comApi.deletecartItem(this.userId, productId).pipe(first())
      .subscribe({
        next: (res: any) => {
          console.log('deleted', res);
          this.spinner.hide(); // Hide spinner after deletion
        },
        error: (error) => {
          console.error('Error deleting cart item:', error);
          this.spinner.hide(); // Hide spinner if there's an error
        }
      });
  }
   
  
  
 

  
}
