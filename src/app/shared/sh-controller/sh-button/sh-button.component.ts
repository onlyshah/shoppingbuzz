import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AuthGuard } from 'src/app/services/auth.guard';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-sh-button',
  standalone: false,
  templateUrl: './sh-button.component.html',
  styleUrl: './sh-button.component.css'
})
export class ShButtonComponent implements OnInit {
  userData: any;
  @Input() isInWishlist :boolean
  constructor(
    private comApi:CommonService , private route: Router ,
         private router: ActivatedRoute ,
        public auth:AuthService,
        public guard:AuthGuard,
        private spinner: NgxSpinnerService,
        private toster : ToastrService
  ){
    
  }
 ngOnInit(): void {
  this.userData = JSON.parse( sessionStorage.getItem('userData')!);
 }
 Wishlist(type:any) {
  console.log("productId ,type"  , this.userData.userId ,this.isInWishlist)
  this.userData = JSON.parse( sessionStorage.getItem('userData')!);

  if (this.auth.isLoggedIn()) {
    if (this.userData?.userId != null) {
      // var value = {
      //   "userId": this.userData.userId,
      //   "List": {
      //     "productId": productId,
      //   }
      // };
      //console.log(value);
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

}
