import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';


@Component({
  selector: 'app-filtersidebar',
  templateUrl: './filtersidebar.component.html',
  styleUrls: ['./filtersidebar.component.css']
})
export class FiltersidebarComponent implements OnInit {
   // @Input() categorytdata:any =[];
 categorytdata :any
 data:any =[];
 unique:any;
 index=0
  constructor(private router: ActivatedRoute, private comApi:CommonService ,private route:Router){ }
 ngOnInit() { 
  this.getalldetail()
 
 }
 getalldetail(){

    this.comApi.getall().subscribe((response:any)=>{
       this.categorytdata = response.product;
       console.log('alldata',this.categorytdata)   
       const expected = new Set();
       this.unique = this.categorytdata.filter((item:any) => !expected.has(JSON.stringify(item.SubCategoryId)) ? expected.add(JSON.stringify(item.SubCategoryId)) : false);
       console.log('features',this.unique) 
       this.categorytdata.forEach((el:any) => {
        this.data.push(el.features);
       });
       
     
        
       
       
      
      
      
      
      
  })
  





}



 
 
}
