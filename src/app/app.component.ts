import { AfterContentChecked, AfterContentInit, AfterViewChecked, Component, OnInit } from '@angular/core';
import { CommonService } from './services/common.service';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { first } from 'rxjs';
import { NetworkService } from './services/network.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'shoppingbuzz.com';
  isOnline:any;
  private hasShownSlowConnectionToast: boolean = false; 
  constructor(public router: Router ,public comApi:CommonService ,public auth:AuthService,
    private networkService: NetworkService,
    private toster : ToastrService
  ){
   
  }
  ngOnInit() {
   console.log("UserData",this.auth.userValue)
   this.networkService.getNetworkStatus().subscribe(status => {
    this.isOnline = status;
    console.log("status",status)
    if(status === false)
    {
      this.toster.error('Please check your Internet Conection')
    }
    //this.toster.error(error.error.message)
  });
  const connectionStatus = this.networkService.checkConnectionSpeed();
  if (this.networkService.checkConnectionSpeed() && connectionStatus.isSlow && !this.hasShownSlowConnectionToast) {
    this.toster.error(`You have a slow internet connection, slow with Speed (${connectionStatus.speed}), including potential slow 5G`);
    this.hasShownSlowConnectionToast = true; // Set the flag to prevent future toasts
  }
  }

  

}
