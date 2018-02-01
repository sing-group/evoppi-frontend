
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
  label: string;
  linkCount: number = 0;
  type?: number;

  constructor(id, label, type = 1) {
    this.id = id;
    this.label = label;
    this.type = type;
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
