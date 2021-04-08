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
import {Status} from '../../../entities/execution';
import {TableInputComponent} from '../../shared/components/table-input/table-input.component';
import {SpeciesService} from '../../results/services/species.service';
import {Species} from '../../../entities/bio';
import {Role} from '../../../entities/data';
import {AuthenticationService} from '../../authentication/services/authentication.service';
import {CanDeactivateComponent} from '../../shared/components/can-deactivate/can-deactivate.component';
import {EvoppiError} from '../../../entities/notification';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {InteractomeService} from '../../results/services/interactome.service';
import {NotificationService} from '../../notification/services/notification.service';
import {ConfirmSheetComponent} from '../../material-design/confirm-sheet/confirm-sheet.component';

@Component({
    selector: 'app-species-list',
    templateUrl: './species-list.component.html',
    styleUrls: ['./species-list.component.scss']
})
export class SpeciesListComponent extends CanDeactivateComponent implements OnInit, AfterViewInit {
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    dataSource: MatPaginatedDataSource<Species>;

    columns = ['NAME', 'INTERACTOMES_COUNT', 'ACTIONS'];

    @ViewChildren(TableInputComponent) inputComponents: QueryList<TableInputComponent>;

    executionStatus = Object.keys(Status);

    private requestActive = false;

    constructor(
        private readonly bottomSheet: MatBottomSheet,
        private readonly authenticationService: AuthenticationService,
        private readonly speciesService: SpeciesService,
        private readonly notificationService: NotificationService
    ) {
        super();
    }

    ngOnInit(): void {
        this.dataSource = new MatPaginatedDataSource<Species>(this.speciesService);
    }

    ngAfterViewInit() {
        const filterFields = TableInputComponent.getFilterValues(this.inputComponents);

        this.dataSource.setControls(this.paginator, this.sort, filterFields);
    }

    public onDownloadSpeciesFasta(species: Species): void {
        this.speciesService.downloadSpeciesFasta(species);
    }

    public onDeleteSpecies(species: Species): void {
        this.bottomSheet.open(
            ConfirmSheetComponent,
            {
                data: {
                    title: 'Species deletion',
                    message: `Species '${species.name}' and all the related information will be deleted. Do you want to continue?`,
                    confirmLabel: 'Yes',
                    cancelLabel: 'No'
                }
            }
        ).afterDismissed().subscribe(confirmed => {
            if (confirmed) {
                this.deleteSpecies(species);
            }
        });
    }

    private deleteSpecies(species: Species): void {
        this.requestActive = true;
        this.speciesService.deleteSpecies(species)
            .subscribe(
                () => {
                    this.requestActive = false;
                    this.dataSource.updatePage();
                    this.notificationService.success('Species deleted', `Species '${species.name} was deleted.`);
                },
                () => {
                    this.requestActive = false;
                    EvoppiError.throwOnError(
                        'Error deleting species',
                        'An error ocurred when deleting the selected species.'
                    )
                }
            );
        this.notificationService.success(
            'Deleting species', `Species '${species.name} is being deleted. This may take some time. Please, be patient.`
        );
    }

    public isAdmin(): boolean {
        return this.authenticationService.getUserRole() === Role.ADMIN;
    }

    public isRequestActive(): boolean {
        return this.requestActive;
    }
}
