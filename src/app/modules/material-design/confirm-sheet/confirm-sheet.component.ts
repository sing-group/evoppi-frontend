/*
 *  EvoPPI Frontend
 *
 *  Copyright (C) 2017-2019 - Noé Vázquez González,
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

import {Component, Inject} from '@angular/core';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from '@angular/material';

@Component({
    selector: 'app-confirm-sheet',
    templateUrl: './confirm-sheet.component.html',
    styleUrls: ['./confirm-sheet.component.scss']
})
export class ConfirmSheetComponent {
    public readonly title: string;
    public readonly message: string;
    public readonly confirmLabel: string;
    public readonly cancelLabel: string;
    public readonly headerClass: string;

    constructor(
        private bottomSheetRef: MatBottomSheetRef<ConfirmSheetComponent>,
        @Inject(MAT_BOTTOM_SHEET_DATA) private data: any
    ) {
        this.title = data.title || 'Message';
        this.message = data.message || '';
        this.confirmLabel = data.confirmLabel || 'Confirm';
        this.cancelLabel = data.cancelLabel || 'Cancel';
        this.headerClass = data.headerClass || 'card-header-warning';
    }

    public confirm(): void {
        this.bottomSheetRef.dismiss(true);
    }

    public cancel(): void {
        this.bottomSheetRef.dismiss(false);
    }
}
