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
import {DistinctResult} from '../../../entities';
import {forkJoin, iif, Observable, of, OperatorFunction} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Work, WorkResult} from '../../../entities/execution';
import {InteractionService} from './interaction.service';
import {WorkStatusService} from './work-status.service';
import {concatMap, map, mapTo, mergeMap} from 'rxjs/operators';
import {EvoppiError} from '../../../entities/notification';
import {PaginatedDataProvider} from '../../../entities/data-source/paginated-data-provider';
import {ListingOptions} from '../../../entities/data-source/listing-options';
import {PageData} from '../../../entities/data-source/page-data';
import {QueryHelper} from '../../../helpers/query.helper';
import {AuthenticationService} from '../../authentication/services/authentication.service';


@Injectable()
export class DistinctResultsService implements PaginatedDataProvider<DistinctResult> {
    private endpoint = environment.evoppiUrl + 'api/user/interaction/result/different';
    private endpointDelete = environment.evoppiUrl + 'api/interaction/result/UUID';
    private endpointSingle = environment.evoppiUrl + 'api/interaction/result/UUID?summarize=true';
    private endpointGuest = environment.evoppiUrl + 'api/interaction/result/different';

    constructor(
        private http: HttpClient,
        private authenticationService: AuthenticationService,
        private interactionService: InteractionService,
        private workStatusService: WorkStatusService
    ) {
    }

    public list(options: ListingOptions): Observable<PageData<DistinctResult>> {
        if (this.authenticationService.isGuest()) {
            return this.listGuestResults(options);
        } else {
            return this.listResults(options);
        }
    }

    private listResults(options: ListingOptions): Observable<PageData<DistinctResult>> {
        const params = QueryHelper.listingOptionsToHttpParams(options);

        return this.http.get<WorkResult[]>(this.endpoint, {params, observe: 'response'})
            .pipe(
                mergeMap(response => iif(() => response.body.length > 0,
                    of(response).pipe(this.completeAndMapWorkResultToDistinctResults()),
                    of(response).pipe(mapTo(PageData.EMPTY_PAGE))
                )),
                EvoppiError.throwOnError(
                    'Error distinct species result',
                    'The list of distinct species results could not be retrieved from the backend.'
                )
            );
    }

    private listGuestResults(options: ListingOptions): Observable<PageData<DistinctResult>> {
        const uuids: string[] = this.workStatusService.getLocalWork('distinctWorks').map(result => result.id.id);

        if (uuids.length === 0) {
            return of(new PageData(0, []));
        }

        const params = QueryHelper.listingOptionsToHttpParams(options);
        return this.http.get<WorkResult[]>(this.endpointGuest + '?ids=' + uuids.join(','), {params, observe: 'response'})
            .pipe(
                this.completeAndMapWorkResultToDistinctResults(),
                EvoppiError.throwOnError(
                    'Error distinct species result',
                    'The list of distinct species results could not be retrieved from the backend.'
                )
            );
    }

    private completeAndMapWorkResultToDistinctResults(): OperatorFunction<HttpResponse<WorkResult[]>, PageData<DistinctResult>> {
        return concatMap(response => forkJoin(
            response.body
                .filter((work, index, works) => works.indexOf(work) === index) // Distinct
                .map(workResult => this.workStatusService.getWork(workResult.id)
                    .pipe(map(
                        workStatus => this.mapWorkResultToDistinctResult(workResult, workStatus)
                    ))
                )
            )
                .pipe(
                    map(distinctResults => new PageData(
                        Number(response.headers.get('X-Total-Count')),
                        distinctResults
                    ))
                )
        );
    }

    public getResult(uuid: string): Observable<DistinctResult> {
        return this.http.get<WorkResult>(this.endpointSingle.replace('UUID', uuid))
            .pipe(
                this.completeAndMapWorkResultToDistinctResult(),
                EvoppiError.throwOnError('Error retrieving distinct result', `The result with the id '${uuid}' could not be retrieved.`)
            );
    }

    private completeAndMapWorkResultToDistinctResult(): OperatorFunction<WorkResult, DistinctResult> {
        return mergeMap(
            workResult => this.workStatusService.getWork(workResult.id)
                .pipe(map(
                    workStatus => this.mapWorkResultToDistinctResult(workResult, workStatus)
                ))
        );
    }

    private mapWorkResultToDistinctResult(workResult: WorkResult, work: Work): DistinctResult {
        const noStep = {progress: 0, description: 'Pending'};
        const lastStep = work.steps.reduce((prev, curr) => prev.progress > curr.progress ? prev : curr, noStep);

        return {
            uuid: workResult.id,
            queryGene: workResult.queryGene.name,
            queryGeneId: workResult.queryGene.id,
            maxDegree: workResult.queryMaxDegree,
            referenceSpecies: workResult.referenceSpecies.name,
            targetSpecies: workResult.targetSpecies.name,
            referenceInteractomes: workResult.referenceInteractomes.map(interactome => interactome.name),
            targetInteractomes: workResult.targetInteractomes.map(interactome => interactome.name),
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
