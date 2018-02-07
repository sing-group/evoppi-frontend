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
      case 'ReferenceInteractome':
      case 'TargetInteractome':
      case 'InteractsSpeciesA':
      case 'InteractsSpeciesB':
      case 'Code':
      default:
        return 0;
    }
  }
}
