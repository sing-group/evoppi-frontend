import {Interactome} from './interactome';
import {Gene} from './gene';

export interface Interaction {
  interactomes: Interactome[];
  geneFrom: Gene;
  geneTo: Gene;
}
