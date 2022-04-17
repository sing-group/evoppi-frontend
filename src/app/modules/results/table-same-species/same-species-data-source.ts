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
import {Interaction, InteractomeDegree} from '../../../entities/bio';
import {InteractionService} from '../services/interaction.service';
import {OrderField, SortDirection} from '../../../entities/data';

export class SameSpeciesInteractionRow {
    public readonly geneA: number;
    public readonly geneAName: string;
    public readonly geneB: number;
    public readonly geneBName: string;
    public readonly interactomeDegrees: InteractomeDegree[];
    public readonly distinctDegrees: number[];

    public constructor(interaction: Interaction) {
        this.geneA = interaction.geneA;
        this.geneAName = interaction.geneAName;
        this.geneB = interaction.geneB;
        this.geneBName = interaction.geneBName;
        this.interactomeDegrees = interaction.interactomeDegrees;
        this.distinctDegrees = interaction.interactomeDegrees.map(intDegree => intDegree.degree)
            .filter((filterItem, position, self) => self.indexOf(filterItem) === position) // Removes duplicates
        .sort();
    }

    public getInteractomeIdByDegree(degree: number | InteractomeDegree): number[] {
        if (typeof degree !== 'number') {
            degree = degree.degree;
        }

        return this.interactomeDegrees
            .filter(interactomeDegree => interactomeDegree.degree === degree)
            .map(interactomeDegree => interactomeDegree.id)
        .sort();
    }
}

export class SameSpeciesDataSource implements DataSource<SameSpeciesInteractionRow> {

    private interactionSubject: BehaviorSubject<SameSpeciesInteractionRow[]> = new BehaviorSubject<SameSpeciesInteractionRow[]>([]);
    private loadingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    public loading$ = this.loadingSubject.asObservable();

    constructor(private interactionService: InteractionService) {
    }

    connect(collectionViewer: CollectionViewer): Observable<SameSpeciesInteractionRow[]> {
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
                mergeMap((result) =>
                    of(result.interactions.interactions.map(interaction => new SameSpeciesInteractionRow(interaction)))
                ),
                finalize(() => this.loadingSubject.next(false))
            )
            .subscribe(rows => this.interactionSubject.next(rows));
    }

}
