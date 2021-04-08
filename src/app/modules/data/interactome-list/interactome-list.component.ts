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

import {AfterViewInit, Component, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {InteractomeService} from '../../results/services/interactome.service';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import {Interactome} from '../../../entities/bio';
import {MatPaginatedDataSource} from '../../../entities/data-source/mat-paginated-data-source';
import {PaginatedDataProvider} from '../../../entities/data-source/paginated-data-provider';
import {PageData} from '../../../entities/data-source/page-data';
import {Observable} from 'rxjs/internal/Observable';
import {ListingOptions} from '../../../entities/data-source/listing-options';
import {TableInputComponent} from '../../shared/components/table-input/table-input.component';
import {AuthenticationService} from '../../authentication/services/authentication.service';
import {Role} from '../../../entities/data';
import {CanDeactivateComponent} from '../../shared/components/can-deactivate/can-deactivate.component';
import {EvoppiError} from '../../../entities/notification';

class InteractomeServiceWrapper implements PaginatedDataProvider<Interactome> {
    constructor(private readonly service: InteractomeService) {
    }

    list(options: ListingOptions): Observable<PageData<Interactome>> {
        return this.service.list(options, true);
    }
}

@Component({
    selector: 'app-interactome-list',
    templateUrl: './interactome-list.component.html',
    styleUrls: ['./interactome-list.component.scss']
})
export class InteractomeListComponent extends CanDeactivateComponent implements OnInit, AfterViewInit {
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChildren(TableInputComponent) inputComponents: QueryList<TableInputComponent>;

    columns = ['NAME', 'SOURCE_DB', 'SPECIES', 'ACTIONS'];
    dataSource: MatPaginatedDataSource<Interactome>;

    private requestActive = false;

    constructor(
        private readonly authenticationService: AuthenticationService,
        private readonly interactomeService: InteractomeService
    ) {
        super();
    }

    ngOnInit() {
        this.dataSource = new MatPaginatedDataSource<Interactome>(new InteractomeServiceWrapper(this.interactomeService));
    }

    ngAfterViewInit() {
        const filterFields = TableInputComponent.getFilterValues(this.inputComponents);

        this.dataSource.setControls(this.paginator, this.sort, filterFields);
    }

    public downloadInteractionsTsv(interactome: Interactome): void {
        this.interactomeService.downloadInteractomeTsv(interactome);
    }

    public deleteInteractome(interactome: Interactome): void {
        this.requestActive = true;
        this.interactomeService.deleteInteractome(interactome)
            .subscribe(
                () => {
                    this.requestActive = false;
                    this.dataSource.updatePage();
                },
                () => {
                    this.requestActive = false;
                    EvoppiError.throwOnError(
                        'Error deleting interactome',
                        'An error ocurred when deleting the selected interactome.'
                    )
                }
            );
    }

    public isAdmin(): boolean {
        return this.authenticationService.getUserRole() === Role.ADMIN;
    }

    public isRequestActive(): boolean {
        return this.requestActive;
    }
}
