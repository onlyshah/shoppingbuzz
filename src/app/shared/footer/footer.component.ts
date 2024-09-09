import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  show: boolean;
  constructor( public router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const url = event.url;
        if (url.includes('/login') || url.includes('/signup') || url.includes('forgot-password')
            || url.includes('reset-password') || url.includes('**')
           )  {
          this.show = false;
        } else {
          this.show = true;
        }
      }
    });
   }

}
