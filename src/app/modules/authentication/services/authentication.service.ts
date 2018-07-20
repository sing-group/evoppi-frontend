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
import {Role} from '../../../entities/data';
import {User} from '../../../entities/user';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {catchError} from 'rxjs/operators';
import {ErrorHelper} from '../../../helpers/error.helper';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class AuthenticationService {

    private endpoint = environment.evoppiUrl + 'api/user';

    private user: User;

    constructor(private http: HttpClient) {
        this.user = new User();
    }

    public getUserName(): string {
        // return null;
        // return 'Administrator';
        // return 'Researcher';
        return this.user.name;
    }

    public getUserRole(): Role {
        // return 'GUEST';
        // return 'ADMIN';
        // return 'RESEARCHER';
        return this.user.role;
    }

    public isGuest(): boolean {
        // return true;
        return !this.user.authenticated;
    }

    public checkCredentials (username: string, password: string): Observable<Role> {
        return this.http.get<Role>(this.endpoint + '/role',
            {responseType: 'text' as 'json', params: {login: username, password: password}})
            .pipe(
                catchError(ErrorHelper.handleError('getRole', Role.INVALID))
            );
    }

    public logIn(username: string, password: string, role: Role) {
        this.user.name = username;
        this.user.role = role;
        this.user.authHeader = 'Basic ' + btoa(username + ':' + password);
        this.user.authenticated = true;
        this.user.save();
    }

    public logOut() {
        this.user.clear();
        this.user = new User();
    }

    public getUser(): User {
        return this.user;
    }

    public getAuthorizationHeader(): string {
        return this.user.authHeader;
    }
}
