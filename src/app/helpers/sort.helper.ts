import {Interaction} from '../interfaces/interaction';

export class SortHelper {
  public static sortInteraction(data: Interaction, sortHeaderId: string): number {
    switch (sortHeaderId) {
      case 'GeneA':
        return data.geneA.id;
      case 'GeneB':
        return data.geneB.id;
      case 'Interactomes':
        if (data.interactomes.length > 0) {
          return data.interactomes[0].id;
        }
        return 0;
      case 'Degree':
        return data.degree;
      default:
        return 0;
    }
  }
}
