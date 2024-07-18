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
  modalData:any=[]
  constructor(private comApi:CommonService ,private auth:AuthService,
    private modalService: BsModalService
  ){

  }

  ngOnInit() {
    this.comApi.getOrder(this.userId).subscribe((response:any)=>{
        this.orderData = response;
        console.log("getorder",this.orderData)
      
        console.log()

       
    })
  }
   
  openModal(template: TemplateRef<void> , orderId:any) {
    this.modalRef = this.modalService.show(template, { class: 'modal-xl' });
     this.modalData.push(this.orderData.find((order:any) => order.id === orderId));
     console.log('modal',this.modalData)
  }
  confirm(): void {
    this.message = 'Confirmed!';
    this.modalRef?.hide();
  }
  decline(): void {
    this.message = 'Declined!';
    this.modalRef?.hide();
  }
  cancel_return(orderId:BigInteger){
   let userId:BigInteger
   let orderid:any
   orderid = orderId
   userId = this.modalData.userId
   let data ={
    userId:userId,
    canscel:true,
    return:false,
    received:false
   }
   this.comApi.updateOrderStatus(orderid ,data).pipe(first())
   .subscribe({
     next: (res: any) => {
        console.log('deleted',res)
     },
   });
  }
}