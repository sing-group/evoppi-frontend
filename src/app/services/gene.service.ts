import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class GeneService {

  private endpoint = environment.evoppiUrl + 'api/gene';
  constructor(private http: HttpClient) { }

  getGene(prefix: string, interactomes: number[] = [], limit: number = 10): Observable<number[]> {

    const params: any = {prefix: prefix, interactomes: interactomes, limit: limit};

    return this.http.get<number[]>(this.endpoint, {params : params});
  }

}
