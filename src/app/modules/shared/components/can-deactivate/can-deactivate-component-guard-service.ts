/*
 *  EvoPPI Frontend
 *
 *  Copyright (C) 2017-2022 - Noé Vázquez González,
 *  Miguel Reboiro-Jato, Jorge Vieira, Hugo López-Fernández,
 *  and Cristina Vieira.
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

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
