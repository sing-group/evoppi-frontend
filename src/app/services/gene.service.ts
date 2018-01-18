import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {ErrorHelper} from '../helpers/error.helper';
import {catchError} from 'rxjs/operators';
import {GeneInfo} from '../interfaces/gene-info';

@Injectable()
export class GeneService {

  private endpoint = environment.evoppiUrl + 'api/gene/name';
  constructor(private http: HttpClient) { }

  getGene(prefix: string, interactomes: number[] = [], limit: number = 10): Observable<GeneInfo[]> {

    const params: any = {prefix: prefix, interactome: interactomes, maxResults: limit};

    return this.http.get<GeneInfo[]>(this.endpoint, {params : params})
      .pipe(
        catchError(ErrorHelper.handleError('getGene', []))
      );;
  }

}
