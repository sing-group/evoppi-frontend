import {Component, Input, OnChanges} from '@angular/core';

@Component({
  selector: 'app-legend-distinct-species',
  templateUrl: './legend-distinct-species.component.html',
  styleUrls: ['./legend-distinct-species.component.css']
})
export class LegendDistinctSpeciesComponent implements OnChanges {

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
