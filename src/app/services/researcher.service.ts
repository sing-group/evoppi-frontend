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
import {Observable} from 'rxjs/Observable';
import {catchError} from 'rxjs/operators';
import {User} from '../classes/user';
import {ErrorHelper} from '../helpers/error.helper';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class ResearcherService {
  private endpoint = environment.evoppiUrl + 'api/researcher';

  constructor(private http: HttpClient) { }

  getResearcher(login: string): Observable<User> {
    return this.http.get<User>(this.endpoint + '/' + login);
  }

  getResearchers(): Observable<User[]> {
    return this.http.get<User[]>(this.endpoint)
      .pipe(
        catchError(ErrorHelper.handleError('getResearchers', []))
      );
  }

  createResearcher(login: string, role: string, email: string, password: string): Observable<any> {
    const body = {
      login: login,
      role: role,
      email: email,
      password: password
    };
    return this.http.post<any>(this.endpoint, body);
  }

  editResearcher(login: string, role: string, email: string, password: string): Observable<any> {
    const body = {
      login: login,
      role: role,
      email: email,
      password: password
    };
    return this.http.put<any>(this.endpoint, body);
  }

  deleteResearcher(login: string): Observable<any> {
    return this.http.delete<User>(this.endpoint + '/' + login);
  }
}
