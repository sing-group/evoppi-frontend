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


import {PaginatedDataSource} from './paginated-data-source';
import {PaginatedDataProvider} from './paginated-data-provider';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatSort, Sort} from '@angular/material/sort';
import {Subscription} from 'rxjs/internal/Subscription';
import {ListingOptions} from './listing-options';
import {SortDirection} from './sort-direction.enum';

export class MatPaginatedDataSource<T> extends PaginatedDataSource<T> {
    public static readonly DEFAULT_PAGE_SIZE = 10;
    private paginatorSubscription?: Subscription;
    private sortSubscription?: Subscription;
    private pageIndex: number;
    private pageSize: number;
    private sortFields: { field: string, order: SortDirection }[];

    private _paginator?: MatPaginator;
    private _sort?: MatSort;

    public constructor(
        dataProvider: PaginatedDataProvider<T>,
        private readonly defaultPageSize = MatPaginatedDataSource.DEFAULT_PAGE_SIZE
    ) {
        super(dataProvider);
        this.pageIndex = 0;
        this.pageSize = defaultPageSize;
        this.sortFields = undefined;
    }

    public get paginator(): MatPaginator | undefined {
        return this._paginator;
    }

    public set paginator(paginator: MatPaginator | undefined) {
        this.setControls(paginator, this._sort);
    }

    public get sort(): MatSort | undefined {
        return this._sort;
    }

    public set sort(sort: MatSort | undefined) {
        this.setControls(this._paginator, sort);
    }

    public loadInitialPage() {
        this.update(this.buildListingOptions());
    }

    public setControls(
        paginator: MatPaginator | undefined,
        sort: MatSort | undefined
    ) {
        let triggerUpdate = false;

        if (this._paginator !== paginator) {
            triggerUpdate = true;
            if (this.hasPaginator()) {
                this.paginatorSubscription.unsubscribe();
                this.paginatorSubscription = undefined;
            }

            this._paginator = paginator;
            if (this.hasPaginator()) {
                this.pageIndex = this._paginator.pageIndex;
                this.pageSize = this._paginator.pageSize;

                this.paginatorSubscription = this._paginator.page.subscribe(
                    event => this.onPageEvent(event)
                );
            } else {
                this.pageIndex = 0;
                this.pageSize = this.defaultPageSize;
            }
        }

        if (this._sort !== sort) {
            triggerUpdate = true;
            if (this.hasSort()) {
                this.sortSubscription.unsubscribe();
                this.sortSubscription = undefined;
            }

            this._sort = sort;

            if (this.hasSort()) {
                if (this._sort.active) {
                    this.sortFields = [{
                        field: this._sort.active,
                        order: SortDirection.from(this._sort.direction)
                    }];
                } else {
                    this.sortFields = undefined;
                }

                this.sortSubscription = this._sort.sortChange.subscribe(
                    event => this.onSortChange(event)
                );
            } else {
                this.sortFields = undefined;
            }
        }

        if (triggerUpdate) {
            this.update(this.buildListingOptions());
        }
    }

    public hasPaginator(): boolean {
        return this._paginator !== undefined;
    }

    public hasSort(): boolean {
        return this._sort !== undefined;
    }

    private onPageEvent(event: PageEvent) {
        this.pageIndex = event.pageIndex;
        this.pageSize = event.pageSize;

        this.update(this.buildListingOptions());
    }

    private onSortChange(sort: Sort) {
        if (this.hasPaginator()) {
            this.pageIndex = 0;
            this._paginator.pageIndex = 0;
        }

        const sortDirection = SortDirection.from(sort.direction);
        if (sort.active === undefined || sortDirection === SortDirection.NONE) {
            this.sortFields = undefined;
        } else {
            this.sortFields = [{
                field: this._sort.active,
                order: SortDirection.from(this._sort.direction)
            }];
        }

        this.update(this.buildListingOptions());
    }

    private buildListingOptions(): ListingOptions {
        return new ListingOptions(
            this.pageIndex,
            this.pageSize,
            this.sortFields
        );
    }
}
