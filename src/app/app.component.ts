import { AfterContentChecked, AfterContentInit, AfterViewChecked, Component, OnInit } from '@angular/core';
import { CommonService } from './services/common.service';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { first } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'shoppingbuzz.com';
  constructor(public router: Router ,public comApi:CommonService ,private auth:AuthService,
  ){
   
  }
  ngOnInit() {
   console.log(this.auth.userValue)
  }

  

}
