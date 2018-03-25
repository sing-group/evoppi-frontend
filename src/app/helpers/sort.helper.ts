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

import {Interaction} from '../interfaces/interaction';
import {InteractomeDegree} from '../interfaces/interactome-degree';

export class SortHelper {
  public static sortInteraction(data: Interaction, sortHeaderId: string): number | string {
    switch (sortHeaderId) {
      case 'GeneSpeciesA':
      case 'GeneA':
        return data.geneA;
      case 'GeneSpeciesB':
      case 'GeneB':
        return data.geneB;
      case 'NameA':
        return data.firstNameA.toLowerCase();
      case 'NameB':
        return data.firstNameB.toLowerCase();
      case 'ReferenceInteractome':
        if (data.interactomeDegrees && data.interactomeDegrees[0]) {
          return data.interactomeDegrees[0].degree;
        } else if (data.referenceDegree) {
          return data.referenceDegree;
        }
        return 0;
      case 'TargetInteractome':
        if (data.interactomeDegrees) {
          if (data.interactomeDegrees && data.interactomeDegrees[1]) {
            return data.interactomeDegrees[1].degree;
          } else {
            return 0;
          }
        } else if (data.targetDegrees) {
          let res = '';
          data.targetDegrees.sort().forEach((item) => {
            res += item.toString();
          });
          if (data.targetDegrees.length > 1) {
            console.log(data);
            console.log('targetDegrees', res.padEnd(4, '0'));
          }
          return +res.padEnd(4, '0');
        }
        return 0;
      case 'InteractsSpeciesA':
      case 'InteractsSpeciesB':
      case 'Code':
      default:
        if (sortHeaderId.startsWith('Interactome-')) {
          const id: number = +sortHeaderId.substr(sortHeaderId.lastIndexOf('-') + 1);
          const index: number = data.interactomeDegrees.findIndex(degree => degree.id === id);
          if (index !== -1) {
            return data.interactomeDegrees[index].degree;
          }
        }
        return '';
    }
  }

  public static sortInteractomeDegree(a: InteractomeDegree, b: InteractomeDegree): number {
    if (a.degree < b.degree) {
      return -1;
    } else if (a.degree > b.degree) {
      return 1;
    }
    return 0;
  }
}
