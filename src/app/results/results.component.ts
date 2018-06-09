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

export interface DistinctResults {
    uuid: string,
    referenceSpecies: string,
    targetSpecies: string,
    referenceInteractomes: string[],
    targetInteractomes: string[],
    progress: number,
    status: string
}

export interface SameResults {
    uuid: string,
    species: string,
    interactomes: string[],
    progress: number,
    status: string
}

const DISTINCT_RESULTS: DistinctResults[] = [
    {
        uuid: '3e61aab7-5e32-4c65-89ad-e837f1fb55bd',
        referenceSpecies: 'Homo sapiens',
        targetSpecies: 'Drosophila Melanogaster',
        referenceInteractomes: ['A', 'B', 'C'],
        targetInteractomes: ['X', 'Y', 'Z'],
        progress: 0.6,
        status: 'Calculating interactome X interactions'
    },
    {
        uuid: '564163b7-d299-4a6b-9cbf-abf363d8906d',
        referenceSpecies: 'Drosophila Melanogaster',
        targetSpecies: 'Homo sapiens',
        referenceInteractomes: ['A'],
        targetInteractomes: ['W', 'X', 'Y', 'Z'],
        progress: 1,
        status: '12,000 interactions found'
    }
];

const SAME_RESULTS: SameResults[] = [
    {
        uuid: 'a59f3e69-af3d-4fe8-8437-d7bb139f5459',
        species: 'Homo sapiens',
        interactomes: ['A', 'B', 'C'],
        progress: 0.6,
        status: 'Calculating interactome A interactions'
    },
    {
        uuid: '42676d45-dbb5-4392-9c2d-b04b74e26c37',
        species: 'Drosophila Melanogaster',
        interactomes: ['W', 'X', 'Y', 'Z'],
        progress: 1,
        status: '1,234 interactions found'
    }
];

@Component({
    selector: 'app-results',
    templateUrl: './results.component.html',
    styleUrls: ['./results.component.scss']
})
export class ResultsComponent implements OnInit {

    constructor(private route: ActivatedRoute) {
    }

    ngOnInit() {
    }

    get sameSpeciesResults(): SameResults[] {
        return SAME_RESULTS;
    }

    get distinctSpeciesResults(): DistinctResults[] {
        return DISTINCT_RESULTS;
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
