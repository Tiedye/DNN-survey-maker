import { Directive, HostListener, Input, ElementRef, OnChanges, AfterViewChecked } from '@angular/core';

@Directive({
  selector: '[survAutosize]'
})
export class AutosizeDirective implements OnChanges, AfterViewChecked {

  @Input() survAutosize;

  @HostListener('input') update() {
    this.elementRef.nativeElement.style.height = "1px";
    this.elementRef.nativeElement.style.height = (this.elementRef.nativeElement.scrollHeight)+"px";
  }

  ngOnChanges() {
    this.update();
  }
  
  ngAfterViewChecked(): void {
    this.update();
  }

  constructor(private elementRef: ElementRef) { }

}
