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
import {GeneInfo} from '../interfaces/gene-info';
import {Gene} from '../interfaces/gene';

@Injectable()
export class GeneService {

  private endpoint = environment.evoppiUrl + 'api/gene';
  constructor(private http: HttpClient) { }

  getGeneName(prefix: string, interactomes: number[] = [], limit: number = 10): Observable<GeneInfo[]> {

    const params: any = {prefix: prefix, interactome: interactomes, maxResults: limit};

    return this.http.get<GeneInfo[]>(this.endpoint + '/name', {params : params})
      .pipe(
        catchError(ErrorHelper.handleError('getGeneName', []))
      );
  }

  getGene(id: number): Observable<Gene> {

    return this.http.get<Gene>(this.endpoint + '/' + id)
      .pipe(
        catchError(ErrorHelper.handleError('getGeneName', null))
      );
  }

}
