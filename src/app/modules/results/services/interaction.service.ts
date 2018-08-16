/*
 *  EvoPPI Frontend
 *
 * Copyright (C) 2017-2018 - Noé Vázquez, Miguel Reboiro-Jato,
 * Jorge Vieria, Sara Rocha, Hugo López-Fernández, André Torres,
 * Rui Camacho, Florentino Fdez-Riverola, and Cristina P. Vieira.
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
import {HttpClient} from '@angular/common/http';
import {concat, from, Observable} from 'rxjs';
import {map, mergeMap, reduce} from 'rxjs/operators';
import {environment} from '../../../../environments/environment';
import {InteractomeService} from './interactome.service';
import {OrderField, SortDirection} from '../../../entities/data';
import {SummarizedWorkResult, Work, WorkResult} from '../../../entities/execution';
import {EvoppiError} from '../../../entities/notification';


@Injectable()
export class InteractionService {

    private endpoint = environment.evoppiUrl + 'api/interaction';

    constructor(protected http: HttpClient, protected interactomeService: InteractomeService) {
    }


    getSameSpeciesInteraction(gene: number, interactomes: number[], interactionLevel: number): Observable<Work> {
        const params: any = {gene: gene, interactome: interactomes, maxDegree: interactionLevel};

        return this.http.get<Work>(this.endpoint, {params: params})
            .pipe(
                EvoppiError.throwOnError(
                    'Error requesting same species interactions',
                    'An error happened while requesting the interactions from same species.'
                )
            );
    }

    getDistinctSpeciesInteraction(gene: number, referenceInteractome: number[], targetInteractome: number[],
                                  interactionLevel: number, evalue: number, maxTargetSeqs: number,
                                  minIdentity: number, minAlignmentLenght: number): Observable<Work> {
        const params: any = {
            gene: gene,
            referenceInteractome: referenceInteractome,
            targetInteractome: targetInteractome,
            maxDegree: interactionLevel,
            evalue: evalue,
            maxTargetSeqs: maxTargetSeqs,
            minIdentity: minIdentity,
            minAlignmentLength: minAlignmentLenght
        };

        return this.http.get<Work>(this.endpoint, {params: params})
            .pipe(
                EvoppiError.throwOnError(
                    'Error requesting distinct species interactions',
                    'An error happened while requesting the interactions from distinct species.'
                )
            );
    }

    getInteractionResultSummarized(uri: string): Observable<SummarizedWorkResult> {
        return this.http.get<WorkResult>(uri + '?summarize=true')
            .pipe(
                mergeMap(this.retrieveWorkInteractomes.bind(this)),
                EvoppiError.throwOnError(
                    'Error requesting interaction results summary',
                    'The results summary for an interaction analysis could not be retrieved from the backend.'
                )
            );
    }

    getInteractionResult(uri: string): Observable<WorkResult> {
        return this.http.get<WorkResult>(uri)
            .pipe(
                mergeMap(this.retrieveWorkInteractomes.bind(this)),
                EvoppiError.throwOnError(
                    'Error requesting interaction results',
                    'The results for an interaction analysis could not be retrieved from the backend.'
                )
            );
    }

    getInteractions(uri: string, page: number = 0, pageSize: number = 10, sortDirection: SortDirection = SortDirection.ASCENDING,
                    orderField: OrderField = OrderField.GENE_A_ID, interactomeId?: number): Observable<WorkResult> {
        return this.http.get<WorkResult>(uri, {
            params: {
                page: page.toString(),
                pageSize: pageSize.toString(),
                sortDirection: sortDirection,
                orderField: orderField,
                ...(interactomeId && {interactomeId: interactomeId.toString()})
            }
        })
            .pipe(
                EvoppiError.throwOnError(
                    'Error requesting interaction',
                    'The interactions for an interaction analysis could not be retrieved from the backend.'
                )
            );
    }

    public retrieveWorkInteractomes(workResult: WorkResult): Observable<WorkResult> {
        if (workResult.interactomes) {
            return from(workResult.interactomes)
                .pipe(
                    mergeMap(
                        interactomeUri => this.interactomeService.getInteractome(interactomeUri.id, true)
                            .pipe(map(
                                interactome => {
                                    const index = workResult.interactomes.findIndex(it => it.id === interactome.id);

                                    if (index !== -1) {
                                        workResult.interactomes[index] = interactome;
                                    } else {
                                        throw TypeError('Interactome not found: ' + interactome.id);
                                    }

                                    return workResult;
                                }
                            ))
                    ),
                    reduce((acc, cur) => cur),
                    EvoppiError.throwOnError(
                        'Error requesting interactomes',
                        `The interactomes of the analysis '${workResult.id}' could not be retrieved from the backend.`
                    )
                );
        } else if (workResult.referenceInteractomes && workResult.targetInteractomes) {
            return concat(
                from(workResult.referenceInteractomes)
                    .pipe(
                        mergeMap(
                            interactomeUri => this.interactomeService.getInteractome(interactomeUri.id, true)
                                .pipe(
                                    map(interactome => {
                                        const index = workResult.referenceInteractomes.findIndex(it => it.id === interactome.id);

                                        if (index !== -1) {
                                            workResult.referenceInteractomes[index] = interactome;
                                        } else {
                                            throw TypeError('Reference interactome not found: ' + interactome.id);
                                        }

                                        return workResult;
                                    })
                                )
                        )
                    ),
                from(workResult.targetInteractomes)
                    .pipe(
                        mergeMap(
                            interactomeUri => this.interactomeService.getInteractome(interactomeUri.id, true)
                                .pipe(
                                    map(interactome => {
                                        const index = workResult.targetInteractomes.findIndex(it => it.id === interactome.id);

                                        if (index !== -1) {
                                            workResult.targetInteractomes[index] = interactome;
                                        } else {
                                            throw TypeError('Target interactome not found: ' + interactome.id);
                                        }

                                        return workResult;
                                    })
                                )
                        )
                    )
            ).pipe(
                reduce((acc, cur) => cur),
                EvoppiError.throwOnError(
                    'Error requesting interactomes',
                    `The interactomes of the analysis '${workResult.id}' could not be retrieved from the backend.`
                )
            );
        } else {
            throw TypeError('Invalid work result. Missing interactomes.');
        }
    }
}
