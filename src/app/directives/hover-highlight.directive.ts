import { Directive, ElementRef, HostListener, Renderer2, RendererStyleFlags2 } from '@angular/core';


@Directive({
  selector: '[appHoverHighlight]',
  standalone: true
})
export class HoverHighlightDirective {

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('mouseenter') onMouseEnter() {
    this.renderer.setStyle(this.el.nativeElement, 'background-color', 'lightblue');
    const cells = this.el.nativeElement.querySelectorAll('td');
    cells.forEach((cell: HTMLElement) => {
      this.renderer.setStyle(cell, 'background-color', 'lightblue');
    });
  }
  
  @HostListener('mouseleave') onMouseLeave() {
    this.renderer.setStyle(this.el.nativeElement, 'background-color', 'transparent');
    const cells = this.el.nativeElement.querySelectorAll('td');
    cells.forEach((cell: HTMLElement) => {
      this.renderer.setStyle(cell, 'background-color', 'transparent');
    });
  }
  
  
}
