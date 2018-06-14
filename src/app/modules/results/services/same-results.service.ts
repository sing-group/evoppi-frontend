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

import { Injectable } from '@angular/core';
import {SameResult} from '../../../entities';
import {of} from 'rxjs/observable/of';
import {Observable} from 'rxjs/Observable';

const SAME_RESULTS: SameResult[] = [
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

@Injectable()
export class SameResultsService {

  constructor() { }

    public getResults(): Observable<SameResult[]> {
        return of(SAME_RESULTS);
    }

}
