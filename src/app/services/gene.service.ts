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
