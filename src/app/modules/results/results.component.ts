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

import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {DistinctResult, Result, SameResult} from '../../entities';
import {DistinctResultsService} from './services/distinct-results.service';
import {SameResultsService} from './services/same-results.service';
import {animate, style, transition, trigger} from '@angular/animations';
import {NotificationService} from '../notification/services/notification.service';
import {ConfirmSheetComponent} from '../material-design/confirm-sheet/confirm-sheet.component';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {WorkStatusService} from './services/work-status.service';
import {Location} from '@angular/common';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatPaginatedDataSource} from '../../entities/data-source/mat-paginated-data-source';
import {map, mergeMap, switchMap} from 'rxjs/operators';
import {forkJoin, interval} from 'rxjs';
import {ObservableInput} from 'rxjs/internal/types';
import {Status, Work} from '../../entities/execution';
import {AuthenticationService} from '../authentication/services/authentication.service';

@Component({
    selector: 'app-results',
    templateUrl: './results.component.html',
    styleUrls: ['./results.component.scss'],
    animations: [
        trigger('slideInOut', [
            transition(':enter', [
                style({transform: 'translateY(-100%)'}),
                animate('100ms ease-in', style({transform: 'translateY(0%)'}))
            ]),
            transition(':leave', [
                animate('300ms ease-in', style({transform: 'translateY(-100%)'}))
            ])
        ])
    ]
})
export class ResultsComponent implements OnInit, AfterViewInit {
    @ViewChild('samePaginator') samePaginator: MatPaginator;
    @ViewChild('sameSort') sameSort: MatSort;

    sameColumns = [
        'SCHEDULING_DATE_TIME', 'QUERY_GENE', 'MAX_DEGREE', 'SPECIES', 'INTERACTOMES_COUNT', 'STATUS', 'ACTIONS'
    ];

    @ViewChild('distinctPaginator') distinctPaginator: MatPaginator;
    @ViewChild('distinctSort') distinctSort: MatSort;

    distinctColumns = [
        'SCHEDULING_DATE_TIME', 'QUERY_GENE', 'MAX_DEGREE', 'REFERENCE_SPECIES', 'TARGET_SPECIES', 'INTERACTOMES_COUNT', 'STATUS', 'ACTIONS'
    ];

    sameDataSource: MatPaginatedDataSource<SameResult>;
    distinctDataSource: MatPaginatedDataSource<DistinctResult>;

    constructor(
        private route: ActivatedRoute,
        private distinctResultsService: DistinctResultsService,
        private sameResultsService: SameResultsService,
        private notificationService: NotificationService,
        private bottomSheet: MatBottomSheet,
        private workStatusService: WorkStatusService,
        private readonly authenticationService: AuthenticationService,
        public location: Location
    ) {
    }

    ngOnInit() {
        this.sameDataSource = new MatPaginatedDataSource<SameResult>(this.sameResultsService);
        this.distinctDataSource = new MatPaginatedDataSource<DistinctResult>(this.distinctResultsService);
    }

    ngAfterViewInit() {
        setTimeout(() => {
            this.sameDataSource.setControls(this.samePaginator, this.sameSort);
            this.distinctDataSource.setControls(this.distinctPaginator, this.distinctSort);

            this.checkForStatusChanges(this.sameDataSource);
            this.checkForStatusChanges(this.distinctDataSource);
        });
    }

    private checkForStatusChanges(dataSource: MatPaginatedDataSource<Result>) {
        dataSource.data$
            .pipe(
                switchMap(results => interval(5000).pipe(
                    map(() => results.filter(result => this.isAlive(result)))
                )),
                mergeMap(results =>
                    forkJoin(<ObservableInput<Work>[]>results.map(result => this.workStatusService.getWork(result.uuid)))
                        .pipe(
                            map(works => works.map((work, index) => ({result: results[index], work})))
                        )
                )
            )
            .subscribe(resultsAndWorks => {
                for (const resultAndWork of resultsAndWorks) {
                    const result = resultAndWork.result;
                    const work = resultAndWork.work;

                    const noStep = {progress: 0, description: 'Pending'};
                    const lastStep = work.steps.reduce((prev, curr) => prev.progress > curr.progress ? prev : curr, noStep);

                    result.status = work.status;
                    result.progress = lastStep.progress;
                    result.lastAction = lastStep.description;
                }
            });
    }

    public isAlive(result: Result): boolean {
        return result.status !== Status.COMPLETED && result.status !== Status.FAILED;
    }

    public isCompleted(result: Result): boolean {
        return result.status === Status.COMPLETED;
    }

    public buildSamePermalink(result: SameResult): string {
        return this.location.normalize('/result/table/same/' + result.uuid);
    }

    public buildDistinctPermalink(result: DistinctResult): string {
        return this.location.normalize('/result/table/distinct/' + result.uuid);
    }

    public getDistinctSpeciesChartPath(uuid: string): string {
        return this.route.routeConfig.data.chartDistinctSpeciesPath.replace(/\{0\}/, uuid);
    }

    public getSameSpeciesChartPath(uuid: string): string {
        return this.route.routeConfig.data.chartSameSpeciesPath.replace(/\{0\}/, uuid);
    }

    public getDistinctSpeciesTablePath(uuid: string): string {
        return this.route.routeConfig.data.tableDistinctSpeciesPath.replace(/\{0\}/, uuid);
    }

    public getSameSpeciesTablePath(uuid: string): string {
        return this.route.routeConfig.data.tableSameSpeciesPath.replace(/\{0\}/, uuid);
    }

    public deleteDistinctResult(uuid: string): void {
        this.askToConfirmResultDeletion('distinct', () => this.requestDeleteDistinct(uuid));
    }

    public deleteSameResult(uuid: string): void {
        this.askToConfirmResultDeletion('same', () => this.requestDeleteSame(uuid));
    }

    private askToConfirmResultDeletion(type: string, deleteResult: () => void): void {
        this.bottomSheet.open(
            ConfirmSheetComponent,
            {
                data: {
                    title: 'Delete result',
                    message: `You are about to delete a ${type.toLowerCase()} species interactions result. Do you want to continue?`
                }
            }
        ).afterDismissed().subscribe(confirmed => {
            if (confirmed) {
                deleteResult();
            }
        });
    }

    private requestDeleteDistinct(uuid: string) {
        if (this.authenticationService.isGuest()) {
            this.workStatusService.removeLocalWork('distinctWorks', uuid);
            this.distinctDataSource.updatePage();
            this.notificationService.success('Local result deleted', `Distinct species result '${uuid}' deleted.`);
        } else {
            this.distinctResultsService.deleteResult(uuid)
                .subscribe(
                    () => {
                        this.distinctDataSource.updatePage();
                        this.notificationService.success('Result deleted', `Distinct species result '${uuid}' deleted.`);
                    }
                );
        }
    }

    private requestDeleteSame(uuid: string) {
        if (this.authenticationService.isGuest()) {
            this.workStatusService.removeLocalWork('sameWorks', uuid);
            this.sameDataSource.updatePage();
            this.notificationService.success('Local result deleted', `Same species result '${uuid}' deleted.`);
        } else {
            this.sameResultsService.deleteResult(uuid)
                .subscribe(
                    () => {
                        this.sameDataSource.updatePage();
                        this.notificationService.success('Result deleted', `Same species result '${uuid}' deleted.`);
                    }
                );
        }
    }
}
