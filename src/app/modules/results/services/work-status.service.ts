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
import {Observable} from 'rxjs';
import {Work} from '../../../entities/execution';
import {EvoppiError} from '../../../entities/notification';
import {tap} from 'rxjs/operators';

@Injectable()
export class WorkStatusService {

    private endpoint = environment.evoppiUrl + 'api/work';

    private static convertDateTime(dateTime: Date): Date {
        if (dateTime) {
            return new Date(Date.parse(dateTime.toString()));
        } else {
            return null;
        }
    }

    constructor(private http: HttpClient) {
    }

    public getWork(uuid: string): Observable<Work> {
        return this.http.get<Work>(this.endpoint + '/' + uuid)
            .pipe(
                tap(workStatus => {
                    workStatus.creationDateTime = WorkStatusService.convertDateTime(workStatus.creationDateTime);
                    workStatus.startDateTime = WorkStatusService.convertDateTime(workStatus.startDateTime);
                    workStatus.endDateTime = WorkStatusService.convertDateTime(workStatus.endDateTime);
                }),
                EvoppiError.throwOnError(
                    'Error retrieving work information',
                    `Information for work '${uuid}' could not be retrieved.`
                )
            );
    }

    public getLocalWork(key: string): Work[] {
        const works: Work[] = JSON.parse(localStorage.getItem(key));
        if (works) {
            return works;
        } else {
            return [];
        }
    }

    public setLocalWork(key: string, value: Work): void {
        let works: Work[] = JSON.parse(localStorage.getItem(key));
        if (!works) {
            works = [];
        }

        works.push(value);
        localStorage.setItem(key, JSON.stringify(works));
    }

    public removeLocalWorks(key: string) {
        localStorage.removeItem(key);
    }

    public removeLocalWork(key: string, uuid: string) {
        const works: Work[] = JSON.parse(localStorage.getItem(key));

        const result: Work[] = [];
        works.forEach(item => {
            if (item.id.id !== uuid) {
                result.push(item);
            }
        });
        localStorage.setItem(key, JSON.stringify(result));
    }
}
