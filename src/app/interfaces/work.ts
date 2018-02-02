import {Step} from './step';
import {Status} from './status';

export interface Work {
  id: {id: number, uri: string};
  name: string;
  description: string;
  creationDateTime: Date;
  startDateTime: Date;
  endDateTime: Date;
  resultReference: string;
  status: Status;
  steps: Array<Step>;
}
