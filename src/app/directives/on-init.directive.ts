import {Directive, EventEmitter, OnInit, Output} from '@angular/core';

@Directive({
  selector: '[appOnInit]'
})
export class OnInitDirective implements OnInit {

  @Output() onInit: EventEmitter<boolean> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
    this.onInit.emit(true);
  }

}
