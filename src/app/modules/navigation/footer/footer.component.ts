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

import {Component} from '@angular/core';
import {MatDialog} from '@angular/material';
import {FeedbackDialogComponent} from './feedback-dialog.component';
import {Feedback} from '../../../entities/notification';
import {FeedbackService} from '../services/feedback.service';
import {NotificationService} from '../../notification/services/notification.service';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
    public readonly currentDate: Date;

    constructor(
        private readonly dialog: MatDialog,
        private readonly feedbackService: FeedbackService,
        private readonly notificationService: NotificationService
    ) {
        this.currentDate = new Date();
    }

    public openFeedbackDialog(): void {
        const dialogRef = this.dialog.open(FeedbackDialogComponent, {
            width: '600px'
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result instanceof Feedback) {
                this.feedbackService.sendFeedback(result)
                    .subscribe(
                        () => this.notificationService.success(
                            'Feedback', 'Feedback has been successfully sent'
                        )
                    );
            }
        });
    }
}
