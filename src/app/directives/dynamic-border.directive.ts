import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appDynamicBorder]',
  standalone: true
})
export class DynamicBorderDirective {

  @Input('appDynamicBorder') defaultColor: string = 'rgba(0, 123, 255, 0.25)'; // Celeste translúcido (Bootstrap)
  @Input() focusColor: string = 'rgba(0, 128, 0, 0.6)'; // Verde translúcido
  @Input() selectedColor: string = 'rgba(0, 128, 0, 0.6)'; // Verde fijo al seleccionar

  private isSelected: boolean = false; // Controla si ya se seleccionó una opción

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {
    this.setBorder(this.defaultColor); // Establecer el borde inicial (celeste translúcido)
  }

  // Evento al entrar en foco (focus)
  @HostListener('focus') onFocus() {
    if (!this.isSelected) {
      this.setBorder(this.focusColor); // Cambia al borde verde al enfocarse
    }
  }

  // Evento al perder el foco (blur)
  @HostListener('blur') onBlur() {
    if (!this.isSelected) {
      this.setBorder(this.defaultColor); // Vuelve al borde celeste si no está seleccionado
    }
  }

  // Evento al cambio del valor (change)
  @HostListener('change') onChange() {
    this.isSelected = true; // Marca como seleccionado
    this.setBorder(this.selectedColor); // Aplica el borde verde fijo
  }

  private setBorder(color: string) {
    this.renderer.setStyle(this.el.nativeElement, 'border', `2px solid ${color}`);
    this.renderer.setStyle(this.el.nativeElement, 'transition', 'border-color 0.3s ease-in-out'); // Transición suave
    this.renderer.setStyle(this.el.nativeElement, 'border-radius', '5px'); // Borde redondeado
  }
}
