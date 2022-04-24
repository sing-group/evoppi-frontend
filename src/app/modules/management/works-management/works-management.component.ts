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

import {AfterViewInit, Component, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import {MatPaginatedDataSource} from '../../../entities/data-source/mat-paginated-data-source';
import {Status, Work} from '../../../entities/execution';
import {WorkService} from '../services/work.service';
import {TableInputComponent} from '../../shared/components/table-input/table-input.component';

@Component({
    selector: 'app-works-management',
    templateUrl: './works-management.component.html',
    styleUrls: ['./works-management.component.scss']
})
export class WorksManagementComponent implements OnInit, AfterViewInit {
    private static readonly FILTER_SUFFIX = '_FILTER';

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    dataSource: MatPaginatedDataSource<Work>;

    columns = ['NAME', 'CREATION_DATE_TIME', 'SCHEDULING_DATE_TIME', 'STARTING_DATE_TIME', 'FINISHING_DATE_TIME', 'STATUS', 'ACTIONS'];

    @ViewChildren(TableInputComponent) inputComponents: QueryList<TableInputComponent>;

    executionStatus = Object.keys(Status);

    private static readonly COLUMN_TO_FILTER_MAPPER = (column: string) => column + WorksManagementComponent.FILTER_SUFFIX;
    private static readonly FILTER_TO_COLUMN_MAPPER = (filter: string) => filter.replace(WorksManagementComponent.FILTER_SUFFIX, '');

    constructor(private readonly workService: WorkService) {
    }

    ngOnInit(): void {
        this.dataSource = new MatPaginatedDataSource<Work>(this.workService);
    }

    ngAfterViewInit() {
        const filterFields = TableInputComponent.getFilterValues(
            this.inputComponents,
            WorksManagementComponent.FILTER_TO_COLUMN_MAPPER
        );

        this.dataSource.setControls(this.paginator, this.sort, filterFields);
    }

    public get columnFilters(): string[] {
        return this.columns.map(WorksManagementComponent.COLUMN_TO_FILTER_MAPPER);
    }

    public hasFilters(): boolean {
        return TableInputComponent.haveValue(this.inputComponents);
    }

    public onClearFilters() {
        TableInputComponent.clear(this.inputComponents)
    }
}
