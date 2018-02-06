import {AfterViewInit, Directive, EventEmitter, Output} from '@angular/core';

@Directive({
  selector: '[appAfterViewInit]'
})
export class AfterViewInitDirective implements AfterViewInit {

  @Output() afterViewInit: EventEmitter<boolean> = new EventEmitter();

  constructor() { }

  ngAfterViewInit(): void {
    setTimeout(() => this.afterViewInit.emit(true), 100);
  }

}
