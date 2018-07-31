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
import {HttpClient} from '@angular/common/http';
import {Work, WorkResult} from '../../../entities/execution';
import {InteractionService} from './interaction.service';
import {WorkStatusService} from './work-status.service';
import {catchError, mergeMap, reduce} from 'rxjs/operators';


@Injectable()
export class DistinctResultsService {

    private endpoint = environment.evoppiUrl + 'api/user/interaction/result/different';
    private endpointSingle = environment.evoppiUrl + 'api/interaction/result/UUID?summarize=true';

    constructor(
        private http: HttpClient,
        private interactionService: InteractionService,
        private workStatusService: WorkStatusService
    ) {
    }

    public getResults(): Observable<DistinctResult[]> {
        return this.http.get<WorkResult[]>(this.endpoint)
            .pipe(
                mergeMap(results => results),
                mergeMap(
                    workResult => this.workStatusService.getWork(workResult.id),
                    (workResult, workStatus) => this.mapWorkResultToDistinctResult(workResult, workStatus)
                ),
                reduce((acc: DistinctResult[], val: DistinctResult) => { acc.push(val); return acc; }, []),
                catchError(ErrorHelper.handleError('DistinctResultsService.getResults', []))
            );
    }

    public getResult(uuid: string): Observable<DistinctResult> {
        return this.http.get<WorkResult>(this.endpointSingle.replace('UUID', uuid))
            .pipe(
                mergeMap(
                    workResult => this.workStatusService.getWork(workResult.id),
                    (workResult, workStatus) => this.mapWorkResultToDistinctResult(workResult, workStatus)
                ),
                catchError(ErrorHelper.handleError('DistinctResultsService.getResults', null))
            );
    }

    private mapWorkResultToDistinctResult(workResult: WorkResult, work: Work): DistinctResult {
        return {
            uuid: workResult.id,
            referenceSpecies: workResult.referenceSpecies.name,
            targetSpecies: workResult.targetSpecies.name,
            referenceInteractomes: workResult.referenceInteractomes.map(interactome => interactome.name),
            targetInteractomes: workResult.targetInteractomes.map(interactome => interactome.name),
            progress: work.steps.map(step => step.progress).reduce((prev, curr) => Math.max(prev, curr), 0),
            status: work.status
        };
    }

}
