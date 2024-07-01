import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { ProductComponent } from './pages/product/product.component';
import { ShopcartdetailsComponent } from './pages/shopcartdetails/shopcartdetails.component';
import { MywishlistComponent } from './pages/mywishlist/mywishlist.component';
import { ShopCheckoutComponent } from './pages/shop-checkout/shop-checkout.component';
import { MyorderComponent } from './pages/myorder/myorder.component';


const routes: Routes = [
  {path:'' ,component:HomeComponent},
  {path:'login', component:LoginComponent},
  {path:'singup', component:LoginComponent},  
  {path:'product/:_id', component:ProductComponent},
  {path:'cart', component:ShopcartdetailsComponent},
  {path:'wishlist', component:MywishlistComponent},
  {path:'checkout/:userId', component:ShopCheckoutComponent},
  {path:'myorder',component:MyorderComponent}
  
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
