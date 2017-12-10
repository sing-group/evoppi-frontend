import { Component, OnInit } from '@angular/core';
import {DataSource} from '@angular/cdk/collections';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import {Species} from '../../interfaces/species';
import {SpeciesService} from '../../services/species.service';
import {InteractomeService} from '../../services/interactome.service';
import {Interactome} from '../../interfaces/interactome';

@Component({
  selector: 'app-form-same-species',
  templateUrl: './form-same-species.component.html',
  styleUrls: ['./form-same-species.component.css']
})
export class FormSameSpeciesComponent implements OnInit {
  dataSource = new SameSpeciesDataSource();
  displayedColumns = ['Gene', 'Interacts', 'Code'];

  species: Species[];
  interactomes: Interactome[];
  selectedInteractome1: string;
  selectedInteractome2: string;

  constructor(private speciesService: SpeciesService, private interactomeService: InteractomeService) { }

  ngOnInit() {

    this.getSpecies();
  }

  getSpecies(): void {
    this.speciesService.getSpecies()
      .subscribe(species => this.species = species);
  }

  onChangeSpecies(event): void {
    this.interactomes = [];

    for (const interactome of event.value.interactomes) {
      this.interactomeService.getInteractome(interactome.id)
        .subscribe(res => this.interactomes.push(res));
    }
  }

}

export interface ElementSameSpecies {
  gene: string;
  interacts: string;
  code: string;
}

const data: ElementSameSpecies[] = [
  {gene: 'gene1', interacts: 'interacts1', code: 'code1'},
  {gene: 'gene2', interacts: 'interacts2', code: 'code2'}
];


export class SameSpeciesDataSource extends DataSource<any> {
  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<ElementSameSpecies[]> {
    return Observable.of(data);
  }

  disconnect() {}
}
