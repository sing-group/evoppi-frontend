import { Component, OnInit } from '@angular/core';
import {DataSource} from "@angular/cdk/collections";
import {Observable} from "rxjs/Observable";
import 'rxjs/add/observable/of';

@Component({
  selector: 'app-form-distinct-species',
  templateUrl: './form-distinct-species.component.html',
  styleUrls: ['./form-distinct-species.component.css']
})
export class FormDistinctSpeciesComponent implements OnInit {
  dataSource = new DistinctSpeciesDataSource();
  displayedColumns = ['GeneSpecies1', 'GeneSpecies2', 'InteractsSpecies1', 'InteractsSpecies2', 'Code'];
  constructor() { }

  ngOnInit() {
  }

}

export interface ElementSameSpecies {
  geneSpecies1: string;
  geneSpecies2: string;
  interactsSpecies1: string;
  interactsSpecies2: string;
  code: string;
}

const data: ElementSameSpecies[] = [
  {geneSpecies1: "gene species1", geneSpecies2:"gene species2", interactsSpecies1: "interacts species1", interactsSpecies2:"interacts species2", code:"code1"},
  {geneSpecies1: "gene species12", geneSpecies2:"gene species22", interactsSpecies1: "interacts species12", interactsSpecies2:"interacts species22", code:"code2"},
];


export class DistinctSpeciesDataSource extends DataSource<any> {
  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<ElementSameSpecies[]> {
    return Observable.of(data);
  }

  disconnect() {}
}
