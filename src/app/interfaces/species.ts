import {Interactome} from './interactome';

export interface Species {
  id: number;
  name: string;
  interactomes: Interactome[];

}
