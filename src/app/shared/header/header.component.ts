import { AfterContentChecked, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { Location } from '@angular/common';
import { first, switchMap } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit{
  categoryData:any;
  subcategoryData:any;
  getcatname:any;
  compareCategory:any;
  @Input() cartCount: any;
  @Input() wishListCount: any;
  userData: any;
 
    
    


constructor(public router: Router ,private comApi:CommonService ,private auth:AuthService,
  ){
  
  }
  ngOnInit(): void {
    this.getallCatgoery();
    this.getCategory();
    this.getsubCategory();
    this.userData=(JSON.parse(localStorage.getItem('user')!))
    console.log(this.userData?.userId)
    this.userData = JSON.parse(localStorage.getItem('user')!);
    
    if (this.userData?.userId != null) {
      this.comApi.getproducttocart(this.userData.userId).pipe(first())
      .subscribe({
        next: (res: any) => {
          this.cartCount = res.productCount;
          console.log('cartCount',this.cartCount)
         // this.comApi.setCartCount(this.cartCount);
        },
      });
    }
    if (this.userData?.userId != null) {
      this.comApi.getwishlist(this.userData.userId).pipe(first())
      .subscribe({
        next: (res: any) => {
          this.wishListCount = res.ListCount;
          console.log('wishlistcount',this.wishListCount)
          //this.comApi.setwishlistCartCount(this.wishlistcount);
        },
      });
    }
   
    
    
  
   
    
    
  }
  getCategory(){
    this.comApi.getCatgeory().subscribe((response)=>{
      this.categoryData = response
      console.log("..category",this.categoryData)
    })
 }
 getsubCategory(){
  this.comApi.getsubCatgeory().subscribe((response)=>{
    this.subcategoryData = response
    console.log("subcategory",this.subcategoryData)
  })
}
  getallCatgoery(){
   this.comApi.getall().subscribe(
    (response)=>{
      this.compareCategory = response
      console.log("compareCategory",this.compareCategory)
    })

  }

}
