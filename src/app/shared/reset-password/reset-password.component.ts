import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {
  resetPasswordForm: FormGroup;
  constructor(public router: Router ,private comApi:CommonService ,private auth:AuthService,
    private fb:FormBuilder
  )
    {
       let email =this.auth?.userValue?.email
      this.resetPasswordForm = this.fb.group({
        email: [email , [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(10)]]
      });
  
    }
    onResetpassword(){
      console.log(this.resetPasswordForm.value)
      if (this.resetPasswordForm.valid) {
        this.auth.resetuserPassword(this.resetPasswordForm.value).subscribe((res:any)=>{
          console.log(res)
          this.router.navigateByUrl('/login');
      
        })
      }
    }
}
