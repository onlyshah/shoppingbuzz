import { NgModule , CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { FormArray, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import {CarouselModule} from 'ngx-bootstrap/carousel'
import { ShoppingcartComponent } from './shared/shoppingcart/shoppingcart.component';
import { ProductComponent } from './pages/product/product.component';
import { ShopcartdetailsComponent } from './pages/shopcartdetails/shopcartdetails.component';
import { FiltersidebarComponent } from './shared/filtersidebar/filtersidebar.component';
import { MywishlistComponent } from './pages/mywishlist/mywishlist.component';
import { ShopCheckoutComponent } from './pages/shop-checkout/shop-checkout.component';
import { MyorderComponent } from './pages/myorder/myorder.component';
import { BsModalService, ModalModule } from 'ngx-bootstrap/modal';
import { AuthGuard } from './services/auth.guard';
import { AuthInterceptor } from './services/auth.interceptor';
import { ForgotPasswordComponent } from './shared/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './shared/reset-password/reset-password.component';
import { ToastrModule } from 'ngx-toastr';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { NgxSpinnerModule } from 'ngx-spinner';


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
    ForgotPasswordComponent,
    ResetPasswordComponent,
    
    
   
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    ModalModule,
    FormsModule,
    HttpClientModule,
    SlickCarouselModule,
    CarouselModule,
    ToastrModule.forRoot(),
    BrowserAnimationsModule,
    TooltipModule,
    TabsModule,
    NgxSpinnerModule 
    
    
    
  ],
  providers: [BsModalService,
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA], //
  bootstrap: [AppComponent],
  exports:[]
})
export class AppModule { }
