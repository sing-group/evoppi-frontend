import {AfterViewInit, Component, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {CanDeactivateComponent} from '../../shared/components/can-deactivate/can-deactivate.component';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {TableInputComponent} from '../../shared/components/table-input/table-input.component';
import {MatPaginatedDataSource} from '../../../entities/data-source/mat-paginated-data-source';
import {Predictome} from '../../../entities/bio/predictome.model';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {AuthenticationService} from '../../authentication/services/authentication.service';
import {NotificationService} from '../../notification/services/notification.service';
import {Interactome} from '../../../entities/bio';
import {ConfirmSheetComponent} from '../../material-design/confirm-sheet/confirm-sheet.component';
import {EvoppiError} from '../../../entities/notification';
import {Role} from '../../../entities/data';
import {PredictomeService} from '../services/predictome.service';
import {PaginatedDataProvider} from '../../../entities/data-source/paginated-data-provider';
import {ListingOptions} from '../../../entities/data-source/listing-options';
import {Observable} from 'rxjs';
import {PageData} from '../../../entities/data-source/page-data';
import {StatsService} from '../../main/services/stats.service';

class PredictomeServiceWrapper implements PaginatedDataProvider<Predictome> {
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
    private databaseVersion: string;

    private static readonly COLUMN_TO_FILTER_MAPPER = (column: string) => column + PredictomeListComponent.FILTER_SUFFIX;
    private static readonly FILTER_TO_COLUMN_MAPPER = (filter: string) => filter.replace(PredictomeListComponent.FILTER_SUFFIX, '');

    constructor(
        private readonly bottomSheet: MatBottomSheet,
        private readonly authenticationService: AuthenticationService,
        private readonly predictomeService: PredictomeService,
        private readonly notificationService: NotificationService,
        private readonly statsService: StatsService
    ) {
        super();
    }

    ngOnInit() {
        this.dataSource = new MatPaginatedDataSource<Predictome>(new PredictomeServiceWrapper(this.predictomeService));
        this.statsService.getDatabaseVersion().subscribe(version => {
            this.databaseVersion = version;
        });
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

    public onDownloadInteractionsTsv(predictome: Predictome): void {
        this.predictomeService.downloadInteractomeTsv(predictome);
    }

    public onDeleteInteractome(interactome: Interactome): void {
        this.bottomSheet.open(
            ConfirmSheetComponent,
            {
                data: {
                    title: 'Predictome deletion',
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
                        'An error occurred when deleting the selected predictome.',
                        'Error deleting predictome'
                    )
                }
            );
        this.notificationService.success(
            'Deleting predictome', `Predictome '${interactome.name} is being deleted. This may take some time. Please, be patient.`
        );
    }

    public isAdmin(): boolean {
        return this.authenticationService.getUserRole() === Role.ADMIN;
    }

    public isRequestActive(): boolean {
        return this.requestActive;
    }

    public downloadAllUrl(): string {
        return 'http://static.sing-group.org/EvoPPI/db/predictome/' + this.databaseVersion + '/all-predictomes.zip';
    }
}
