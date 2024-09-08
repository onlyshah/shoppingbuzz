import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  show: boolean;
  constructor( public router: Router) {
    this.show = this.router.url.includes('/reset-password/')
   }

}
