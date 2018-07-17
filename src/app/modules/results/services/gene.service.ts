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
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {catchError} from 'rxjs/operators';
import {forkJoin} from 'rxjs/observable/forkJoin';
import {of} from 'rxjs/observable/of';
import {environment} from '../../../../environments/environment';
import {Gene, GeneInfo} from '../../../entities/bio';
import {ErrorHelper} from '../../../helpers/error.helper';

@Injectable()
export class GeneService {

  private endpoint = environment.evoppiUrl + 'api/gene';
  constructor(private http: HttpClient) { }

  public static getFirstName(geneInfo: GeneInfo | Gene): string {
    if (geneInfo && geneInfo.names && geneInfo.names.length > 0 && geneInfo.names[0].names.length > 0) {
      return geneInfo.names[0].names[0];
    } else {
      return '';
    }
  }

  getGeneName(prefix: string, interactomes: number[] = [], limit: number = 10): Observable<GeneInfo[]> {

    const params: any = {prefix: prefix, interactome: interactomes, maxResults: limit};

    return this.http.get<GeneInfo[]>(this.endpoint + '/name', {params : params})
      .pipe(
        catchError(ErrorHelper.handleError('getGeneName', []))
      );
  }

  getGeneNames(genes: Gene[]): Observable<GeneInfo[]> {
    const observables: Observable<GeneInfo>[] = [];
    for (const gene of genes) {
      observables.push(<Observable<GeneInfo>> this.http.get(this.endpoint + '/' + gene.geneId + '/name'));
    }
    return forkJoin(observables);
  }

  getGene(id: number): Observable<Gene> {

    return this.http.get<Gene>(this.endpoint + '/' + id)
      .pipe(
        catchError(ErrorHelper.handleError('getGene', null))
      );
  }

  getGenes(ids: number[]): Observable<Gene[]> {
    if (ids.length === 0) {
      return of([]);
    } else {
      return this.http.get<Gene>(this.endpoint + '?ids=' + ids.join(','))
        .pipe(
          catchError(ErrorHelper.handleError('getGene', null))
        );
    }
  }

}