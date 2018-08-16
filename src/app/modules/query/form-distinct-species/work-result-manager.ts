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


import {WorkResult} from '../../../entities/execution';
import {Interaction} from '../../../entities/bio';

export class WorkResultManager {
  constructor(private result: WorkResult) {
  }

  isTargetInteractome(id: number): boolean {
    return this.result.targetInteractomes
      .some(interactome => interactome.id === id);
  }

  isReferenceInteractome(id: number): boolean {
    return this.result.referenceInteractomes
      .some(interactome => interactome.id === id);
  }

  getReferenceInteractions(): Interaction[] {
    return this.result.interactions.interactions
      .map(interaction => ({
        geneA: interaction.geneA,
        geneB: interaction.geneB,
        interactomeDegrees: interaction.interactomeDegrees.filter(intDegree => this.isReferenceInteractome(intDegree.id))
      }))
      .filter(interaction => interaction.interactomeDegrees.length > 0);
  }

  getTargetInteractions(): Interaction[] {
    return this.result.interactions.interactions
      .map(interaction => ({
        geneA: interaction.geneA,
        geneB: interaction.geneB,
        interactomeDegrees: interaction.interactomeDegrees.filter(intDegree => this.isTargetInteractome(intDegree.id))
      }))
      .filter(interaction => interaction.interactomeDegrees.length > 0);
  }

  getOrthologs(referenceGene: number): number[] {
    return this.result.interactions.blastResults.filter(blast => blast.qseqid === referenceGene)
      .map(blast => blast.sseqid)
      .filter((filterItem, position, self) => self.indexOf(filterItem) === position); // Removes duplicates
  }

  getInteractionsOf(geneA: number, geneB: number, interactions: Interaction[]) {
    return interactions.filter(interaction =>
      (interaction.geneA === geneA && interaction.geneB === geneB)
      || (interaction.geneA === geneB && interaction.geneB === geneA)
    );
  }

  getReferenceInteractionOf(geneA: number, geneB: number): Interaction {
    const interactions = this.getInteractionsOf(geneA, geneB, this.getReferenceInteractions());

    return interactions.length === 1 ? interactions[0] : null;
  }

  getTargetInteractionsOf(geneA: number, geneB: number): Interaction[] {
    return this.getInteractionsOf(geneA, geneB, this.getTargetInteractions());
  }
}
