import {Component, HostListener} from '@angular/core';

@Component({
    template: ''
})
export abstract class CanDeactivateComponent {

    abstract isRequestActive(): boolean;

    @HostListener('window:beforeunload', ['$event']) beforeUnloadHander(event: any) {
        return !this.isRequestActive();
    }
}
