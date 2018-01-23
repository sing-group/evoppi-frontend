import {Interactome} from './interactome';
import {Gene} from './gene';
import {Interaction} from './interaction';

export interface WorkResult {
  id: {id: number, uri: string};
  interactions: Interaction[];
  interactomes: Interactome[];
  genes: Gene[];
  queryGene: number;
  queryInteractomes: number[];
  queryMaxDegree: number;
  status: string;
}
