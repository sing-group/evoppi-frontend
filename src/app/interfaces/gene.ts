import {IdUri} from './id-uri';

export interface Gene {
  id: number;
  uri: string;
  speciesId: IdUri;
  names: {source: string, names: Array<string>};
  sequences: Array<string>;
}
