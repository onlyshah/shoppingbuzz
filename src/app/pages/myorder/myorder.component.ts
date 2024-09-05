import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { first } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-myorder',
  templateUrl: './myorder.component.html',
  styleUrls: ['./myorder.component.css']
})
export class MyorderComponent  implements OnInit ,OnDestroy{
  userId = this.auth.userValue.userId;
  imagePath = environment.baseUrl
  orderData:any;
  modalRef?: BsModalRef;
  message?: string;
  msg:any
  modalData:any=[]
  data:any;
  type:any
  returnorderData: any;
  cancelorderData: any;
  keys: string[];
  receivedorderData: any;
  constructor(private comApi:CommonService ,private auth:AuthService,
    private modalService: BsModalService,
    private spinner: NgxSpinnerService
  ){

  }


  ngOnInit() {
    // Show spinner while fetching orders
    this.spinner.show();

    this.comApi.getOrder(this.userId).subscribe(
      (response: any) => {
         const filteredOrders = response;
         console.log('getorder', filteredOrders);
         this.orderData = filteredOrders.filter((order:any) => 
          order.status.every((status:any) => 
            status.return === false && 
            status.cancel === false &&
            status.received === false
          )
      );
      
      // console.log(filteredOrders);
      
        this.cancelorderData=  response.map((order:any) => {
          return {
            ...order,
            status: order.status.filter((status:any) => status.cancel === true)
          };
        }).filter((order:any) => order.status.length > 0);
        // Filter for returned orders
        this.returnorderData = response.map((order:any) => {
          return {
            ...order,
            status: order.status.filter((status:any) => status.return === true)
          };
        }).filter((order:any) => order.status.length > 0);
        
        this.receivedorderData = response.map((order:any) => {
          return {
            ...order,
            status: order.status.filter((status:any) => status.received === true)
          };
        }).filter((order:any) => order.status.length > 0);
        // Log the filtered data
        console.log('return:', this.returnorderData);
        console.log('cancel:', this.cancelorderData);
        
       
        
      },
      () => {
        // Hide spinner in case of error
        this.spinner.hide();
      },
      () => {
        // Hide spinner after data is loaded
        this.spinner.hide();
      }
    );
  }
  openModal(template: TemplateRef<void>, orderId: any, type: any) {
    // Clear previous modal data
    this.modalData = null;
    this.type = null;

    // Open modal with new template
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });

    // Set modal data with new order data
    this.modalData = [ this.orderData.find((order: any) => order.id === orderId)];
  
    console.log('modal', this.modalData, type);

    // Set the new type
    this.type = type;
}

cancel_return(orderId: BigInteger) {
  let orderid: any = orderId;
  console.log('orderId', orderid);

  // Show spinner during the update
  this.spinner.show();

  if (this.type === 'Cancel') {
    this.data = {
      cancel: true,
      return: false,
      received: false,
      message: this.msg,
    };
    console.log('data', this.data);
    this.comApi.updateOrderStatus(orderid, this.data).pipe(first()).subscribe({
      next: (res: any) => {
        console.log('deleted', res);
      },
      complete: () => {
        // Hide spinner after update
        this.spinner.hide();
      },
      error: () => {
        // Hide spinner if there is an error
        this.spinner.hide();
      },
    });
  }

  if (this.type === 'Return') {
    this.data = {
      cancel: false,
      return: true,
      received: false,
      message: this.msg,
    };
    console.log('data', this.data);
    this.comApi.updateOrderStatus(orderid, this.data).pipe(first()).subscribe({
      next: (res: any) => {
        console.log('deleted', res);
      },
      complete: () => {
        // Hide spinner after update
        this.spinner.hide();
      },
      error: () => {
        // Hide spinner if there is an error
        this.spinner.hide();
      },
    });
  }
}
  Closed(){
   this.data ={}
   this.modalData = []
   this.modalRef?.hide()
  }
  ngOnDestroy(): void {
  this.userId = null;
  this.orderData=[];
  this.message = '';
  this.msg =''
  this.modalData =[]
  this.data = [];
  this.type =null;
  this.returnorderData = [];
  this.keys = [];
}
}