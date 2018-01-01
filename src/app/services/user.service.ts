import { Injectable } from '@angular/core';
import {ErrorHelper} from '../helpers/error.helper';
import {catchError} from 'rxjs/operators';
import {Observable} from 'rxjs/Observable';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {User} from '../classes/user';

@Injectable()
export class UserService {

  private endpoint = environment.evoppiUrl + 'api/user';
  private user: User;

  constructor(private http: HttpClient) {
    this.user = new User();
  }

  getRole(login: string, password: string): Observable<string> {
    return this.http.get<string>(this.endpoint + '/role',
      {responseType: 'text' as 'json', params: {login: login, password: password}})
      .pipe(
        catchError(ErrorHelper.handleError('getRole', 'INVALID'))
      );
  }

  setUser(username: string, role: string) {
    this.user.username = username;
    this.user.role = role;
    this.user.authenticated = true;
  }

  getUser(): User {
    return this.user;
  }
}
