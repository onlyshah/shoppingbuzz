import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';
import { environment } from 'src/environments/environment';
import { filter } from 'rxjs';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  userId: any;
  updateprices: any;
  imagePath = environment.baseUrl;
  productList: any;
  searchStatus: boolean;
 
  constructor(private router: ActivatedRoute, private comApi:CommonService ,private route:Router) { 
   
  }
  id:any;
  getproductData:any;
  //imagePath = environment.baseUrl;
  getCategoryData:any;
  pushcategoryData:any =[];
  category:any;
  pushproductdata:any = [];
  pushsubcategoryData:any =[];
  
  ngOnInit(): void {
    this.getalldetail();
    this.router.params.subscribe((response:any)=>{
      this.id = ""+response?._id;
      console.log(this.id)
    })
    //this.userId =localStorage.getItem('userId');
    //userId = this.auth.userValue.userId
    //this.getcat()
    
   
  
  }

   getalldetail(){
    this.router.params.subscribe((response:any)=>{
      this.id = ""+response?._id;
     // console.log('catId',response?._id);
      this.comApi.getall().subscribe((response:any)=>{
         this.getCategoryData = response.product;
         console.log('alldata',this.getCategoryData)
       this.pushcategoryData =  this.getCategoryData.filter((id:any) => id.CategoryId._id === this.id)
        console.log('pushcategoryData',this.pushcategoryData)
        this.pushsubcategoryData =  this.getCategoryData.filter((id:any) => id.SubCategoryId._id === this.id)
        console.log('pushsubcategoryData',this.pushsubcategoryData)
        this.pushproductdata =  this.getCategoryData.filter((id:any) => id._id === this.id)
         console.log('pushproductdata',this.pushproductdata )
        
        

        
         
    })

    })

 }
 getsreachData(){
  this.comApi.SearchData('red').subscribe(response => {
    this.searchStatus = true;
    this.productList = response.map((product: any) => ({
      productId: product._id,
      productName: product.productname,
      price: product.price,
      categoryName: product.CategoryId.categoryname,
      categoryDiscount: product.CategoryId.categorydiscount,
      subcategoryName: product.SubCategoryId.subcategoryname,
      productImage: product.productImage,
      productDescription: product.productdescription,
      displayCategory: product.displaycategory,
      brand: product.brand,
      features: this.parseFeatures(product.features),
      createdAt: product.createdAt,
      updatedAt: product.updatedAt
    }));
    console.log('searchData', this.productList);

    this.getCategoryData = this.productList;
    console.log('alldata', this.getCategoryData);

    this.pushcategoryData = this.getCategoryData.filter((item: any) => item.categoryName._id === this.id);
    console.log('pushcategoryData', this.pushcategoryData);

    this.pushsubcategoryData = this.getCategoryData.filter((item: any) => item.subcategoryName._id === this.id);
    console.log('pushsubcategoryData', this.pushsubcategoryData);

    this.pushproductdata = this.getCategoryData.filter((item: any) => item.productId === this.id);
    console.log('pushproductdata', this.pushproductdata);
  });
}

private parseFeatures(features: string): any {
  let parsedFeatures = {};
  try {
    const featuresString = features
      .replace(/\n/g, ',')
      .replace(/(\w+)\s*:\s*/g, '"$1":"')
      .replace(/,(\w+)\s*:\s*/g, '","$1":"')
      .replace(/([a-zA-Z0-9]+)"/g, '$1"')
      .replace(/"/g, '","')
      .replace(/,,/g, ',')
      .replace(/,$/, '');

    parsedFeatures = JSON.parse(`{${featuresString}}`);
  } catch (error) {
    console.error('Error parsing features JSON:', error);
  }
  return parsedFeatures;
}
}
 



