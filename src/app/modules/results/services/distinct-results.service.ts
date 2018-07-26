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
import {Observable} from 'rxjs/Observable';
import {ErrorHelper} from '../../../helpers/error.helper';
import {environment} from '../../../../environments/environment';
import {catchError} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {forkJoin} from 'rxjs/observable/forkJoin';
import {WorkResult} from '../../../entities/execution';
import {InteractionService} from './interaction.service';



@Injectable()
export class DistinctResultsService {

    private endpoint = environment.evoppiUrl + 'api/user/interaction/result/different';

    constructor(private http: HttpClient, private interactionService: InteractionService) {
    }

    public getResults(): Observable<DistinctResult[]> {
        return this.http.get<WorkResult[]>(this.endpoint)
            .mergeMap (
                workResults => {
                    const observables: Observable<WorkResult>[] = [];
                    workResults.forEach(workResult => {
                        observables.push(this.interactionService.retrieveWorkInteractomes(workResult));
                    });
                    return forkJoin(observables);
                }

            )
            .map( workResults => {
                const distinctResult: DistinctResult[] = [];
                workResults.forEach(workResult => {
                    distinctResult.push({
                        uuid: workResult.id,
                        referenceSpecies: workResult.referenceInteractomes[0].species.name,
                        targetSpecies: workResult.targetInteractomes[0].species.name,
                        referenceInteractomes: workResult.referenceInteractomes.map(interactome => interactome.name),
                        targetInteractomes: workResult.targetInteractomes.map(interactome => interactome.name),
                        progress: workResult.status === 'COMPLETED' ? 1 : 0.5, // TODO
                        status: workResult.status
                    });
                });
                return distinctResult;
            })
            .pipe(
                catchError(ErrorHelper.handleError('DistinctResultsService.getResults', []))
            );
    }

}
