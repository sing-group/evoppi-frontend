/*
 *  EvoPPI Frontend
 *
 *  Copyright (C) 2017-2022 - Noé Vázquez González,
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
import {Role} from '../../../entities/data';
import {User} from '../../../entities/user';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {Observable} from 'rxjs';
import {EvoppiError} from '../../../entities/notification';
import {AnalysisType} from '../../../entities/data/analysis-type.enum';
import {InteractionResultLinkage} from '../../../entities/user/interaction-result-linkage.model';

@Injectable()
export class AuthenticationService {

    private endpoint = environment.evoppiUrl + 'api/user';

    private user: User;

    constructor(private http: HttpClient) {
        this.user = new User();
    }

    public getUserName(): string {
        return this.user.name;
    }

    public getUserRole(): Role {
        return this.user.role;
    }

    public isGuest(): boolean {
        return !this.user.authenticated;
    }

    public checkCredentials (username: string, password: string): Observable<Role> {
        return this.http.get<Role>(this.endpoint + '/role',
            {responseType: 'text' as 'json', params: {login: username, password: password}}
        )
        .pipe(
            EvoppiError.throwOnError('Error checking credentials', `Error checking user '${username}'.`)
        );
    }

    public register (username: string, email: string, password: string): Observable<string> {
        return this.http.post<string>(this.endpoint + '/registration',
            {login: username, email: email, password: password}
        )
            .pipe(
                EvoppiError.throwOnError('Error registering user', `The user '${username}' could not be registered.`)
            );
    }

    public confirmRegistration (uuid: string): Observable<string> {
        return this.http.post<string>(this.endpoint + '/registration/' + uuid, {})
            .pipe(
                EvoppiError.throwOnError('Error confirming user registration', `The uuid '${uuid}' could not be confirmed.`)
            );
    }

    public recovery (login: string): Observable<string> {
        return this.http.post<string>(this.endpoint + '/' + login + '/password/recovery',
            {}
        )
            .pipe(
                EvoppiError.throwOnError('Error recovering password',
                    `The password of the username '${login}' could not be recovered.`)
            );
    }

    public confirmRecovery (uuid: string, password: string): Observable<string> {
        return this.http.post<string>(this.endpoint + '/password/recovery/' + uuid,
            password, {headers: new HttpHeaders({'Content-Type': 'text/plain'})}
        )
            .pipe(
                EvoppiError.throwOnError('Error changing password',
                    `The password could not be changed.`)
            );
    }

    public claimResults(type: AnalysisType, uuids: string[]): Observable<InteractionResultLinkage> {
        return this.http.put<string>(this.endpoint + '/interaction/result/' + type,
            {
                uuids: uuids
            })
            .pipe(
                EvoppiError.throwOnError('Error claiming user results',
                    `The uuids '${uuids.join(',')}' of type '${type}' could not be claimed.`)
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
