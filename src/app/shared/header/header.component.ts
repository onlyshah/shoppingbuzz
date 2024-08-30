import { AfterContentChecked, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { first, switchMap } from 'rxjs';
import { CommonService } from 'src/app/services/common.service';
declare var $: any;


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
    this.userData =this.auth.userValue;
 
    console.log("header",this.userData?.firstName)
   // this.userData = JSON.parse( sessionStorage.getItem('user')!);
    
    if (this.userData?.userId != null) {
      this.comApi.getproducttocart(this.userData.userId).pipe(first())
      .subscribe({
        next: (res: any) => {
          this.cartCount = res.productCount;
          console.log('cartCount',this.cartCount)
          this.comApi.setCardCount(this.cartCount);
        },
      });
    }
    if (this.userData?.userId != null) {
      this.comApi.getwishlist(this.userData.userId).pipe(first())
      .subscribe({
        next: (res: any) => {
          this.wishListCount = res.ListCount;
          console.log('wishlistcount',this.wishListCount)
          this.comApi.setWishlistCount(this.wishListCount);
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
  searchProduct(searchValue: any) {
    const minLength = 5;  // Define minimum length
    const maxLength = 50; // Define maximum length
  
    // Check if the search value length is within the allowed range
    if (searchValue.length >= minLength && searchValue.length <= maxLength) {
      console.log(searchValue);
  
      this.comApi.SearchData(searchValue).pipe(first())
        .subscribe({
          next: (res: any) => {
            let data = res;
            console.log('searchValue', res);
            this.comApi.updateSearchResults(data);
            
            // Dismiss the offcanvas
            const offcanvasElement = document.getElementById('navbar-default'); // Make sure your offcanvas has this ID
            if (offcanvasElement) {
              offcanvasElement.classList.remove('show'); // Hide the offcanvas
              document.body.classList.remove('offcanvas-open'); // Remove the backdrop
            }
  
            // Navigate to the product page
            this.router.navigateByUrl('product');
          },
        });
    } else {
      console.log(`Search value must be between ${minLength} and ${maxLength} characters.`);
      // Optionally, display an error message to the user here
    }
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

