import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-myorder',
  templateUrl: './myorder.component.html',
  styleUrls: ['./myorder.component.css']
})
export class MyorderComponent  implements OnInit{
  userId = this.auth.userValue.userId;
  imagePath = environment.baseUrl
  orderData:any;
  constructor(private comApi:CommonService ,private auth:AuthService){

  }

  ngOnInit() {
    this.comApi.getOrder(this.userId).subscribe((response:any)=>{
        this.orderData = response;
      
        console.log()

       
    })
  }

}
