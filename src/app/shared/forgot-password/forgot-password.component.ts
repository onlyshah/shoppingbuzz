import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';


@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;

  constructor(public router: Router ,private comApi:CommonService ,private auth:AuthService,
    private fb:FormBuilder ,public toastr: ToastrService
  )
    {
      
    }
    ngOnInit(): void {
      this.forgotPasswordForm = this.fb.group({
        email: ['', [Validators.required, Validators.email ,Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')]]
      });
    }

  forgotpassword(){
    if (this.forgotPasswordForm.valid) {
      const email = this.forgotPasswordForm.get('email')?.value;
      // console.log(email)
      let data ={
        email:email
      }
      this.auth.sendResetLink(data).subscribe((response:any) => {
        console.log(response);
        this.router.navigateByUrl('/login')
        this.toastr.success(response.message);
       
      },
      error => {
        this.toastr.error(error.error);
       
      });
    }
  }
}
