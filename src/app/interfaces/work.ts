import {Step} from './step';

export interface Work {
  id: {id: number, uri: string};
  name: string;
  description: string;
  creationDateTime: Date;
  startDateTime: Date;
  endDateTime: Date;
  resultReference: string;
  finished: boolean;
  steps: Array<Step>;
}
