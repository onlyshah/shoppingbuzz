import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { FormArray, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {CarouselModule} from 'ngx-bootstrap/carousel'
import { ShoppingcartComponent } from './shared/shoppingcart/shoppingcart.component';
import { ProductComponent } from './pages/product/product.component';
import { ShopcartdetailsComponent } from './pages/shopcartdetails/shopcartdetails.component';
import { FiltersidebarComponent } from './shared/filtersidebar/filtersidebar.component';
import { MywishlistComponent } from './pages/mywishlist/mywishlist.component';
import { ShopCheckoutComponent } from './pages/shop-checkout/shop-checkout.component';
import { MyorderComponent } from './pages/myorder/myorder.component';
import { BsModalService, ModalModule } from 'ngx-bootstrap/modal';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    LoginComponent,
    ShoppingcartComponent,
    ProductComponent,
    ShopcartdetailsComponent,
    FiltersidebarComponent,
    MywishlistComponent,
    ShopCheckoutComponent,
    MyorderComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    ModalModule,
    FormsModule,
    HttpClientModule,
    SlickCarouselModule,
    CarouselModule
  ],
  providers: [BsModalService],
  bootstrap: [AppComponent]
})
export class AppModule { }
