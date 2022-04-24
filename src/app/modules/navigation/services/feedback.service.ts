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

import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {EvoppiError, Feedback} from '../../../entities/notification';
import {environment} from '../../../../environments/environment';
import {Observable} from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  constructor(private http: HttpClient) { }

  public sendFeedback(feedback: Feedback): Observable<void> {
    return this.http.post<void>(`${environment.evoppiUrl}api/feedback`, feedback)
        .pipe(
            EvoppiError.throwOnError(
                'Error sending feedback',
                `An unexpected error has happen while trying to send feedback. Please, try again later.`
            )
        );
  }

}
