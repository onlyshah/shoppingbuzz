import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { first } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { ShoppingcartComponent } from 'src/app/shared/shoppingcart/shoppingcart.component';
import { environment } from 'src/environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-mywishlist',
  templateUrl: './mywishlist.component.html',
  styleUrls: ['./mywishlist.component.css']
})
export class MywishlistComponent  implements OnInit ,OnDestroy{
  userId = this.auth.userValue.userId
  wishlist:any;
  imagePath = environment.baseUrl;
  status: any;
 constructor(private comApi:CommonService ,private auth:AuthService,
  private cart:ShoppingcartComponent , private router: Router,
  private spinner: NgxSpinnerService,
  private toster : ToastrService
){

 }
  ngOnInit() {
    console.log(this.userId)
    this.spinner.show();

    this.comApi.getwishlist(this.userId).subscribe(
      (res: any) => {
        this.wishlist = res.List;
        console.log('wishlist', this.wishlist);
      },
      (error) => {
        this.status = error.status
      if(error.status === 404){
       this.toster.error(error.error.message)
      }
      //console.error(error.status);
      this.spinner.hide(); //
      },
      () => {
        // Hide spinner after data is loaded
        this.spinner.hide();
      }
    );
  }

  addtocart(productId: any) {
    const value = {
      userId: this.userId,
      products: {
        productId: productId,
        quantity: 1,
      },
    };

    // Show spinner during the add to cart process
    this.spinner.show();

    this.comApi.addtocart(value).subscribe(
      (response: any) => {
        console.log(response);
        this.deleteWishlist(productId);
      },
      () => {
        // Hide spinner in case of error
        this.spinner.hide();
      },
      () => {
        // Hide spinner after adding to cart
        this.spinner.hide();
      }
    );
  }

  deleteWishlist(productId: any) {
    this.comApi.deleteWishlistprod(this.userId, productId)
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
   this.wishlist = []
   this.userId = null
   this.status = null

  }
}
