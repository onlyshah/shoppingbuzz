import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { first } from 'rxjs';
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
  modalRef?: BsModalRef;
  message?: string;
  msg:any
  modalData:any=[]
  data:any;
  type:any
  constructor(private comApi:CommonService ,private auth:AuthService,
    private modalService: BsModalService
  ){

  }

  ngOnInit() {
    this.comApi.getOrder(this.userId).subscribe((response:any)=>{
        this.orderData = response;
        console.log("getorder",this.orderData)
        this.orderData = response.filter((order: any) => !order.cancel);
        console.log("Filtered Orders:", this.orderData);
        console.log(this.orderData[0].status[0].return)
      

       
    })
  }
   
  openModal(template: TemplateRef<void>, orderId: any, type: any) {
    // Clear previous modal data
    this.modalData = null;
    this.type = null;

    // Open modal with new template
    this.modalRef = this.modalService.show(template, { class: 'modal-xl' });

    // Set modal data with new order data
    this.modalData = this.orderData.find((order: any) => order.id === orderId);
    console.log('modal', this.modalData, type);

    // Set the new type
    this.type = type;
}

  cancel_return(orderId:BigInteger){
   let orderid:any = orderId
   console.log('orderId', orderid)
  //  let userId:BigInteger = this.modalData[0].userId
  //  let products= this.modalData[0].products
   if( this.type === 'Cancel'){
    this.data ={
      // userId:userId,
      // products:products,
      cancel:true,
      return:false,
      received:false,
      message: this.msg
     }
     console.log('data',this.data)
     this.comApi.updateOrderStatus(orderid ,this.data).pipe(first())
     .subscribe({
       next: (res: any) => {
          console.log('deleted',res)
       },
     });
    
   }
   if( this.type === 'Return'){
   this.data ={
    // userId:userId,
    // products:products,
    cancel:false,
    return:true,
    received:false,
    message: this.msg
   }
   console.log('data',this.data)
   this.comApi.updateOrderStatus(orderid ,this.data).pipe(first())
   .subscribe({
     next: (res: any) => {
        console.log('deleted',res)
        
     },
   });
  }

 
  }
  Closed(){
   this.data ={}
   this.modalData = []
   this.modalRef?.hide()
  }
}