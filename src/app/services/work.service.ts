import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Work} from '../interfaces/work';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class WorkService {

  constructor(private httpClient: HttpClient) { }

  public update(work: Work): Observable<Work> {
    return this.httpClient.get<Work>(work.id.uri);
  }
}
