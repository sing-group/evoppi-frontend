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

import {Gene, Interaction, Interactome} from '../bio';
import {BlastResult} from '../bio/results';

export interface WorkResult {
    id: string;
    queryGene: { id: number, name: string, uri: string };
    queryMaxDegree: number;
    status: string;
    interactions: {
        blastResults?: BlastResult[],
        filteringOptions?: object,
        interactions: Interaction[],
        result?: { id: string, uri: string },
    };
    totalInteractions?: number;

    // Same species
    species?: { id: string, name: string, uri: string };

    interactomes?: Interactome[];

    // Distinct species
    referenceSpecies?: { id: string, name: string, uri: string };
    targetSpecies?: { id: string, name: string, uri: string };

    referenceInteractomes?: Interactome[];
    targetInteractomes?: Interactome[];
}
