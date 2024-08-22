import { AfterContentChecked, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { first, switchMap } from 'rxjs';
import { CommonService } from 'src/app/services/common.service';
import { debounce } from 'lodash';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit ,OnDestroy{

  categoryData:any;
  subcategoryData:any;
  getcatname:any;
  compareCategory:any;
  @Input() cartCount: any;
  @Input() wishListCount: any;
  userData: any;
  searchStatus: boolean;
  productList: any;
  searchValue:any;
  debouncedSearch: any;
 
    
    


constructor(public router: Router ,private comApi:CommonService ,public auth:AuthService,
  ){
   // this.debouncedSearch = debounce(this.searchProduct, 300);
  }
  ngOnInit(): void {
    this.getallCatgoery();
    this.getCategory();
    this.getsubCategory();
    this.userData=this.auth.userValue
    console.log("header",this.userData)
   // this.userData = JSON.parse( sessionStorage.getItem('user')!);
    
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
  searchProduct(searchValue:any){
    console.log(searchValue)
  //  this.debouncedSearch(searchValue);
    this.comApi.SearchData(searchValue).pipe(first())
    .subscribe({
      next: (res: any) => {
        let data = res
        console.log('searchValue',res)
        this.comApi.updateSearchResults(data);
        this.router.navigateByUrl('product')
      },
    });

  }
  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }
  navigateTowishLlist(): void {
    this.router.navigate(['/wishlist']);
  }
  navigateTocart(): void {
    this.router.navigate(['/cart']);
  }
  navigateTomyOrder() {
    this.router.navigate(['/myorder']);
    }
    ngOnDestroy(): void {
      this.wishListCount = null
      this.cartCount = null,
      this.categoryData =null
      this.subcategoryData =null;
      this.getcatname = null;
      this.compareCategory =null;
      this.userData = null;
      this.searchStatus= false;
      this.productList = null;
      this.searchValue =null;
      this.debouncedSearch =null;
    
     }
    
}

