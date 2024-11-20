import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appToggleVisibility]',
  standalone: true
})
export class ToggleVisibilityDirective {

  private isVisible = true;

  constructor(private el: ElementRef) {}

  @HostListener('dblclick') onDoubleClick() {
    this.isVisible = !this.isVisible;
    this.el.nativeElement.style.display = this.isVisible ? 'block' : 'none';
  }

}
