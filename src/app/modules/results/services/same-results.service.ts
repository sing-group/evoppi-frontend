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

import {Injectable} from '@angular/core';
import {SameResult} from '../../../entities';
import {Observable, of, OperatorFunction} from 'rxjs';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {concatMap, map} from 'rxjs/operators';
import {Work, WorkResult} from '../../../entities/execution';
import {InteractionService} from './interaction.service';
import {WorkStatusService} from './work-status.service';
import {EvoppiError} from '../../../entities/notification';
import {PaginatedDataProvider} from '../../../entities/data-source/paginated-data-provider';
import {PageData} from '../../../entities/data-source/page-data';
import {ListingOptions} from '../../../entities/data-source/listing-options';
import {QueryHelper} from '../../../helpers/query.helper';
import {forkJoin} from 'rxjs/internal/observable/forkJoin';
import {AuthenticationService} from '../../authentication/services/authentication.service';


@Injectable()
export class SameResultsService implements PaginatedDataProvider<SameResult> {
    private endpoint = environment.evoppiUrl + 'api/user/interaction/result/same';
    private endpointDelete = environment.evoppiUrl + 'api/interaction/result/UUID';
    private endpointSingle = environment.evoppiUrl + 'api/interaction/result/UUID?summarize=true';
    private endpointGuest = environment.evoppiUrl + 'api/interaction/result/same';

    constructor(
        private http: HttpClient,
        private authenticationService: AuthenticationService,
        private interactionService: InteractionService,
        private workStatusService: WorkStatusService
    ) {
    }

    public list(options: ListingOptions): Observable<PageData<SameResult>> {
        if (this.authenticationService.isGuest()) {
            return this.listGuestResults(options);
        } else {
            return this.listResults(options);
        }
    }

    private listResults(options: ListingOptions): Observable<PageData<SameResult>> {
        const params = QueryHelper.listingOptionsToHttpParams(options);

        return this.http.get<WorkResult[]>(this.endpoint, {params, observe: 'response'})
            .pipe(
                this.completeAndMapWorkResultToSameResults(),
                EvoppiError.throwOnError(
                    'Error same species result',
                    'The list of same species results could not be retrieved from the backend.'
                )
            );
    }

    private listGuestResults(options: ListingOptions): Observable<PageData<SameResult>> {
        const uuids: string[] = this.workStatusService.getLocalWork('sameWorks').map(result => result.id.id);

        if (uuids.length === 0) {
            return of(new PageData(0, []));
        }

        const params = QueryHelper.listingOptionsToHttpParams(options);
        return this.http.get<WorkResult[]>(this.endpointGuest + '?ids=' + uuids.join(','), {params, observe: 'response'})
            .pipe(
                this.completeAndMapWorkResultToSameResults(),
                EvoppiError.throwOnError(
                    'Error same species result',
                    'The list of same species results could not be retrieved from the backend.'
                )
            );
    }

    private completeAndMapWorkResultToSameResults(): OperatorFunction<HttpResponse<WorkResult[]>, PageData<SameResult>> {
        return concatMap(response => forkJoin(
            response.body
                .filter((work, index, works) => works.indexOf(work) === index) // Distinct
                .map(workResult => this.workStatusService.getWork(workResult.id)
                    .pipe(map(
                        workStatus => this.mapWorkResultToSameResult(workResult, workStatus)
                    ))
                )
            )
                .pipe(
                    map(sameResults => {
                        return new PageData(
                            Number(response.headers.get('X-Total-Count')),
                            sameResults
                        );
                    })
                )
        );
    }

    public getResult(uuid: string): Observable<SameResult> {
        return this.http.get<WorkResult>(this.endpointSingle.replace('UUID', uuid))
            .pipe(
                this.completeAndMapWorkResultToSameResult(),
                EvoppiError.throwOnError(
                    'Error retrieving same result',
                    `The result with the id '${uuid}' could not be retrieved from the backend.`
                )
            );
    }

    private completeAndMapWorkResultToSameResult(): OperatorFunction<WorkResult, SameResult> {
        return concatMap(
            workResult => this.workStatusService.getWork(workResult.id)
                .pipe(map(
                    workStatus => this.mapWorkResultToSameResult(workResult, workStatus)
                ))
        );
    }

    private mapWorkResultToSameResult(workResult: WorkResult, work: Work): SameResult {
        const noStep = { progress: 0, description: 'Pending' };
        const lastStep = work.steps.reduce((prev, curr) => prev.progress > curr.progress ? prev : curr, noStep);

        return {
            uuid: workResult.id,
            queryGene: workResult.queryGene.name,
            queryGeneId: workResult.queryGene.id,
            maxDegree: workResult.queryMaxDegree,
            species: workResult.species.name,
            interactomes: workResult.interactomes.map(interactome => interactome.name),
            progress: lastStep.progress,
            lastAction: lastStep.description,
            status: work.status,
            creation: work.creationDateTime
        };
    }

    public deleteResult(uuid: string): Observable<void> {
        return this.http.delete(this.endpointDelete.replace('UUID', uuid))
            .pipe(
                EvoppiError.throwOnError('Error deleting same result', `The result with the id '${uuid}' could not be deleted.`)
            );
    }
}
