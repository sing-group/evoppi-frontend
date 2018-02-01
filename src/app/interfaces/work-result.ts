import {Interactome} from './interactome';
import {Gene} from './gene';
import {Interaction} from './interaction';
import {IdUri} from './id-uri';
import {BlastResult} from './blast-result';

export interface WorkResult {
  id: {id: number, uri: string};
  interactions: Interaction[];
  interactomes: Interactome[];
  genes: Gene[];
  queryGene: number;
  queryInteractomes: number[];
  queryMaxDegree: number;
  status: string;
  referenceInteractome: IdUri;
  targetInteractome: IdUri;
  referenceGenes: IdUri[];
  targetGenes: IdUri[];
  blastResults: BlastResult[];
}
