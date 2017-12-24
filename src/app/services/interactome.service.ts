import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Interactome} from '../interfaces/interactome';
import {ErrorHelper} from '../helpers/error.helper';
import {catchError} from 'rxjs/operators';

@Injectable()
export class InteractomeService {

  private endpoint = environment.evoppiUrl + 'api/interactome';
  constructor(private http: HttpClient) { }

  getInteractome(id: number): Observable<Interactome> {
    return this.http.get<Interactome>(this.endpoint + '/' + id)
      .pipe(
        catchError(ErrorHelper.handleError('getInteractome', null))
      );;
  }

}
