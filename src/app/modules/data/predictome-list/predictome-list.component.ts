import {AfterViewInit, Component, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {CanDeactivateComponent} from '../../shared/components/can-deactivate/can-deactivate.component';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {TableInputComponent} from '../../shared/components/table-input/table-input.component';
import {MatPaginatedDataSource} from '../../../entities/data-source/mat-paginated-data-source';
import {Predictome} from '../../../entities/bio/predictome.model';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {AuthenticationService} from '../../authentication/services/authentication.service';
import {DatabaseInteractomeService} from '../services/database-interactome.service';
import {NotificationService} from '../../notification/services/notification.service';
import {Interactome} from '../../../entities/bio';
import {ConfirmSheetComponent} from '../../material-design/confirm-sheet/confirm-sheet.component';
import {EvoppiError} from '../../../entities/notification';
import {Role} from '../../../entities/data';
import {PredictomeService} from '../services/predictome.service';
import {PaginatedDataProvider} from '../../../entities/data-source/paginated-data-provider';
import {DatabaseInteractome} from '../../../entities/bio/database-interactome.model';
import {ListingOptions} from '../../../entities/data-source/listing-options';
import {Observable} from 'rxjs';
import {PageData} from '../../../entities/data-source/page-data';

class InteractomeServiceWrapper implements PaginatedDataProvider<Predictome> {
    constructor(private readonly service: PredictomeService) {
    }

    list(options: ListingOptions): Observable<PageData<Predictome>> {
        return this.service.list(options, true);
    }
}

@Component({
    selector: 'app-predictome-list',
    templateUrl: './predictome-list.component.html',
    styleUrls: ['./predictome-list.component.scss']
})
export class PredictomeListComponent extends CanDeactivateComponent implements OnInit, AfterViewInit {
    private static readonly FILTER_SUFFIX = '_FILTER';

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChildren(TableInputComponent) inputComponents: QueryList<TableInputComponent>;

    columns = ['SPECIESA', 'CONVERSION_DATABASE', 'SOURCE_INTERACTOME', 'ACTIONS'];
    dataSource: MatPaginatedDataSource<Predictome>;

    private requestActive = false;

    private static readonly COLUMN_TO_FILTER_MAPPER = (column: string) => column + PredictomeListComponent.FILTER_SUFFIX;
    private static readonly FILTER_TO_COLUMN_MAPPER = (filter: string) => filter.replace(PredictomeListComponent.FILTER_SUFFIX, '');

    constructor(
        private readonly bottomSheet: MatBottomSheet,
        private readonly authenticationService: AuthenticationService,
        private readonly predictomeService: PredictomeService,
        private readonly notificationService: NotificationService
    ) {
        super();
    }

    ngOnInit() {
        this.dataSource = new MatPaginatedDataSource<Predictome>(new InteractomeServiceWrapper(this.predictomeService));
    }

    ngAfterViewInit() {
        const filterFields = TableInputComponent.getFilterValues(
            this.inputComponents,
            PredictomeListComponent.FILTER_TO_COLUMN_MAPPER
        );

        this.dataSource.setControls(this.paginator, this.sort, filterFields);
    }

    public get columnFilters(): string[] {
        return this.columns.map(PredictomeListComponent.COLUMN_TO_FILTER_MAPPER);
    }

    public onDownloadInteractionsTsv(interactome: Predictome): void {
        this.predictomeService.downloadInteractomeTsv(interactome);
    }

    public onDeleteInteractome(interactome: Interactome): void {
        this.bottomSheet.open(
            ConfirmSheetComponent,
            {
                data: {
                    title: 'Preedictome deletion',
                    message: `Predictome '${interactome.name}' and all the related information will be deleted. Do you want to continue?`,
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
        this.predictomeService.deleteInteractome(interactome)
            .subscribe(
                () => {
                    this.requestActive = false;
                    this.dataSource.updatePage();
                    this.notificationService.success('Predictome deleted', `Predictome '${interactome.name} was deleted.`);
                },
                () => {
                    this.requestActive = false;
                    EvoppiError.throwOnError(
                        'An error ocurred when deleting the selected predictome.',
                        'Error deleting predictome'
                    )
                }
            );
        this.notificationService.success(
            'Deleting interactome', `Predictome '${interactome.name} is being deleted. This may take some time. Please, be patient.`
        );
    }

    public isAdmin(): boolean {
        return this.authenticationService.getUserRole() === Role.ADMIN;
    }

    public isRequestActive(): boolean {
        return this.requestActive;
    }
}
