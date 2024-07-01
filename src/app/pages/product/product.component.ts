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
    this.getcat()
    
   
  
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
 getcat(){
  
  //return this.getCategoryData.filter((id:any) => id.CategoryId === this.id);

 }


}
