import { Component, ElementRef, OnDestroy, OnInit ,TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { environment } from 'src/environments/environment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs';
declare var Razorpay: any;
import { NgxSpinnerService } from 'ngx-spinner';
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
 PDFbill:any;
 paymentForm: FormGroup;
 selectedPayment:any
 submitted = false
cardData:any
  constructor(private comApi:CommonService ,private auth:AuthService,
    private route: Router , private router: ActivatedRoute 
    ,private modalService: BsModalService ,private fb:FormBuilder,
    private spinner: NgxSpinnerService,
    private toster : ToastrService
    
  ) {}
   
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
      addressType: ['office' ,]
    });
    this.comApi.getproducttocart(this.id).subscribe((response:any)=>{
      this.data = response;
      console.log('data',response)
      this.updateprices =0;
      this.data.products.forEach((el:any) => {
        this.productquantity = el.quantity
        this.updateprices +=el.quantity*el.productId.price
        console.log(this.updateprices,this.productquantity)
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
       this.paymentForm = this.fb.group({
        cardNumber: ['', [Validators.required, Validators.pattern('^[0-9]{16}$') 
          ,Validators.maxLength(16) ,Validators.minLength(14)]],
        cardHolderName: ['', [Validators.required , Validators.pattern('^[a-zA-Z ]*$')]],
        expiryDate: ['', Validators.required],
        cardType: ['', Validators.required],
        bankName: ['', Validators.required ,Validators.pattern('^[a-zA-Z ]*$')],
        cvvCode: ['', [Validators.required, Validators.pattern('^[0-9]{3}$'),
          ,Validators.maxLength(4) ,Validators.minLength(3)
        ]]
      });
      
  }
  get cardform() {
    return this.paymentForm.controls;
  }
  onSelecteCOD(mode:any){
    
    this.selectedPayment =  mode
    this.cardData = this.selectedPayment
    console.log(this.selectedPayment)

  }
  onSelectepayment(mode:any){
    this.selectedPayment  =  mode
    
    console.log(this.selectedPayment)
    this.submitted= true
    if (this.paymentForm.invalid) {
      return;
  }

    const paymentDetails = {
      cardNumber: this.paymentForm.value.cardNumber,
      cardHolderName: this.paymentForm.value.cardHolderName,
      expiryDate: this.paymentForm.value.expiryDate,
      BankName :this.paymentForm.value.bankName,
      cardType:this.paymentForm.value.cardType,
      cvvCode: this.paymentForm.value.cvvCode,
    };
    this.cardData = paymentDetails
    console.log("cardData",this.cardData)

  }
  Onfocsu(){
    console.log('hello')
    if (this.paymentForm.invalid) {
      return;
  }
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
    if (!this.selectedPayment) {
        this.toster.info('Please Select Approdiate Paymenent Method')
    }
    else{
    this.modalRef = this.modalService.show(template);
    }
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

     
      //this.PDFbill = pdf.output('blob');
      
      console.log(this.PDFbill);
      console.log(this.PDFbill)
     // this.sendbilltoEmail()

      // Save the PDF with a specific name
      //this.PDFbill = pdf.save(this.billdetail.firstName+this.billdetail.lastName)
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
  let status:any =[{
      cancel:false,
      return:false,
      received:false,
      message:null
     }]
    let data= {
      "products":this.products,
      "totalprice":this.updateprices,
      "userId":this.id,
      "paymentType":this.cardData,
       "status":status

    }
  
  // console.log("createdata",data)
 
   this.generatebillPdf()
    if(this.selectedPayment === 'Card'){
    if (this.paymentForm.invalid) {
      return;
     }
    this.pay(this.updateprices)
   console.log("createOrder",data)
     this.comApi.orderCreate(data).subscribe((reponse:any)=>{
      let order = reponse
      console.log('createorder' ,order)
      this.modalRef?.hide()
      this.route.navigateByUrl('myorder')
     })
   }
   else{
    let productId:any = [];
    let userId = this.auth.userValue.userId
    data.products.forEach((element:any) => {
      productId.push(element.productId)
    } );
    
  
    console.log("createOrder",data ,userId ,productId)
     this.comApi.orderCreate(data).subscribe((reponse:any)=>{
      let order = reponse
      console.log('createorder' ,order)
      this.comApi.deletecartItemByuserId(userId).pipe(first())
      .subscribe({
        next: (res: any) => {
           console.log('deleted',res)
        },
      });
      this.modalRef?.hide()
      // this.comApi.deletecartItem()
      this.route.navigateByUrl('myorder')
     })
   }
   
   
 
   
  
 
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
 
  pay(amount: number) {
    // Show the spinner before starting the payment process
    this.spinner.show();
  
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
            // Hide the spinner once payment is verified successfully
            this.spinner.hide();
          }, (error) => {
            console.error('Payment verification failed:', error);
            // Hide the spinner if payment verification fails
            this.spinner.hide();
          });
        },
        prefill: {
          name: this.billdetail.firstName + this.billdetail.lastName,
          email: this.billdetail.email,
          contact: this.billdetail.mobileNo,
          cardNumber: this.cardData.cardNumber,
          cvvv: this.cardData.cvvCode,
          expiryDate: this.cardData.expiryDate,
        },
        notes: {
          address: this.billdetail.Address[0].Country +
                   this.billdetail.Address[0].State +
                   this.billdetail.Address[0].City +
                   this.billdetail.Address[0].Postcode +
                   this.billdetail.Address[0].Street
        },
        theme: {
          color: '#3399cc'
        }
      };
      const rzp1 = new Razorpay(options);
      rzp1.open();
  
      // Hide the spinner if Razorpay payment window is closed (user interaction)
      rzp1.on('payment.failed', (response: any) => {
        console.error('Payment failed:', response);
        this.spinner.hide();
      });
    }, (error) => {
      console.error('Order creation failed:', error);
      // Hide the spinner if order creation fails
      this.spinner.hide();
    });
  }
  ngOnDestroy(): void {
    this.orderData = [],
    this.data= []
 
   }
}


