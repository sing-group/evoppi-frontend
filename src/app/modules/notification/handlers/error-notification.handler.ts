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

import {ErrorHandler, Injectable} from '@angular/core';
import {NotificationService} from '../services/notification.service';
import {HttpErrorResponse} from '@angular/common/http';

@Injectable()
export class ErrorNotificationHandler implements ErrorHandler {
    constructor(private notificationService: NotificationService) {}

    public handleError(error: any): void {
        if (console) {
            console.log(error);
            if (error.cause) {
                console.log(error.cause);
            }
        }

        if (error.summary && error.detail) {
            this.notificationService.error(error.summary, error.detail);
        } else if (error instanceof HttpErrorResponse) {
            this.notificationService.error(error.statusText, error.message);
        }
    }
}
