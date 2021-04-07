import {CanDeactivate} from '@angular/router';
import {Injectable} from '@angular/core';
import {CanDeactivateComponent} from './can-deactivate.component';

@Injectable()
export class CanDeactivateComponentGuardService
    implements CanDeactivate<CanDeactivateComponent> {

    canDeactivate(component: CanDeactivateComponent): boolean {
        if (component.isRequestActive()) {
            return confirm('Your request is being processed. Are you sure you want to leave this page?');
        }
        return true;
    }
}
