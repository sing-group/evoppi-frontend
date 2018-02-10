/*
 *  EvoPPI Frontend
 *
 *  Copyright (C) 2017-2018 - Noé Vázquez González,
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

import {Interactome} from './interactome';
import {Gene} from './gene';
import {Interaction} from './interaction';
import {IdUri} from './id-uri';
import {BlastResult} from './blast-result';

export interface WorkResult {
  id: string;
  interactions?: Interaction[];
  interactomes?: Interactome[];
  genes?: Gene[];
  queryGene: number;
  queryInteractomes?: number[];
  queryMaxDegree: number;
  status: string;
  referenceInteractome: IdUri;
  targetInteractome: IdUri;
  referenceGenes: Gene[];
  targetGenes: Gene[];
  blastResults: BlastResult[];
}
