import { Component, OnDestroy, OnInit } from '@angular/core'
import { ActivatedRoute, Route, Router } from '@angular/router'
import { NgxSpinnerService } from 'ngx-spinner'
import { first } from 'rxjs'
import { CommonService } from 'src/app/services/common.service'
import { environment } from 'src/environments/environment'

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit ,OnDestroy {
  userId: any
  updateprices: any
  imagePath = environment.baseUrl
  productList: any
  searchData:any
  userData: any
  

  constructor (
    private router: ActivatedRoute,
    private comApi: CommonService,
    private route: Router,
    private spinner: NgxSpinnerService // 
  ) {
    this.comApi.searchData$.subscribe(results => {
      this.searchData = results;
      console.log("searchData",this.searchData);
    })
  
  }
  id: any
  getproductData: any
  //imagePath = environment.baseUrl;
  getallData: any
  pushcategoryData: any = []
  category: any
  pushproductdata: any = []
  pushsubcategoryData: any = []
  ngOnInit (): void {
    this.spinner.show();
    this.getalldetail()
    this.router.params.subscribe((response: any) => {
      this.id = '' + response?._id
      console.log(this.id)
    })
 }
 
  getalldetail () {
    this.router.params.subscribe((response: any) => {
      this.id = '' + response?._id
      // console.log('catId',response?._id);
      this.comApi.getall().subscribe((response: any) => {
        this.getallData = response.product
        console.log('alldata', this.getallData)
        this.pushcategoryData = this.getallData.filter(
          (id: any) => id.CategoryId._id === this.id
          
          
        )
        console.log('pushcategoryData', this.pushcategoryData)
        this.pushsubcategoryData = this.getallData.filter(
          (id: any) => id.SubCategoryId._id === this.id
        )
        console.log('pushsubcategoryData', this.pushsubcategoryData)
        this.pushproductdata = this.getallData.filter(
          (id: any) => id._id === this.id
        )
        console.log('pushproductdata', this.pushproductdata)
        this.spinner.hide();
      },
      (error) => {
        console.error('Error fetching data:', error);
        this.spinner.hide(); // Hide the spinner if there is an error
      }
    )
    })
  }
  ngOnDestroy(): void {
    this.userId = null
    this.updateprices = null
    this.productList = []
    this.searchData =[]
    this.id = null
   this.getproductData =[]
  this.getallData =[]
  this.pushcategoryData = []
  this.category = null
  this.pushproductdata = []
  }
}

