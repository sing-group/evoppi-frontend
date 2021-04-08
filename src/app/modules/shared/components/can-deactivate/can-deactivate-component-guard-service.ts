import {CanDeactivate, UrlTree} from '@angular/router';
import {Injectable} from '@angular/core';
import {CanDeactivateComponent} from './can-deactivate.component';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {ConfirmSheetComponent} from '../../../material-design/confirm-sheet/confirm-sheet.component';
import {Observable} from 'rxjs/internal/Observable';

@Injectable()
export class CanDeactivateComponentGuardService
    implements CanDeactivate<CanDeactivateComponent> {

    public constructor(
        private readonly bottomSheet: MatBottomSheet
    ) {
    }

    canDeactivate(component: CanDeactivateComponent): Observable<boolean | UrlTree> | boolean {
        if (component.isRequestActive()) {
            return this.bottomSheet.open(
                ConfirmSheetComponent,
                {
                    data: {
                        title: 'Work in progress',
                        message: `Your request is being processed. Are you sure you want to leave this page?`,
                        confirmLabel: 'Yes',
                        cancelLabel: 'No'
                    }
                }
            ).afterDismissed();
        }
        return true;
    }
}
