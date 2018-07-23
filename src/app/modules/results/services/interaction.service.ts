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
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {catchError} from 'rxjs/operators';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/concatMap';
import 'rxjs/add/operator/combineAll';
import {from} from 'rxjs/observable/from';
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/mergeAll';
import 'rxjs/add/operator/concatAll';
import 'rxjs/add/operator/combineAll';
import 'rxjs/add/operator/combineLatest';
import {forkJoin} from 'rxjs/observable/forkJoin';
import {environment} from '../../../../environments/environment';
import {GeneService} from './gene.service';
import {InteractomeService} from './interactome.service';
import {ErrorHelper} from '../../../helpers/error.helper';
import {OrderField, SortDirection} from '../../../entities/data';
import {SummarizedWorkResult, Work, WorkResult} from '../../../entities/execution';


@Injectable()
export class InteractionService {

  private endpoint = environment.evoppiUrl + 'api/interaction';

  constructor(protected http: HttpClient, protected geneService: GeneService, protected interactomeService: InteractomeService) { }


  getSameSpeciesInteraction(gene: number, interactomes: number[], interactionLevel: number): Observable<Work> {

    const params: any = {gene: gene, interactome: interactomes, maxDegree: interactionLevel};

    return this.http.get<Work>(this.endpoint, {params : params});
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

    return this.http.get<Work>(this.endpoint, {params : params});
  }

  getInteractionResultSummarized(uri: string): Observable<SummarizedWorkResult> {
    return this.http.get<WorkResult>(uri + '?summarize=true')
      .mergeMap(this.retrieveWorkInteractomes.bind(this))
      .pipe(
        catchError(ErrorHelper.handleError('getInteractionResultSummarized', null))
      );
  }

  getInteractionResult(uri: string): Observable<WorkResult> {
    return this.http.get<WorkResult>(uri)
      .mergeMap(this.retrieveWorkInteractomes.bind(this))
      .pipe(
        catchError(ErrorHelper.handleError('getInteractionResult', null))
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
      }})
      .pipe(
        catchError(ErrorHelper.handleError('getInteractions', null))
      );
  }

  public retrieveWorkInteractomes(workResult: WorkResult): Observable<WorkResult> {
    if (workResult.interactomes) {
      return forkJoin(
        from(workResult.interactomes)
          .mergeMap(
            interactome => this.interactomeService.getInteractome(interactome.id, true)
          )
          .combineLatest(interactome => {
            const index = workResult.interactomes.findIndex(it => it.id === interactome.id);

            workResult.interactomes[index] = interactome;

            return workResult;
          })
      ).map(workResults => workResults[0]);
    } else if (workResult.referenceInteractomes && workResult.targetInteractomes) {
      return forkJoin(
        from( workResult.referenceInteractomes )
          .mergeMap(interactome => this.interactomeService.getInteractome(interactome.id, true))
          .combineLatest(interactome => {
            const index = workResult.referenceInteractomes.findIndex(x => x.id === interactome.id);
            if (index !== -1) {
              workResult.referenceInteractomes[index] = interactome;
            } else {
              throw TypeError('Reference interactome not found: ' + interactome.id);
            }

            return workResult;
          }),
        from( workResult.targetInteractomes )
          .mergeMap(interactome => this.interactomeService.getInteractome(interactome.id, true))
          .combineLatest(interactome => {
            const index = workResult.targetInteractomes.findIndex(x => x.id === interactome.id);
            if (index !== -1) {
              workResult.targetInteractomes[index] = interactome;
            } else {
              throw TypeError('Target interactome not found: ' + interactome.id);
            }

            return workResult;
          })
        ).map(workResults => workResults[0]);
    } else {
      throw TypeError('Invalid work result. Missing interactomes.');
    }
  }
}
