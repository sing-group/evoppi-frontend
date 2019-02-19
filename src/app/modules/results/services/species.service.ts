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

import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {environment} from '../../../../environments/environment';
import {Species} from '../../../entities/bio';
import {NotificationService} from '../../notification/services/notification.service';
import {EvoppiError} from '../../../entities/notification';

@Injectable()
export class SpeciesService {

    private endpoint = environment.evoppiUrl + 'api/species';

    constructor(private http: HttpClient, private notification: NotificationService) {
    }

    getSpecies(): Observable<Species[]> {
        return this.http.get<Species[]>(this.endpoint)
            .pipe(
                map(res => res.sort((a, b) => a.name < b.name ? -1 : 1)),
                EvoppiError.throwOnError('Error retrieving species', 'The list of species could not be retrieved from the backend.')
            );
    }

    getSpeciesById(id: number): Observable<Species> {
        return this.http.get<Species>(this.endpoint + '/' + id)
            .pipe(
                EvoppiError.throwOnError('Error retrieving single species', `The species with the id '${id}' could not be retrieved.`)
            );
    }

}
