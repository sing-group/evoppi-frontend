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
import {HttpClient} from '@angular/common/http';
import {Species} from '../interfaces/species';
import {Observable} from 'rxjs/Observable';
import {environment} from '../../environments/environment';
import {catchError, map} from 'rxjs/operators';
import {ErrorHelper} from '../helpers/error.helper';

@Injectable()
export class SpeciesService {

  private endpoint = environment.evoppiUrl + 'api/species';

  constructor(private http: HttpClient) { }

  getSpecies(): Observable<Species[]> {
    return this.http.get<Species[]>(this.endpoint)
      .pipe(
        map(res => res.sort((a, b) => a.name < b.name ? -1 : 1)),
        catchError(ErrorHelper.handleError('getSpecies', []))
      );
  }

  getSpeciesById(id: number): Observable<Species> {
    return this.http.get<Species>(this.endpoint + '/' + id)
      .pipe(
        catchError(ErrorHelper.handleError('getSpeciesById', null))
      );
  }

}
