import {Interactome} from './interactome';
import {Gene} from './gene';
import {Interaction} from './interaction';

export interface WorkResult {
  id: {id: number, uri: string};
  interactions: Interaction[];
  interactomes: Interactome[];
  queryGene: Gene;
  queryInteractomes: Interactome[];
  queryMaxDegree: number;
  status: string;
}
