import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { SessionService } from 'src/app/services/session.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit,OnDestroy {
  login: boolean = true;
  singUp: boolean = false;

  constructor(private auth:AuthService, private fb: FormBuilder, 
    private sessionService: SessionService,
    public router: Router,
    private spinner: NgxSpinnerService,
    private toster : ToastrService
  ) { }
 
  loginForm!: FormGroup;
  submitted = false;
  loginData:any;
  signupForm !:FormGroup;
  signupData:any
  passwordFieldType: string = 'password';

  ngOnInit(): void {
    this.buildloginForm();
    this.buildsignupForm();
    

  }
  buildloginForm(){
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')]],
      password: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(15)]],
    });
  }
  get loginerror() { return this.loginForm?.controls }

  togglePasswordVisibility(): void {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }
  submitLogin() {
    console.log('login')
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;

    }
    else{

    // Show the spinner before making the API call
    this.spinner.show();

    this.auth
      .login(this.loginForm.value)
      .pipe(first())
      .subscribe({
        next: (res: any) => {
          console.log("res",res);
          this.sessionService.startSession(this.auth.userValue?.token); // 10 minutes
          this.router.navigate([''])
        },
        complete: () => {
          // Hide the spinner after the API call completes
          this.spinner.hide();
        },
        error: (error:any) => {
          // Hide the spinner if there is an error error.error
          this.toster.error(error.error?.message)
          this.spinner.hide();
        },
      });
  }}
  buildsignupForm(){
    this.signupForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.maxLength(50), Validators.pattern('^[a-zA-Z ]*$')]], // Only letters and spaces
      lastName: ['', [Validators.required, Validators.maxLength(50), Validators.pattern('^[a-zA-Z ]*$')]], // Only letters and spaces
      mobileNo: ['', [Validators.required, Validators.pattern('^[0-9]{10,15}$')]], // 10 to 15 digits
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(20)]],
      Address: this.fb.array([
        this.fb.group({
          Country: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]], // Only letters and spaces
          State: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]], // Only letters and spaces
          City: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]], // Only letters and spaces
          Street: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9, -]*$')]], // Letters, numbers, and spaces
          Postcode: ['', [Validators.required, Validators.pattern('^[0-9]{5,10}$')]], // 5 to 10 digits
          addresstype: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]] // Only letters and spaces
    
        
      
        })
      ])
     
    });
  }
 get form() { return this.signupForm.controls; }
 get addressControls() {
  return (this.signupForm.get('Address') as FormArray).controls;
}
 
onsignupSubmit() {
  console.log(this.signupForm.value);
  this.submitted = true;
  if (this.signupForm.invalid) {
    return;
  }

  // Show the spinner before making the API call
  this.spinner.show();

  this.auth.SignUp(this.signupForm.value).subscribe(
    (response: any) => {
      this.signupData = response;
      console.log(this.signupData);
      this.router.navigateByUrl('/login');
    },
    () => {
      // Hide the spinner after the API call completes
      this.spinner.hide();
    }
  );
}
  
  showlogin(){
    this.singUp  = false;
    this.login = true;

  }
  showSingup(){
    this.login = false;
    this.singUp = true;
  }
  ngOnDestroy(): void {
    this.login = false;
    this.singUp = true;
    this.submitted = false;
    this.loginData = [];
    this.signupData = [];
  

  }

}
