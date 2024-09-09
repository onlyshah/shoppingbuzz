import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';


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
    private route: ActivatedRoute,
    private toster : ToastrService
  ) {
    // Initialize the form with only the password field
    this.resetPasswordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  ngOnInit(): void {
      this.route.params.subscribe((response: any) => {
        const resetLink = '' + response.token; // This should be the full URL with token and email part
        const [token, emailHex] = resetLink.split('+'); // Assuming '+' is the delimiter
        try {
            const decodedEmail = atob(emailHex); // Decode email part if it was base64 encoded
            console.log('Decoded email:', decodedEmail);
            console.log('Reset token:', token);
            this.token = token
            this.email = decodedEmail
        } catch (e) {
            console.error('Error decoding Base64 string:', e);
        }
       
      });
    
     

    
  }





  onResetpassword() {
    if (this.resetPasswordForm.valid && this.token) {
      const resetData = {
        token: this.token,
        password: this.resetPasswordForm.value.password,
        email:this.email
      };

      // Call the backend API with the token and new password
      this.auth.resetuserPassword(resetData).subscribe(
        (res: any) => {
          console.log(res);   
          this.router.navigateByUrl('/login');
          this.toster.error(res.message)
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

