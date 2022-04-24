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

import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/internal/Observable';
import {Work} from '../../../entities/execution';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {PaginatedDataProvider} from '../../../entities/data-source/paginated-data-provider';
import {ListingOptions} from '../../../entities/data-source/listing-options';
import {PageData} from '../../../entities/data-source/page-data';
import {map, tap} from 'rxjs/operators';
import {QueryHelper} from '../../../helpers/query.helper';
import {EvoppiError} from '../../../entities/notification';

@Injectable({
    providedIn: 'root'
})
export class WorkService implements PaginatedDataProvider<Work> {

    private endpoint = environment.evoppiUrl + 'api/work';

    public constructor(private http: HttpClient) {
    }

    public list(options: ListingOptions): Observable<PageData<Work>> {
        const params = QueryHelper.listingOptionsToHttpParams(options);

        return this.http.get<Work[]>(this.endpoint, {params, observe: 'response'})
            .pipe(
                map(response => new PageData<Work>(
                    Number(response.headers.get('X-Total-Count')),
                    response.body
                )),
                EvoppiError.throwOnError(
                    'Error retrieving works',
                    'The works could not be retrieved from the backend.'
                )
            );
    }
}
