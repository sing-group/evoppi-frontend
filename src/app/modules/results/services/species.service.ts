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
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {environment} from '../../../../environments/environment';
import {Species} from '../../../entities/bio';
import {NotificationService} from '../../notification/services/notification.service';
import {EvoppiError} from '../../../entities/notification';
import {ListingOptions} from '../../../entities/data-source/listing-options';
import {PageData} from '../../../entities/data-source/page-data';
import {saveAs} from 'file-saver';
import {QueryHelper} from '../../../helpers/query.helper';

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

    public list(options: ListingOptions): Observable<PageData<Species>> {
        const params = QueryHelper.listingOptionsToHttpParams(options);

        return this.http.get<Species[]>(this.endpoint, {params, observe: 'response'})
            .pipe(
                map(response => new PageData<Species>(
                    Number(response.headers.get('X-Total-Count')),
                    response.body
                )),
                EvoppiError.throwOnError(
                    'Error retrieving species',
                    'The species could not be retrieved from the backend.'
                )
            );
    }

    public downloadSpeciesFasta(species: Species) {
        const options = {
            headers: new HttpHeaders({
                'Accept': 'application/octet-stream'
            })
        };

        this.http.get(this.endpoint + '/' + species.id + '/fasta', {responseType: 'blob'})
            .pipe(
                EvoppiError.throwOnError(
                    'Error requesting species FASTA',
                    `FASTA for species '${species.id}' could not be retrieved from the backend.`
                )
            )
            .subscribe(res => {
                const blob = new Blob([res], {type: 'text/plain'});
                saveAs(blob, species.name + '.fasta');
            });
    }
}
