/*
 *  EvoPPI Frontend
 *
 *  Copyright (C) 2017-2021 - Noé Vázquez González,
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

import {ListingOptions} from '../entities/data-source/listing-options';
import {HttpParams} from '@angular/common/http';

export class QueryHelper {
    public static listingOptionsToHttpParams(options: ListingOptions): HttpParams {
        let params = new HttpParams()
            .append('start', String(options.initialIndex))
            .append('end', String(options.finalIndex));

        if (options.hasOrder()) {
            const sortField = options.sortFields[0];
            params = params.append('order', sortField.field)
                .append('sort', sortField.order);
        }

        if (options.hasFilters()) {
            for (const key of Object.keys(options.filters)) {
                params = params.append(key, options[key]);
            }
        }

        return params;
    }
}
