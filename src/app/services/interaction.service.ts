/*
 *  EvoPPI Frontend
 *
 *  Copyright (C) 2017-2018 - Noé Vázquez González,
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
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {ErrorHelper} from '../helpers/error.helper';
import {catchError} from 'rxjs/operators';
import {Work} from '../interfaces/work';
import {WorkResult} from '../interfaces/work-result';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/concatMap';
import 'rxjs/add/operator/combineAll';
import {from} from 'rxjs/observable/from';
import {GeneService} from './gene.service';
import {InteractomeService} from './interactome.service';
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/mergeAll';
import 'rxjs/add/operator/concatAll';
import 'rxjs/add/operator/combineAll';
import 'rxjs/add/operator/combineLatest';
import {forkJoin} from 'rxjs/observable/forkJoin';


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

  getInteractionResult(uri: string): Observable<WorkResult> {
    return this.http.get<WorkResult>(uri)
      .mergeMap(this.retrieveWorkInteractomes.bind(this))
      .pipe(
        catchError(ErrorHelper.handleError('getInteraction', null))
      );
  }

  private retrieveWorkInteractomes(workResult: WorkResult): Observable<WorkResult> {
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
