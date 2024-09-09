import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { Buffer } from 'buffer';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  token: string = '';
  email:any

  constructor(
    public router: Router,
    private comApi: CommonService,
    private auth: AuthService,
    private fb: FormBuilder,
    private route: ActivatedRoute
  ) {
    // Initialize the form with only the password field
    this.resetPasswordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const resetLink:any = params.get('/reset-password/');
      const parts = resetLink.split('/reset-password/')[1];
      console.log('parts',parts)
      if (parts) {
        // Split by '+'
        const emailHex = parts.split('+');
        console.log('emailhex' ,emailHex)
  
        // Now decode the email from hex
        const emailBuffer = Buffer.from(emailHex, 'hex');
        console.log('emailBuffer' ,emailBuffer)
        this.email = emailBuffer.toString('utf-8');
        console.log('email' ,this.email)

      }
    });
    
  }





  onResetpassword() {
    if (this.resetPasswordForm.valid && this.token) {
      const resetData = {
        token: this.token,
        password: this.resetPasswordForm.value.password,
      };

      // Call the backend API with the token and new password
      this.auth.resetuserPassword(resetData).subscribe(
        (res: any) => {
          console.log(res);
          this.router.navigateByUrl('/login');
        },
        (error) => {
          console.error('Error resetting password:', error);
        }
      );
    } else {
      console.error('Form is invalid or token is missing');
    }
  }
}

