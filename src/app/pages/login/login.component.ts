import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { first } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  login: boolean = true;
  singUp: boolean = false;

  constructor(private auth:AuthService, private fb: FormBuilder,
    public router: Router) { }
  loginForm!: FormGroup;
  submitted = false;
  loginData:any;
  signupForm !:FormGroup;
  signupData:any

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
  get f() { return this.loginForm.controls; }
  submitLogin(){
    // this.submitted = true;  
    //   // stop here if form is invalid
    //   if (this.loginForm.invalid) {
    //       return;
    //   }
   this.auth.login(this.loginForm.value)
   .pipe(first())
   .subscribe({
       next: (res:any) => {
           //get return url from query parameters or default to home page
          console.log(res)
          this.router.navigateByUrl('');
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



 

 
  

  onsignupSubmit(){
    console.log(this.signupForm.value)
    this.auth.SignUp(this.signupForm.value).subscribe((response:any)=>{
      this.signupData = response;
      console.log(this.signupData);
      this.router.navigateByUrl('/login');
      
    })
   // console.log(this.signupForm.value)
  }
  
  showlogin(){
    this.singUp  = false;
    this.login = true;

  }
  showSingup(){
    this.login = false;
    this.singUp = true;
  }

}
