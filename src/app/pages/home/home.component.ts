import { AfterViewInit, Component, ElementRef, OnInit, ViewChild  } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonService } from 'src/app/services/common.service';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  
})
export class HomeComponent implements OnInit {
  @ViewChild('swiper') swiperRef: ElementRef | undefined;
  categoryData: any;
  getcatname: any;
  compareCategory: any;
  wishData: any;
  userId: any;
  tDeal: any = [];
  bSelling: any = [];
  featuredData: any = [];
  getcarouselvalue: any;
  cardcarouselData: any = [];
  imagePath = environment.baseUrl;
  slideConfig = {
    slidesToShow: 4,
    slidesToScroll: 1,
    infinite: false,
    autoplay: true,
    dots: true,
    arrows: true
  };
  bestselling = {
    slidesToShow: 4,
    slidesToScroll: 1,
    dots: false,
    infinite: true,
    arrows: true,
    autoplay: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  constructor(
    private comApi: CommonService,
    private router: Router,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.spinner.show();
    this.getcompareCategory();
    this.getcarouselData();
    this.getCardcarouselData();
  }

  getcarouselData() {
    this.comApi.getcarousel().subscribe((response: any) => {
      this.getcarouselvalue = response.map((item: any) => ({
        ...item,
        decodedBanner: decodeURIComponent(item.banner).replace(/º/g, '/').replace(/\\/g, '/')
      }));
      console.log('cardcarousel', this.getcarouselvalue);
      console.log('imgpath', this.imagePath + this.getcarouselvalue[0]?.banner);
      this.spinner.hide();
    }, () => {
      this.spinner.hide();
    });
  }

  getCardcarouselData() {
    this.comApi.getCardcarousel().subscribe((response: any) => {
      this.cardcarouselData = response.map((item: any) => ({
        ...item,
        decodedBanner: decodeURIComponent(item.backgroundImg).replace(/º/g, '/').replace(/\\/g, '/')
      }));
      console.log('Cardcarousel', this.cardcarouselData);
      console.log('imgpath', this.imagePath + this.cardcarouselData[0]?.backgroundImg);
      this.spinner.hide();
    }, () => {
      this.spinner.hide();
    });
  }

  getcompareCategory() {
    this.comApi.getall().subscribe((response: any) => {
      this.compareCategory = response.product;
      console.log('compareCategory', this.compareCategory);
      this.compareCategory.forEach((element: any) => {
        if (element.displaycategory === 'Todaysdeals') {
          this.tDeal.push(element);
          console.log('Todaysdeals', element);
        }
      });
      this.compareCategory.forEach((element: any) => {
        if (element.displaycategory === 'BestSelling') {
          this.bSelling.push(element);
          console.log('BestSelling', element);
        }
      });
      this.compareCategory.forEach((element: any) => {
        if (element.displaycategory === 'Featuredproduct') {
          this.featuredData.push(element);
          console.log('Featuredproduct', element);
        }
      });
      this.spinner.hide();
    }, () => {
      this.spinner.hide();
    });
  }

itemsPerSlideOneOnMobile(): number {
  // Adjust this logic based on your desired screen size breakpoints
  if (window.innerWidth <= 576) { // Example breakpoint for mobile screens
    return 1; // Show 1 item per slide on mobile
  } else {
    return 2; // Show 2 items per slide on larger screens
  }

}
itemsPerSlidetwoOnMobile(): number {
  // Adjust this logic based on your desired screen size breakpoints
  if (window.innerWidth <= 576) { // Example breakpoint for mobile screens
    return 1; // Show 1 item per slide on mobile
  } else {
    return 3; // Show 2 items per slide on larger screens
  }

}
}
