import { Injectable } from '@angular/core';
import {ErrorHelper} from '../helpers/error.helper';
import {Observable} from 'rxjs/Observable';
import {catchError} from 'rxjs/operators';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {User} from '../classes/user';

@Injectable()
export class AdminService {
  private endpoint = environment.evoppiUrl + 'api/admin';

  constructor(private http: HttpClient) { }

  getAdmins(): Observable<User[]> {
    return this.http.get<User[]>(this.endpoint)
      .pipe(
        catchError(ErrorHelper.handleError('getAdmins', []))
      );
  }
}
