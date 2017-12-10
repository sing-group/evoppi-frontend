import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Species} from '../interfaces/species';
import {Observable} from 'rxjs/Observable';
import {environment} from '../../environments/environment';

@Injectable()
export class SpeciesService {

  private endpoint = environment.evoppiUrl + 'api/species';

  constructor(private http: HttpClient) { }


  getSpecies(): Observable<Species[]> {
    return this.http.get<Species[]>(this.endpoint);
  }

}
