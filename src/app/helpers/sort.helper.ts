import {Interaction} from '../interfaces/interaction';

export class SortHelper {
  public static sortInteraction(data: Interaction, sortHeaderId: string): number {
    switch (sortHeaderId) {
      case 'GeneSpeciesA':
      case 'GeneA':
        return data.geneA;
      case 'GeneSpeciesB':
      case 'GeneB':
        return data.geneB;
      case 'Interactomes':
        if (data.interactomes.length > 0) {
          return data.interactomes[0];
        }
        return 0;
      case 'Degree':
        return data.degree;
      case 'InteractsSpeciesA':
      case 'InteractsSpeciesB':
      case 'Code':
      default:
        return 0;
    }
  }
}
