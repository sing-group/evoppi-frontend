import { Component, OnInit } from '@angular/core';
import {DataSource} from '@angular/cdk/collections';
import {Observable} from 'rxjs/Observable';
import {SpeciesService} from '../../services/species.service';
import {Interactome} from '../../interfaces/interactome';
import {Species} from '../../interfaces/species';
import {InteractomeService} from '../../services/interactome.service';
import {GeneService} from '../../services/gene.service';

@Component({
  selector: 'app-form-distinct-species',
  templateUrl: './form-distinct-species.component.html',
  styleUrls: ['./form-distinct-species.component.css']
})
export class FormDistinctSpeciesComponent implements OnInit {
  dataSource = new DistinctSpeciesDataSource();
  displayedColumns = ['GeneSpecies1', 'GeneSpecies2', 'InteractsSpecies1', 'InteractsSpecies2', 'Code'];

  species: Species[];
  interactomes: Interactome[][] = [];
  genes: number[];

  constructor(private speciesService: SpeciesService, private interactomeService: InteractomeService,
              private geneService: GeneService) { }

  ngOnInit() {
    this.getSpecies();
  }

  getSpecies(): void {
    this.speciesService.getSpecies()
      .subscribe(species => this.species = species);
  }

  onChangeSpecies(value: Species, index: number): void {
    this.interactomes[index] = [];

    for (const interactome of value.interactomes) {
      this.interactomeService.getInteractome(interactome.id)
        .subscribe(res => this.interactomes[index].push(res));
    }
  }

  onSearchGenes(value: string): void {
    const interactomes = [];

    for (const intArray of this.interactomes) {
      if (intArray && intArray.length > 0) {
        interactomes.push(intArray.map((interactome) => interactome.id));
      }
    }
    this.geneService.getGene(value, interactomes)
      .subscribe(res => {
        this.genes = res;
      });

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
  {geneSpecies1: 'gene species1', geneSpecies2: 'gene species2', interactsSpecies1: 'interacts species1', interactsSpecies2: 'interacts species2', code: 'code1'},
  {geneSpecies1: 'gene species12', geneSpecies2: 'gene species22', interactsSpecies1: 'interacts species12', interactsSpecies2: 'interacts species22', code: 'code2'},
];


export class DistinctSpeciesDataSource extends DataSource<any> {
  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<ElementSameSpecies[]> {
    return Observable.of(data);
  }

  disconnect() {}
}
