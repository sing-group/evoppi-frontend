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

import {Interactome} from '../../../entities/bio';
import {InteractomeService} from '../../results/services/interactome.service';
import {InteractomeQueryParams} from '../../../entities/bio/interactome-query-params';
import {PaginatedDataSource} from '../../../entities/data-source/paginated-data-source';
import {Pagination} from '../../../entities/data-source/pagination';

export class InteractomeDataSource extends PaginatedDataSource<Interactome> {
    private queryParams?: InteractomeQueryParams;

    constructor(private interactomeService: InteractomeService) {
        super();
    }

    public list(queryParams: InteractomeQueryParams): void {
        if (this.haveFiltersChanged(queryParams)) {
            const pagination = new Pagination(queryParams.page, queryParams.pageSize);

            const unpaginatedQueryParams = {...queryParams};
            unpaginatedQueryParams.page = undefined;
            unpaginatedQueryParams.pageSize = undefined;

            this.queryParams = queryParams;
            this.update(this.interactomeService.getInteractomes(unpaginatedQueryParams, true), pagination);
        } else if (this.hasPaginationChanged(queryParams)) {
            const pagination = new Pagination(queryParams.page, queryParams.pageSize);

            this.queryParams = queryParams;
            this.updatePage(pagination);
        }
    }

    private hasPaginationChanged(queryParams: InteractomeQueryParams): boolean {
        if (this.queryParams === undefined) {
            return queryParams !== undefined;
        } else {
            return this.queryParams.page !== queryParams.page
                || this.queryParams.pageSize !== queryParams.pageSize;
        }
    }

    private haveFiltersChanged(queryParams: InteractomeQueryParams): boolean {
        if (this.queryParams === undefined) {
            return queryParams !== undefined;
        } else {
            return this.queryParams.orderField !== queryParams.orderField
                || this.queryParams.sortDirection !== queryParams.sortDirection;
        }
    }
}