import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
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
    private spinner: NgxSpinnerService
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
      password: ['', [Validators.required, Validators.minLength(10)]],
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

    // Show the spinner before making the API call
    this.spinner.show();

    this.auth
      .login(this.loginForm.value)
      .pipe(first())
      .subscribe({
        next: (res: any) => {
          console.log(res);
          this.sessionService.startSession(600000); // 10 minutes
          this.router.navigate(['']).then(() => {
            location.reload();
        });
        },
        complete: () => {
          // Hide the spinner after the API call completes
          this.spinner.hide();
        },
        error: () => {
          // Hide the spinner if there is an error
          this.spinner.hide();
        },
      });
  }
  buildsignupForm(){
    this.signupForm = this.fb.group({
      email: ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')]],
      password: ['', [Validators.required, Validators.minLength(10)]],
      firstName:['',[Validators.required]],
      lastName:['',[Validators.required]],
      mobileNo:['',[Validators.required]],
      Address: this.fb.array([
        this.fb.group({
          Country: ['', Validators.required],
          State:['', Validators.required],
          City: ['', Validators.required],
          Street: ['', Validators.required],
          Postcode: ['', Validators.required],
          addresstype: ['', Validators.required],
        
      
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
