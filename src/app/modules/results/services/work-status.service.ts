/*
 *  EvoPPI Frontend
 *
 * Copyright (C) 2017-2018 - Noé Vázquez, Miguel Reboiro-Jato,
 * Jorge Vieria, Sara Rocha, Hugo López-Fernández, André Torres,
 * Rui Camacho, Florentino Fdez-Riverola, and Cristina P. Vieira.
 * .
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

import {Injectable} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {Work} from '../../../entities/execution';
import {catchError} from 'rxjs/operators';
import {ErrorHelper} from '../../../helpers/error.helper';

@Injectable()
export class WorkStatusService {

    private endpoint = environment.evoppiUrl + 'api/work';

    constructor(private http: HttpClient) {
    }

    public getWork(uuid: string): Observable<Work> {
        return this.http.get<Work>(this.endpoint + '/' + uuid)
            .pipe(
                catchError(ErrorHelper.handleError('WorkStatusService.getWork', null))
            );
    }
}
