/*
 *  EvoPPI Frontend
 *
 * Copyright (C) 2017-2018 - Noé Vázquez, Miguel Reboiro-Jato,
 * Jorge Vieria, Sara Rocha, Hugo López-Fernández, André Torres,
 * Rui Camacho, Florentino Fdez-Riverola, and Cristina P. Vieira.
 * .
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


import {BlastResult} from '../bio/results/BlastResult';
import {Gene, Interaction, Interactome} from '../bio';

export interface WorkResult {
  id: string;
  queryGene: number;
  queryMaxDegree: number;
  status: string;
  interactions: {
    blastResults?: BlastResult[],
    filteringOptions?: object,
    interactions: Interaction[],
    result?: {id: string, uri: string},
    // Same species
    genes?: Gene[]
    // Distinct species
    referenceGenes?: Gene[],
    targetGenes?: Gene[],
  };
  totalInteractions?: number;

  // Same species
  interactomes?: Interactome[];

  // Distinct species
  referenceInteractomes?: Interactome[];
  targetInteractomes?: Interactome[];
}
