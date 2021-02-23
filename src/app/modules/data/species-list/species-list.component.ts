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

import {AfterViewInit, Component, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatPaginatedDataSource} from '../../../entities/data-source/mat-paginated-data-source';
import {Status, Work} from '../../../entities/execution';
import {TableInputComponent} from '../../shared/components/table-input/table-input.component';
import {WorkService} from '../../management/services/work.service';
import {SpeciesService} from '../../results/services/species.service';
import {Species} from '../../../entities/bio';

@Component({
    selector: 'app-species-list',
    templateUrl: './species-list.component.html',
    styleUrls: ['./species-list.component.scss']
})
export class SpeciesListComponent implements OnInit, AfterViewInit {
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    dataSource: MatPaginatedDataSource<Species>;

    columns = ['NAME', 'INTERACTOMES_COUNT', 'ACTIONS'];

    @ViewChildren(TableInputComponent) inputComponents: QueryList<TableInputComponent>;

    executionStatus = Object.keys(Status);

    constructor(private readonly speciesService: SpeciesService) {
    }

    ngOnInit(): void {
        this.dataSource = new MatPaginatedDataSource<Species>(this.speciesService);
    }

    ngAfterViewInit() {
        const filterFields = TableInputComponent.getFilterValues(this.inputComponents);

        this.dataSource.setControls(this.paginator, this.sort, filterFields);
    }
}
