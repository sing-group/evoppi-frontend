import {BlastResult} from '../interfaces/blast-result';

export class Node implements d3.SimulationNodeDatum {
  // optional - defining optional implementation properties - required for relevant typing assistance
  index?: number;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  fx?: number | null;
  fy?: number | null;

  id: string;
  label: string | number;
  linkCount: number = 0;
  type?: number;
  blastResults?: BlastResult[];

  constructor(id, label, type = 1, blastResults = []) {
    this.id = id;
    this.label = label;
    this.type = type;
    this.blastResults = blastResults;
  }

  normal = () => {
    return Math.sqrt(this.linkCount / 100);
  }

  get r() {
    return 100 * this.normal() + 20;
  }

  get fontSize() {
    return (30 * this.normal() + 10) + 'px';
  }
}
