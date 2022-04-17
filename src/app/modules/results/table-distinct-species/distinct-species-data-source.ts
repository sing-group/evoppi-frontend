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
import {BlastResult, Interaction, Interactome, InteractomeDegree} from '../../../entities/bio';
import {OrderField, SortDirection} from '../../../entities/data';

export class DistinctSpeciesInteractionRow {
    public readonly geneA: number;
    public readonly typeA: number;
    public readonly geneAName: string;
    public readonly blastResultsA: BlastResult[];
    public readonly geneB: number;
    public readonly typeB: number;
    public readonly geneBName: string;
    public readonly blastResultsB: BlastResult[];
    public readonly referenceDegrees: InteractomeDegree[];
    public readonly targetDegrees: InteractomeDegree[];

    public constructor(
        interaction: Interaction,
        resultManager: WorkResultManager,
        referenceInteractomes: Interactome[],
        targetInteractomes: Interactome[],
        blastResults: BlastResult[]
    ) {
        const referenceInteraction = resultManager.getReferenceInteractionOf(interaction.geneA, interaction.geneB);
        const targetInteractions = resultManager.getTargetInteractionsOf(interaction.geneA, interaction.geneB);

        const inReference = referenceInteraction !== null;
        const inTarget = targetInteractions.length > 0;

        const interactomes = [];
        let referenceDegrees: InteractomeDegree[] = [];
        let targetDegrees: InteractomeDegree[] = [];

        if (inReference) {
            interactomes.push(referenceInteractomes.map(x => x.id));
            referenceDegrees = referenceInteraction.interactomeDegrees;
        }

        if (inTarget) {
            interactomes.push(targetInteractomes.map(x => x.id));
            targetDegrees = targetInteractions.map(ti => ti.interactomeDegrees)
                .reduce((prev, curr) => curr.concat(prev), [])
                .filter((filteredItem, position, self) => self.indexOf(filteredItem) === position) // Removes duplicates
                .sort((d1, d2) => {
                    const degreeDiff = d1.degree - d2.degree;
                    return degreeDiff === 0 ? d1.id - d2.id : degreeDiff;
                });
        }

        this.geneA = interaction.geneA;
        this.geneAName = interaction.geneAName;
        this.blastResultsA = blastResults.filter(blast => blast.qseqid === interaction.geneA);
        this.typeA = this.blastResultsA.length > 0 ? 2 : 1;

        this.geneB = interaction.geneB;
        this.geneBName = interaction.geneBName;
        this.blastResultsB = blastResults.filter(blast => blast.qseqid === interaction.geneB);
        this.typeB = this.blastResultsB.length > 0 ? 2 : 1;

        this.referenceDegrees = referenceDegrees;
        this.targetDegrees = targetDegrees;
    }

    public getDistinctReferenceDegrees(): number[] {
        return this.referenceDegrees.map(degree => degree.degree)
            .filter((filteredItem, position, self) => self.indexOf(filteredItem) === position) // Removes duplicates
            .sort();
    }

    public getDistinctTargetDegrees(): number[] {
        return this.targetDegrees.map(degree => degree.degree)
            .filter((filteredItem, position, self) => self.indexOf(filteredItem) === position) // Removes duplicates
            .sort();
    }

    public getReferenceInteractomeIdByDegree(degree: number | InteractomeDegree): number[] {
        if (typeof degree !== 'number') {
            degree = degree.degree;
        }

        return this.referenceDegrees
            .filter(interactomeDegree => interactomeDegree.degree === degree)
            .map(interactomeDegree => interactomeDegree.id)
            .sort();
    }

    public getTargetInteractomeIdByDegree(degree: number | InteractomeDegree): number[] {
        if (typeof degree !== 'number') {
            degree = degree.degree;
        }

        return this.targetDegrees
            .filter(interactomeDegree => interactomeDegree.degree === degree)
            .map(interactomeDegree => interactomeDegree.id)
            .sort();
    }
}

export class DistinctSpeciesDataSource implements DataSource<DistinctSpeciesInteractionRow> {

    private interactionSubject: BehaviorSubject<DistinctSpeciesInteractionRow[]> = new BehaviorSubject<DistinctSpeciesInteractionRow[]>([]);
    private loadingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    public loading$ = this.loadingSubject.asObservable();

    constructor(private interactionService: InteractionService) {
    }

    connect(collectionViewer: CollectionViewer): Observable<DistinctSpeciesInteractionRow[]> {
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
                mergeMap((result) => {
                    const resultManager = new WorkResultManager(result);

                    const rows = result.interactions.interactions.map(interaction =>
                        new DistinctSpeciesInteractionRow(
                            interaction,
                            resultManager,
                            result.referenceInteractomes,
                            result.targetInteractomes,
                            result.interactions.blastResults
                        )
                    );

                    return of(rows);
                }),
                finalize(() => this.loadingSubject.next(false))
            )
            .subscribe(result => {
                this.interactionSubject.next(result);
            });
    }

}
