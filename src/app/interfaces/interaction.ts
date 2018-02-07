import {InteractomeDegree} from './interactome-degree';

export interface Interaction {
  geneA: number;
  geneB: number;
  interactomeDegrees: InteractomeDegree[];
  code?: string;
}
