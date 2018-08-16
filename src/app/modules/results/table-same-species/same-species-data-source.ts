/*
 *  EvoPPI Frontend
 *
 * Copyright (C) 2017-2018 - Noé Vázquez, Miguel Reboiro-Jato,
 * Jorge Vieria, Sara Rocha, Hugo López-Fernández, André Torres,
 * Rui Camacho, Florentino Fdez-Riverola, and Cristina P. Vieira.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 */

import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {finalize, mergeMap} from 'rxjs/operators';
import {Interaction} from '../../../entities/bio';
import {InteractionService} from '../services/interaction.service';
import {OrderField, SortDirection} from '../../../entities/data';

export class SameSpeciesDataSource implements DataSource<Interaction> {

  private interactionSubject: BehaviorSubject<Interaction[]> = new BehaviorSubject<Interaction[]>([]);
  private loadingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public loading$ = this.loadingSubject.asObservable();

  constructor(private interactionService: InteractionService) {  }

  connect(collectionViewer: CollectionViewer): Observable<Interaction[]> {
    return this.interactionSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.interactionSubject.complete();
    this.loadingSubject.complete();
  }

  load(uri: string, page: number = 0, pageSize: number = 10, sortDirection: SortDirection = SortDirection.ASCENDING,
       orderField: OrderField = OrderField.GENE_A_ID, interactomeId?: number) {
    this.loadingSubject.next(true);
    this.interactionService.getInteractions(uri, page, pageSize, sortDirection, orderField, interactomeId)
      .pipe(
        mergeMap( (res) => {
          const rows = res.interactions.interactions.map((item) => {
            const row = {
              geneA: item.geneA,
              firstNameA: res.interactions.genes.find(gene => gene.geneId === item.geneA).defaultName,
              geneB: item.geneB,
              firstNameB: res.interactions.genes.find(gene => gene.geneId === item.geneB).defaultName,
              interactomeDegrees: item.interactomeDegrees,
              distinctDegrees: item.interactomeDegrees.map(intDegree => intDegree.degree)
                .filter((filterItem, position, self) => self.indexOf(filterItem) === position) // Removes duplicates
                .sort()
            };
            return row;
          });
          return of(rows);
        }),
        finalize(() => this.loadingSubject.next(false))
      )
      .subscribe((res) => {
        this.interactionSubject.next(res);
      });
  }

}
