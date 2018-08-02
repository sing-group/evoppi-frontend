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

    constructor(
        private bottomSheetRef: MatBottomSheetRef<ConfirmSheetComponent>,
        @Inject(MAT_BOTTOM_SHEET_DATA) private data: any
    ) {
        this.title = data.title || 'Message';
        this.message = data.message || '';
    }

    public confirm(): void {
        this.bottomSheetRef.dismiss(true);
    }

    public cancel(): void {
        this.bottomSheetRef.dismiss(false);
    }
}
