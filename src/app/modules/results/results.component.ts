/*
 *  EvoPPI Frontend
 *
 * Copyright (C) 2017-2018 - Noé Vázquez, Miguel Reboiro-Jato,
 * Jorge Vieria, Sara Rocha, Hugo López-Fernández, André Torres,
 * Rui Camacho, Florentino Fdez-Riverola, and Cristina P. Vieira.
 * .
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 */

import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {DistinctResult, SameResult} from '../../entities';
import {DistinctResultsService} from './services/distinct-results.service';
import {SameResultsService} from './services/same-results.service';
import {animate, style, transition, trigger} from '@angular/animations';
import {asyncScheduler, Observable} from 'rxjs';

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

    constructor(
        private route: ActivatedRoute,
        private distinctResultsService: DistinctResultsService,
        private sameResultsService: SameResultsService
    ) {
    }

    ngOnInit() {
        this.loadingDistinct = true;
        this.distinctResultsService.getResults()
            .subscribe(
                resultsDistinct => {
                    this.distinctResults = resultsDistinct;
                    this.distinctResults.filter(result => result.progress < 1)
                        .forEach(result => this.scheduleResultUpdate(result, uuid => this.distinctResultsService.getResult(uuid)));
                },
                () => {},
                () => this.loadingDistinct = false
            );

        this.loadingSame = true;
        this.sameResultsService.getResults()
            .subscribe(
                resultsSame => {
                    this.sameResults = resultsSame;
                    this.sameResults.filter(result => result.progress < 1)
                        .forEach(result => this.scheduleResultUpdate(result, uuid => this.sameResultsService.getResult(uuid)));
                },
                () => {},
                () => this.loadingSame = false
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

    get sameSpeciesResults(): SameResult[] {
        return this.sameResults;
    }

    get distinctSpeciesResults(): DistinctResult[] {
        return this.distinctResults;
    }

    getDistinctSpeciesChartPath(uuid: string): string {
        return this.route.routeConfig.data.chartDistinctSpeciesPath.replace(/\{0\}/, uuid);
    }

    getSameSpeciesChartPath(uuid: string): string {
        return this.route.routeConfig.data.chartSameSpeciesPath.replace(/\{0\}/, uuid);
    }

    getDistinctSpeciesTablePath(uuid: string): string {
        return this.route.routeConfig.data.tableDistinctSpeciesPath.replace(/\{0\}/, uuid);
    }

    getSameSpeciesTablePath(uuid: string): string {
        return this.route.routeConfig.data.tableSameSpeciesPath.replace(/\{0\}/, uuid);
    }
}
