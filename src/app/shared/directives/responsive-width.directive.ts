import { Directive, ElementRef, Renderer2, HostListener } from '@angular/core';

@Directive({
  selector: '[appResponsiveWidth]'
})
export class ResponsiveWidthDirective {
  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('window:resize')
  onResize() {
    this.setResponsiveWidth();
  }

  @HostListener('window:load')
  onLoad() {
    this.setResponsiveWidth();
  }

  private setResponsiveWidth() {
    const width = window.innerWidth;
    console.log('Window width:', width);  // Debugging output
    if (width <= 768) { // Mobile breakpoint
      this.renderer.setStyle(this.el.nativeElement, 'width', '100px'); // Mobile width
      console.log('Setting width to 100px');  // Debugging output
    } else {
      this.renderer.setStyle(this.el.nativeElement, 'width', '75px'); // Default width
      console.log('Setting width to 75px');  // Debugging output
    }
  }
}
