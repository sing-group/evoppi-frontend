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

import {EventEmitter, Injectable} from '@angular/core';
import {ErrorMessage, ErrorSeverity} from '../../../entities/index';
import {Observable} from 'rxjs';

@Injectable()
export class NotificationService {
    private messageEmitter: EventEmitter<ErrorMessage>;

    constructor() {
        this.messageEmitter = new EventEmitter<ErrorMessage>();
    }

    public getMessages(): Observable<ErrorMessage> {
        return this.messageEmitter;
    }

    public success(detail: string, summary: string): void {
        this.messageEmitter.emit({
            severity: ErrorSeverity.SUCCESS, summary: summary, detail: detail
        });
    }

    public info(detail: string, summary: string): void {
        this.messageEmitter.emit({
            severity: ErrorSeverity.INFO, summary: summary, detail: detail
        });
    }

    public warning(detail: string, summary: string): void {
        this.messageEmitter.emit({
            severity: ErrorSeverity.WARNING, summary: summary, detail: detail
        });
    }

    public error(detail: string, summary: string): void {
        this.messageEmitter.emit({
            severity: ErrorSeverity.ERROR, summary: summary, detail: detail
        });
    }
}
