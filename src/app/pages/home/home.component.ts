import { AfterViewInit, Component, OnInit  } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  
})
export class HomeComponent implements OnInit{
  constructor(private comApi:CommonService , private router: Router,) { }

  ngOnInit(): void {
    this.getcompareCategory();
    this.getcarouselData();
    this.getCardcarouselData()
   
      }
  categoryData:any;
  getcatname:any;
  compareCategory:any;
  wishData:any;
  userId:any;
  tDeal:any = [];
  bSelling:any = [];
  featuredData:any = [];
  getcarouselvalue:any;
  cardcarouselData:any;
  dataitem:  [
    {
      category: 'dairyfood',
      icon: '  <i class="bi bi-stack"></i>'   },
   
    // Add more items as needed
  ];
  imagePath = environment.baseUrl;
  slideConfig = { slidesToShow:4, slidesToScroll: 1, infinite: false, autoplay: true, 
    dots: true,
    arrows: true
  };
  bestselling = { slidesToShow:4, slidesToScroll: 1, infinite: false, autoplay: true, 
    dots: false,
    arrows: true
  };
  getcarouselData(){
    this.comApi.getcarousel().subscribe((response:any)=>{
      this.getcarouselvalue = response.map((item:any) => ({
        ...item,
        decodedBanner: decodeURIComponent(item.banner).replace(/º/g, '/').replace(/\\/g, '/')
        
      }));
      console.log('cardcarousel',this.getcarouselvalue)
      console.log('imgpath'  ,this.imagePath+this.getcarouselvalue[0]?.banner)
     
      
    })
  }
  getCardcarouselData(){
    this.comApi.getCardcarousel().subscribe((response:any)=>{
      this.cardcarouselData = response
      .map((item:any) => ({
        ...item,
        decodedBanner: decodeURIComponent(item.backgroundImg).replace(/º/g, '/').replace(/\\/g, '/')
        
      }));
      console.log('Cardcarousel',this.cardcarouselData)
      console.log('imgpath'  ,this.imagePath+this.cardcarouselData[0]?.backgroundImg)
     
      
    })
  }
  getcompareCategory(){
    this.comApi.getall().subscribe((response:any)=>{
    this.compareCategory =response.product;
    this.compareCategory.forEach((element:any) => {
      if(element.displaycategory === 'Todaysdeals'
      ){
        this.tDeal.push(element)
        console.log('Todaysdeals', element)

        
      }
    });
    this.compareCategory.forEach((element:any) => {
      if(element.displaycategory === 'BestSelling'
      ){
        this.bSelling.push(element)
        console.log('BestSelling', element)
      }
    });
    this.compareCategory.forEach((element:any) => {
      if(element.displaycategory === 'Featuredproduct'
      ){
        this.featuredData.push(element)
        console.log('Featuredproduct', element)
      

      }
      
    });
   })
}
}
