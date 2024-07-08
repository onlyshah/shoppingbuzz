import { Component, ElementRef, OnDestroy, OnInit ,TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { environment } from 'src/environments/environment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup } from '@angular/forms';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
declare var Razorpay: any;
@Component({
  selector: 'app-shop-checkout',
  templateUrl: './shop-checkout.component.html',
  styleUrls: ['./shop-checkout.component.css']
})
export class ShopCheckoutComponent implements OnInit ,OnDestroy {
  @ViewChild('template', { static: false }) template: ElementRef;
  @ViewChild('payNowButton') payNowButton: ElementRef;
  data: any =[];
  updateprices: number =0;
  productquantity: any;
  id:any;
  userData:any=[];
  imagePath = environment.baseUrl;
  orderData:any;
 products:any= []; 
 date = new Date()
 selectedAddress :any
 billdetail:any;
 modalRef?: BsModalRef;
 userAddressForm!:FormGroup
 ischecked = true
 paymentMode:any
 PDFbill:any;
 cardNumber: string;
 cardHolderName: string;
 expiryDate: string;
 cvvCode: string;
 cardType: string;
 BankName:string
 paymenttype:any;
  constructor(private comApi:CommonService ,private auth:AuthService,
    private route: Router , private router: ActivatedRoute 
    ,private modalService: BsModalService ,private fb:FormBuilder) {}
   
  ngAfterViewInit() {
    //Ensure the template is available after the view initializes
    if (!this.template || !this.template.nativeElement) {
      console.error('Template reference is invalid or not initialized.');
    }
  }
 
  ngOnInit(){
    
    this.router.params.subscribe((response:any)=>{
      this.id = ""+response?.userId;
      console.log(this.id)
    })
    this.userAddressForm = this.fb.group({
      Country: [],
      Street: [],
      City: [],
      State: [],
      Postcode: [],
      addressType: ['office']
    });
    this.comApi.getproducttocart(this.id).subscribe((response:any)=>{
      this.data = response;
      console.log('data',response)
      this.updateprices =0;
      this.data.products.forEach((el:any) => {
        this.productquantity = el.quantity
        this.updateprices +=el.quantity*el.productId.price
        console.log(this.updateprices)
        this.orderData= {
         "productId":el.productId._id,
         "quantity":el.quantity,
         "date": this.date
        }
        
        this.products.push(this.orderData)
        console.log('productData',this.products)
      });
       })
       this.auth.getUser(this.id).subscribe((user:any)=>{
        this.userData.push(user)
        this.billdetail = user
        console.log('userData',this.userData ,'biil' ,this.billdetail.firstName)
        console.log('email',this.userData ,'biil' ,this.billdetail.email)
        this.selectedAddress = this.userData[0].Address.find((addr:any) => addr.addresstype === 'home');
    console.log('Selected Address:', this.selectedAddress);
   
       })
      
       
         // You can perform any additional logic here based on the selected address
      
  }
  
  onSelecteCOD(mode:any){
    
    this.paymenttype =  mode
    console.log(this.paymenttype)

  }
  onSelectepayment(mode:any){
    this.paymenttype  =  mode
    console.log(this.paymenttype)

    const paymentDetails = {
      cardNumber: this.cardNumber,
      cardHolderName: this.cardHolderName,
      expiryDate: this.expiryDate,
      BankName :this.BankName,
      cardType:this.cardType,
      cvvCode: this.cvvCode,
    };
    this.paymentMode = paymentDetails
    console.log(this.paymentMode)

  }
  selectAddress(addressType:any ,id:any){
    console.log('address',addressType ,id )
    // Find the selected address based on addressType and userId
    const user = this.userData.find((u:any) => u._id === id)
    if (user) {
      this.selectedAddress = user.Address.find((addr:any) => addr.addresstype === addressType);
      console.log('Selected Address:', this.selectedAddress);
      // You can perform any additional logic here based on the selected address
    }
  }
  openModal(template: TemplateRef<void>) {
    this.modalRef = this.modalService.show(template);
  }
  newaddmodal(newaddress: TemplateRef<void>){
    this.modalRef = this.modalService.show(newaddress);
  } 

  generatebillPdf() {
    this.payNowButton.nativeElement.classList.add('d-none');
    // Ensure the template reference is valid before proceeding
    if (!this.template || !this.template.nativeElement) {
      console.error('Template reference is invalid.');
      return;
    }

    // Get the HTML element to convert
    const htmlData = this.template.nativeElement as HTMLElement;

    // Use html2canvas to capture the HTML element
    html2canvas(htmlData).then(canvas => {
      // Append the generated canvas to the body (for testing/debugging purposes)
      document.body.appendChild(canvas);

      // Create a new jsPDF instance
      const pdf = new jsPDF('p', 'mm', 'a4');

      // Calculate dimensions of the content on the canvas
      const imgData = canvas.toDataURL('image/png');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pdfWidth;
      const imgHeight = canvas.height * pdfWidth / canvas.width;
      let position = 0;

      // Add the captured canvas as an image in the PDF
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);

      if (imgHeight > pdfHeight) {
        let heightLeft = imgHeight;
        while (heightLeft > 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pdfHeight;
        }
      }

     
      this.PDFbill = pdf.output('blob');
      
      console.log(this.PDFbill);
      console.log(this.PDFbill)
      this.sendbilltoEmail()

      // Save the PDF with a specific name
      this.PDFbill = pdf.save(this.billdetail.firstName+this.billdetail.lastName)
        // Show the "Pay Now" button again
        this.payNowButton.nativeElement.classList.remove('d-none');
    }).catch(error => {
      console.error('Error generating PDF:', error);
    });
  }
  sendbilltoEmail(){
    const formdata = new FormData()
    // Convert the Blob to a File object
    const file = new File([this.PDFbill], 'bill.pdf', { type: 'application/pdf' });

    formdata.append('billpdf', file)
    formdata.append('name',this.billdetail.firstName+this.billdetail.lastName)
    formdata.append('email',this.billdetail.email)
    formdata.append('message','bill to you order')
    formdata.append('userId',this.billdetail._id)
    this.auth.billsendtoEmail(formdata).subscribe((res)=>{
      console.log(res)
    })
    formdata.forEach((value, key) => {
      console.log("formdata",`${key}: ${value}`);
    });
  }

  onOrder(){
    let data= {
      "products":this.products,
      "totalprice":this.updateprices,
      "userId":this.id,
      "paymentType":this.paymentMode

    }
  
   console.log(data)
   this.generatebillPdf()
   if(this.paymenttype === 'Card'){
    this.pay(this.updateprices)
   }
   
   this.comApi.orderCreate(data).subscribe((reponse:any)=>{
    let order = reponse
    console.log('createorder' ,order)
    this.route.navigateByUrl('myorder')
   })
   

 
  }
  Add_address(){
    let data = {
      "Address":this.userAddressForm.value
    }
    console.log(data)
    this.auth.AddUseraddress(data,this.id).subscribe((res:any)=>{
      console.log(res)
    })

  }
  ngOnDestroy(): void {
   this.orderData = [],
   this.data= []

  }
  pay(amount: number) {
    this.auth.createOrder(amount).subscribe((order: any) => {
      const options = {
        key: 'rzp_test_MiheZxloav4xYh',
        amount: this.updateprices,
        currency: 'INR',
        name: 'FreshCart',
        description: 'Test Transaction',
        order_id: order.id,
        handler: (response: any) => {
          this.auth.verifyPayment(response).subscribe((res) => {
            console.log('Payment success:', res);
          }, (error) => {
            console.error('Payment verification failed:', error);
          });
        },
        prefill: {
          name: this.billdetail.firstName+this.billdetail.lastName,
          email: this.billdetail.email,
          contact: this.billdetail.mobileNo,
          cardNumber:this.cardNumber,
          cvvv:this.cvvCode,
          expiryDate:this.expiryDate,
        },
        notes: {
          address: this.billdetail.Address[0].Country+
                   this.billdetail.Address[0].State+
                   this.billdetail.Address[0].City+
                   this.billdetail.Address[0].Postcode+
                   this.billdetail.Address[0].Street
                   

        },
        theme: {
          color: '#3399cc'
        }
      };
      const rzp1 = new Razorpay(options);
      rzp1.open();
    });
  }
}


