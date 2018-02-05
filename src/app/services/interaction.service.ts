import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {ErrorHelper} from '../helpers/error.helper';
import {catchError} from 'rxjs/operators';
import {Work} from '../interfaces/work';
import {WorkResult} from '../interfaces/work-result';

@Injectable()
export class InteractionService {

  private endpoint = environment.evoppiUrl + 'api/interaction';

  constructor(protected http: HttpClient) { }


  getSameSpeciesInteraction(gene: number, interactomes: number[], interactionLevel: number): Observable<Work> {

    const params: any = {gene: gene, interactome: interactomes, maxDegree: interactionLevel};

    return this.http.get<Work>(this.endpoint, {params : params});
  }

  getDistinctSpeciesInteraction(gene: number, referenceInteractome: number, targetInteractome: number,
                                 interactionLevel: number): Observable<Work> {

    const params: any = {
      gene: gene,
      referenceInteractome: referenceInteractome,
      targetInteractome: targetInteractome,
      maxDegree: interactionLevel};

    return this.http.get<Work>(this.endpoint, {params : params});
  }

  getInteractionResult(uri: string): Observable<WorkResult> {

    return this.http.get<WorkResult>(uri)
      .pipe(
        catchError(ErrorHelper.handleError('getInteraction', null))
      );
  }

}
