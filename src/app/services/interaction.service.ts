import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {Interaction} from '../interfaces/interaction';
import {ErrorHelper} from '../helpers/error.helper';
import {catchError} from 'rxjs/operators';

@Injectable()
export class InteractionService {

  private endpoint = environment.evoppiUrl + 'api/interaction';

  constructor(private http: HttpClient) { }


  getInteraction(gene: number, interactomes: number[]): Observable<Interaction[]> {

    const params: any = {gene: gene, interactome: interactomes};

    return this.http.get<Interaction[]>(this.endpoint, {params : params})
      .pipe(
        catchError(ErrorHelper.handleError('getInteraction', []))
      );;
  }

}
