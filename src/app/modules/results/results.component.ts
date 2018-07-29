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
import {zip} from 'rxjs/observable/zip';
import {interval} from 'rxjs/observable/interval';
import {Subscription} from 'rxjs/Subscription';
import {animate, style, transition, trigger} from '@angular/animations';

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
    private sameResults: SameResult[];
    private distinctResults: DistinctResult[];

    loading = false;

    constructor(
        private route: ActivatedRoute,
        private distinctResultsService: DistinctResultsService,
        private sameResultsService: SameResultsService
    ) {
    }

    ngOnInit() {
        this.refresh();
    }

    refresh() {
        this.loading = true;
        zip(
            this.distinctResultsService.getResults(),
            this.sameResultsService.getResults(),
        ).subscribe(result => {
            this.distinctResults = result[0];
            this.sameResults = result[1];
        }, error => {
            console.log("Error retrieving results", error);
        }, () => {
            this.loading = false;
            const subscriptionInterval: Subscription = interval(5000).subscribe(() => {
                subscriptionInterval.unsubscribe();
                this.refresh();
            });
        });

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
