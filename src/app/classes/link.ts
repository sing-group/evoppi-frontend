import {Node} from './node';


export class Link implements d3.SimulationLinkDatum<Node> {
  // optional - defining optional implementation properties - required for relevant typing assistance
  index?: number;
  type?: number;

  // must - defining enforced implementation properties
  source: Node | string | number;
  target: Node | string | number;

  constructor(source, target, type = 1) {
    this.source = source;
    this.target = target;
    this.type = type;
  }
}
