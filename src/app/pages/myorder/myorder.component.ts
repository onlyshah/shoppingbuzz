import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-myorder',
  templateUrl: './myorder.component.html',
  styleUrls: ['./myorder.component.css']
})
export class MyorderComponent  implements OnInit{
  userId = this.auth.userValue.userId;
  orderData:any;
  constructor(private comApi:CommonService ,private auth:AuthService){

  }

  ngOnInit() {
    this.comApi.getOrder(this.userId).subscribe((response:any)=>{
        this.orderData = response;
        console.log('orderData',this.orderData)
       for(let i=0; i <= this.orderData.length; i++){
         console.log(this.orderData.products[i].products[i])
       }
       
    })
  }

}
