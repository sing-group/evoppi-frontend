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
import {NotificationService} from '../../notification/services/notification.service';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {ConfirmSheetComponent} from '../../material-design/confirm-sheet/confirm-sheet.component';
import {DatabaseInteractomeService} from '../services/database-interactome.service';
import {DatabaseInteractome} from '../../../entities/bio/database-interactome.model';
import {StatsService} from '../../main/services/stats.service';

class InteractomeServiceWrapper implements PaginatedDataProvider<DatabaseInteractome> {
    constructor(private readonly service: DatabaseInteractomeService) {
    }

    list(options: ListingOptions): Observable<PageData<DatabaseInteractome>> {
        return this.service.list(options, true);
    }
}

@Component({
    selector: 'app-database-interactome-list',
    templateUrl: './database-interactome-list.component.html',
    styleUrls: ['./database-interactome-list.component.scss']
})
export class DatabaseInteractomeListComponent extends CanDeactivateComponent implements OnInit, AfterViewInit {
    private static readonly FILTER_SUFFIX = '_FILTER';

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChildren(TableInputComponent) inputComponents: QueryList<TableInputComponent>;

    columns = ['SPECIESA', 'NAME', 'ACTIONS'];
    dataSource: MatPaginatedDataSource<DatabaseInteractome>;

    private requestActive = false;
    private databaseVersion: string;

    private static readonly COLUMN_TO_FILTER_MAPPER = (column: string) => column + DatabaseInteractomeListComponent.FILTER_SUFFIX;
    private static readonly FILTER_TO_COLUMN_MAPPER = (filter: string) => filter.replace(DatabaseInteractomeListComponent.FILTER_SUFFIX, '');

    constructor(
        private readonly bottomSheet: MatBottomSheet,
        private readonly authenticationService: AuthenticationService,
        private readonly databaseInteractomeService: DatabaseInteractomeService,
        private readonly notificationService: NotificationService,
        private readonly statsService: StatsService
    ) {
        super();
    }

    ngOnInit() {
        this.dataSource = new MatPaginatedDataSource<DatabaseInteractome>(new InteractomeServiceWrapper(this.databaseInteractomeService));
        this.statsService.getDatabaseVersion().subscribe(version => {
            this.databaseVersion = version;
        });
    }

    ngAfterViewInit() {
        const filterFields = TableInputComponent.getFilterValues(
            this.inputComponents,
            DatabaseInteractomeListComponent.FILTER_TO_COLUMN_MAPPER
        );

        this.dataSource.setControls(this.paginator, this.sort, filterFields);
    }

    public get columnFilters(): string[] {
        return this.columns.map(DatabaseInteractomeListComponent.COLUMN_TO_FILTER_MAPPER);
    }

    public onDownloadInteractionsTsv(interactome: DatabaseInteractome): void {
        this.databaseInteractomeService.downloadInteractomeTsv(interactome);
    }

    public onDeleteInteractome(interactome: Interactome): void {
        this.bottomSheet.open(
            ConfirmSheetComponent,
            {
                data: {
                    title: 'Interactome deletion',
                    message: `Interactome '${interactome.name}' and all the related information will be deleted. Do you want to continue?`,
                    confirmLabel: 'Yes',
                    cancelLabel: 'No'
                }
            }
        ).afterDismissed().subscribe(confirmed => {
            if (confirmed) {
                this.deleteInteractome(interactome);
            }
        });
    }

    private deleteInteractome(interactome: Interactome): void {
        this.requestActive = true;
        this.databaseInteractomeService.deleteInteractome(interactome)
            .subscribe(
                () => {
                    this.requestActive = false;
                    this.dataSource.updatePage();
                    this.notificationService.success('Interactome deleted', `Interactome '${interactome.name} was deleted.`);
                },
                () => {
                    this.requestActive = false;
                    EvoppiError.throwOnError(
                        'An error ocurred when deleting the selected interactome.',
                        'Error deleting interactome'
                    )
                }
            );
        this.notificationService.success(
            'Deleting interactome', `Interactome '${interactome.name} is being deleted. This may take some time. Please, be patient.`
        );
    }

    public isAdmin(): boolean {
        return this.authenticationService.getUserRole() === Role.ADMIN;
    }

    public isRequestActive(): boolean {
        return this.requestActive;
    }

    public downloadAllUrl(): string {
        return 'http://static.sing-group.org/EvoPPI/db/interactome/' + this.databaseVersion + '/all-interactomes.zip';
    }
}
