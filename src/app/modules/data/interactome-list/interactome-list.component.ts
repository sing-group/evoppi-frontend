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

import {Component, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {InteractomeService} from '../../results/services/interactome.service';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import {InteractomeDataSource} from './InteractomeDataSource';
import {SortDirection} from '../../../entities/data';
import {InteractomeField} from '../../../entities/bio/interactome-field';
import {InteractomeQueryParams} from '../../../entities/bio/interactome-query-params';
import {tap} from 'rxjs/operators';
import {Interactome} from '../../../entities/bio';

@Component({
    selector: 'app-interactome-list',
    templateUrl: './interactome-list.component.html',
    styleUrls: ['./interactome-list.component.scss']
})
export class InteractomeListComponent implements OnInit {
    @ViewChild(MatPaginator, {static: true}) private paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) private sort: MatSort;

    columns: string[];
    dataSource: InteractomeDataSource;
    public totalResultsSize: number;

    constructor(private interactomeService: InteractomeService) {
    }

    ngOnInit() {
        this.columns = ['Name', 'DBSource', 'Species', 'Actions'];
        this.dataSource = new InteractomeDataSource(this.interactomeService);

        this.initPaginator();
        this.updatePage();
    }

    initPaginator() {
        this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

        this.sort.sortChange
            .pipe(
                tap(() => this.updatePage())
            )
            .subscribe();

        this.paginator.page
            .pipe(
                tap(() => this.updatePage())
            )
            .subscribe();
    }

    private updatePage(queryParams = this.createPaginatedQueryParameters()): void {
        this.dataSource.list(this.createPaginatedQueryParameters());
        this.dataSource.count$.subscribe(count => this.totalResultsSize = count);
    }

    private sortDirection(): SortDirection {
        switch (this.sort.direction) {
            case 'asc':
                return SortDirection.ASCENDING;
            case 'desc':
                return SortDirection.DESCENDING;
            default:
                return undefined;
        }
    }

    private orderField(): InteractomeField {
        if (this.sortDirection() !== undefined) {
            return InteractomeField[this.sort.active];
        } else {
            return undefined;
        }
    }

    private createQueryParameters(): InteractomeQueryParams {
        return {
            sortDirection: this.sortDirection(),
            orderField: this.orderField()
        };
    }

    private createPaginatedQueryParameters(defaultPageIndex = 0, defaultPageSize = 10): InteractomeQueryParams {
        return {
            page: this.paginator.pageIndex || defaultPageIndex,
            pageSize: this.paginator.pageSize || defaultPageSize,
            ...this.createQueryParameters()
        };
    }

    public downloadInteractionsTsv(interactome: Interactome) {
        this.interactomeService.downloadInteractomeTsv(interactome);
    }
}
