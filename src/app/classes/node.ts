
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

  constructor(id, label) {
    this.id = id;
    this.label = label;
  }

  normal = () => {
    return Math.sqrt(this.linkCount / 100);
  }

  get r() {
    return 50 * this.normal() + 10;
  }

  get fontSize() {
    return (30 * this.normal() + 10) + 'px';
  }

  get color() {
    return 'rgb(128,186,236)';
  }
}
