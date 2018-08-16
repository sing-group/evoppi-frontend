/*
 *  EvoPPI Frontend
 *
 * Copyright (C) 2017-2018 - Noé Vázquez, Miguel Reboiro-Jato,
 * Jorge Vieria, Sara Rocha, Hugo López-Fernández, André Torres,
 * Rui Camacho, Florentino Fdez-Riverola, and Cristina P. Vieira.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 */

import {Component, OnInit} from '@angular/core';
import {NotificationService} from './modules/notification/services/notification.service';
import {ToastrService} from 'ngx-toastr';
import {ErrorSeverity} from './entities/notification';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    constructor(
        private notification: NotificationService,
        private toastr: ToastrService
    ) {
    }

    ngOnInit(): void {
        this.notification.getMessages().subscribe(
            message => {
                switch (message.severity) {
                    case ErrorSeverity.ERROR:
                        this.toastr.error(message.summary, message.detail);
                        break;
                    case ErrorSeverity.SUCCESS:
                        this.toastr.success(message.summary, message.detail);
                        break;
                    case ErrorSeverity.INFO:
                        this.toastr.info(message.summary, message.detail);
                        break;
                    case ErrorSeverity.WARNING:
                        this.toastr.warning(message.summary, message.detail);
                        break;
                }
            }
        );
    }
}
