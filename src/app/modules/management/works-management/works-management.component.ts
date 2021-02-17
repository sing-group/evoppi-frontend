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

import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import {MatPaginatedDataSource} from '../../../entities/data-source/mat-paginated-data-source';
import {Work} from '../../../entities/execution';
import {WorkService} from '../services/work.service';

@Component({
    selector: 'app-works-management',
    templateUrl: './works-management.component.html',
    styleUrls: ['./works-management.component.scss']
})
export class WorksManagementComponent implements OnInit, AfterViewInit {
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    dataSource: MatPaginatedDataSource<Work>;

    columns = ['NAME', 'CREATION_DATE_TIME', 'SCHEDULING_DATE_TIME', 'STARTING_DATE_TIME', 'FINISHING_DATE_TIME', 'STATUS'];

    constructor(private readonly workService: WorkService) {
    }

    ngOnInit(): void {
        this.dataSource = new MatPaginatedDataSource<Work>(this.workService);
    }

    ngAfterViewInit() {
        this.dataSource.setControls(this.paginator, this.sort);
    }

}
