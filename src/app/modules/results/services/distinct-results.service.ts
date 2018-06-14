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

import {Injectable} from '@angular/core';
import {DistinctResult} from '../../../entities';
import {of} from 'rxjs/observable/of';
import {Observable} from 'rxjs/Observable';

const DISTINCT_RESULTS: DistinctResult[] = [
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

@Injectable()
export class DistinctResultsService {

    constructor() {
    }

    public getResults(): Observable<DistinctResult[]> {
        return of(DISTINCT_RESULTS);
    }

}
