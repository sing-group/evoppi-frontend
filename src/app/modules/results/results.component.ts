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

import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {DistinctResult, SameResult} from '../../entities';
import {DistinctResultsService} from './services/distinct-results.service';
import {SameResultsService} from './services/same-results.service';
import {animate, style, transition, trigger} from '@angular/animations';
import {asyncScheduler, Observable} from 'rxjs';
import {NotificationService} from '../notification/services/notification.service';
import {ConfirmSheetComponent} from '../material-design/confirm-sheet/confirm-sheet.component';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import {AuthenticationService} from '../authentication/services/authentication.service';
import {WorkStatusService} from './services/work-status.service';
import {Location} from '@angular/common';

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
export class ResultsComponent implements OnInit {
    private sameResults: SameResult[] = [];
    private distinctResults: DistinctResult[] = [];

    public loadingDistinct = false;
    public loadingSame = false;

    private static readonly RESULT_COMPARATOR = (a: DistinctResult | SameResult, b: DistinctResult | SameResult) => {
        if (a.creation === b.creation) {
            return a.uuid < b.uuid ? -1 : 1;
        } else {
            return a.creation < b.creation ? -1 : 1;
        }
    };

    constructor(
        private route: ActivatedRoute,
        private distinctResultsService: DistinctResultsService,
        private sameResultsService: SameResultsService,
        private notificationService: NotificationService,
        private bottomSheet: MatBottomSheet,
        private authenticationService: AuthenticationService,
        private workStatusService: WorkStatusService,
        public location: Location
    ) {
    }

    ngOnInit() {
        this.loadingDistinct = true;
        this.loadingSame = true;

        let distinctObservable: Observable<DistinctResult[]>;
        let sameObservable: Observable<SameResult[]>;
        if (this.authenticationService.isGuest()) {
            distinctObservable = this.distinctResultsService.getResultsGuest();
            sameObservable = this.sameResultsService.getResultsGuest();
        } else {
            distinctObservable = this.distinctResultsService.getResults();
            sameObservable = this.sameResultsService.getResults();
        }

        distinctObservable
            .subscribe(
                resultsDistinct => {
                    this.distinctResults = resultsDistinct.sort(ResultsComponent.RESULT_COMPARATOR);
                    this.distinctResults.filter(result => result.progress < 1)
                        .forEach(result => this.scheduleResultUpdate(result, uuid => this.distinctResultsService.getResult(uuid)));
                    this.loadingDistinct = false;
                },
                error => {
                    this.loadingDistinct = false;
                    throw error;
                }
            );

        sameObservable
            .subscribe(
                resultsSame => {
                    this.sameResults = resultsSame.sort(ResultsComponent.RESULT_COMPARATOR);
                    this.sameResults.filter(result => result.progress < 1)
                        .forEach(result => this.scheduleResultUpdate(result, uuid => this.sameResultsService.getResult(uuid)));
                    this.loadingSame = false;
                },
                error => {
                    this.loadingSame = false;
                    throw error;
                }
            );
    }

    private scheduleResultUpdate<R extends DistinctResult | SameResult, S extends (string) => Observable<R>>(result: R, resultGetter: S) {
        asyncScheduler.schedule(() => {
            resultGetter(result.uuid)
                .subscribe(
                    resultSame => {
                        result.progress = resultSame.progress;
                        result.status = resultSame.status;

                        if (result.status !== 'COMPLETED') {
                            this.scheduleResultUpdate(result, resultGetter);
                        }
                    }
                )
        }, 5000);
    }

    public get sameSpeciesResults(): SameResult[] {
        return this.sameResults;
    }

    public get distinctSpeciesResults(): DistinctResult[] {
        return this.distinctResults;
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
        const resultToDelete = this.distinctResults.find(result => result.uuid === uuid);
        const resultToDeleteIndex = this.distinctResults.indexOf(resultToDelete);
        this.distinctResults.splice(resultToDeleteIndex, 1);

        if ( this.authenticationService.isGuest() ) {
            this.workStatusService.removeLocalWork('distinctWorks', uuid);
            this.notificationService.success('Local result deleted', `Distinct species result '${uuid}' deleted.`);
        } else {
            this.distinctResultsService.deleteResult(uuid)
                .subscribe(
                    () => this.notificationService.success('Result deleted', `Distinct species result '${uuid}' deleted.`),
                    () => {
                        this.distinctResults.push(resultToDelete);
                        this.distinctResults.sort(ResultsComponent.RESULT_COMPARATOR);
                    }
                );
        }
    }

    private requestDeleteSame(uuid: string) {
        const resultToDelete = this.sameResults.find(result => result.uuid === uuid);
        const resultToDeleteIndex = this.sameResults.indexOf(resultToDelete);
        this.sameResults.splice(resultToDeleteIndex, 1);

        if ( this.authenticationService.isGuest() ) {
            this.workStatusService.removeLocalWork('sameWorks', uuid);
            this.notificationService.success('Local result deleted', `Same species result '${uuid}' deleted.`);
        } else {
            this.sameResultsService.deleteResult(uuid)
                .subscribe(
                    () => this.notificationService.success('Result deleted', `Same species result '${uuid}' deleted.`),
                    () => {
                        this.sameResults.push(resultToDelete);
                        this.sameResults.sort(ResultsComponent.RESULT_COMPARATOR);
                    }
                );
        }
    }
}
