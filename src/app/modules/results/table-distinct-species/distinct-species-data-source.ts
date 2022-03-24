/*
 *  EvoPPI Frontend
 *
 *  Copyright (C) 2017-2019 - Noé Vázquez González,
 *  Miguel Reboiro-Jato, Jorge Vieira, Hugo López-Fernández,
 *  and Cristina Vieira.
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {finalize, mergeMap} from 'rxjs/operators';
import {WorkResultManager} from '../../query/form-distinct-species/work-result-manager';
import {InteractionService} from '../services/interaction.service';
import {Interaction} from '../../../entities/bio';
import {OrderField, SortDirection} from '../../../entities/data';

export class DistinctSpeciesDataSource implements DataSource<Interaction> {

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
        mergeMap((res) => {
          const resultManager = new WorkResultManager(res);

          const rows = res.interactions.interactions.map((item) => {
            const referenceInteraction = resultManager.getReferenceInteractionOf(item.geneA, item.geneB);
            const targetInteractions = resultManager.getTargetInteractionsOf(item.geneA, item.geneB);

            const inReference = referenceInteraction !== null;
            const inTarget = targetInteractions.length > 0;

            let type;
            const interactomes = [];
            let referenceDegree = 0;
            let targetDegrees = [];

            if (inReference) {
              type = 1;
              interactomes.push(res.referenceInteractomes.map(x => x.id));
              referenceDegree = referenceInteraction.interactomeDegrees[0].degree;
            }

            if (inTarget) {
              type = 2;
              interactomes.push(res.targetInteractomes.map(x => x.id));
              targetDegrees = targetInteractions.map(interaction => interaction.interactomeDegrees[0].degree)
                .filter((filteredItem, position, self) => self.indexOf(filteredItem) === position) // Removes duplicates
                .sort((d1, d2) => d1 - d2);
            }

            if (inReference && inTarget) {
              type = 3;
            }

            const blastResultsA = res.interactions.blastResults.filter(blast => blast.qseqid === item.geneA);
            const blastResultsB = res.interactions.blastResults.filter(blast => blast.qseqid === item.geneB);

            return {
              geneA: item.geneA,
              typeA: (blastResultsA.length > 0 ? 2 : 1),
              geneAName: item.geneAName,
              blastResultsA: blastResultsA,
              geneB: item.geneB,
              typeB: (blastResultsB.length > 0 ? 2 : 1),
              geneBName: item.geneBName,
              blastResultsB: blastResultsB,
              referenceDegree: referenceDegree,
              targetDegrees: targetDegrees
            };
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
