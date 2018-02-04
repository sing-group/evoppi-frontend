import {Component, Input, OnChanges} from '@angular/core';

@Component({
  selector: 'app-legend-same-species',
  templateUrl: './legend-same-species.component.html',
  styleUrls: ['./legend-same-species.component.css']
})
export class LegendSameSpeciesComponent implements OnChanges {

  @Input() graphWidth = 200;
  @Input() graphHeight = 200;

  private _options: { width, height };

  constructor() { }

  ngOnChanges() {
    this.options = { width: this.graphWidth, height: this.graphHeight };
  }

  get options() {
    return this._options;
  }

  set options(value) {
    this._options = value;
  }

}
