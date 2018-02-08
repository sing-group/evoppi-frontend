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

import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {ErrorHelper} from '../helpers/error.helper';
import {catchError} from 'rxjs/operators';
import {Work} from '../interfaces/work';
import {WorkResult} from '../interfaces/work-result';

@Injectable()
export class InteractionService {

  private endpoint = environment.evoppiUrl + 'api/interaction';

  constructor(protected http: HttpClient) { }


  getSameSpeciesInteraction(gene: number, interactomes: number[], interactionLevel: number): Observable<Work> {

    const params: any = {gene: gene, interactome: interactomes, maxDegree: interactionLevel};

    return this.http.get<Work>(this.endpoint, {params : params});
  }

  getDistinctSpeciesInteraction(gene: number, referenceInteractome: number, targetInteractome: number,
                                 interactionLevel: number): Observable<Work> {

    const params: any = {
      gene: gene,
      referenceInteractome: referenceInteractome,
      targetInteractome: targetInteractome,
      maxDegree: interactionLevel};

    return this.http.get<Work>(this.endpoint, {params : params});
  }

  getInteractionResult(uri: string): Observable<WorkResult> {

    return this.http.get<WorkResult>(uri)
      .pipe(
        catchError(ErrorHelper.handleError('getInteraction', null))
      );
  }

}
