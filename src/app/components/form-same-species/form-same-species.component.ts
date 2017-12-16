import { Component, OnInit } from '@angular/core';
import 'rxjs/add/observable/of';
import {Species} from '../../interfaces/species';
import {SpeciesService} from '../../services/species.service';
import {InteractomeService} from '../../services/interactome.service';
import {Interactome} from '../../interfaces/interactome';
import {GeneService} from '../../services/gene.service';
import {InteractionService} from '../../services/interaction.service';
import {Interaction} from '../../interfaces/interaction';
import {Gene} from '../../interfaces/gene';
import {MatTableDataSource} from '@angular/material';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-form-same-species',
  templateUrl: './form-same-species.component.html',
  styleUrls: ['./form-same-species.component.css']
})
export class FormSameSpeciesComponent implements OnInit {
  formSameSpecies: FormGroup;
  dataSource: MatTableDataSource<Interaction>;
  displayedColumns = ['Gene', 'Interactomes'];

  species: Species[];
  interactomes: Interactome[] = [];
  interaction: Interaction[] = [];
  genes: number[];

  hideTable = true;

  constructor(private speciesService: SpeciesService, private interactomeService: InteractomeService,
              private geneService: GeneService, private interactionService: InteractionService, private formBuilder: FormBuilder ) {  }

  ngOnInit() {
    this.formSameSpecies = this.formBuilder.group({
      'species': ['', Validators.required],
      'interactome1': ['', Validators.required],
      'interactome2': ['', Validators.required],
      'gene': ['', Validators.required],

    });
    this.getSpecies();
  }

  getSpecies(): void {
    this.speciesService.getSpecies()
      .subscribe(species => this.species = species);
  }

  onChangeSpecies(value: Species): void {
    this.interactomes = [];

    for (const interactome of value.interactomes) {
      this.interactomeService.getInteractome(interactome.id)
        .subscribe(res => this.interactomes.push(res));
    }
  }

  onSearchGenes(value: number): void {
    let interactomes = [];
    if (this.interactomes.length > 0) {
      interactomes = this.interactomes.map((interactome) => interactome.id);
    }
    this.geneService.getGene(value.toString(), interactomes)
      .subscribe(res => {
        this.genes = res;
      });

  }
  onCompare(): void {
    if (this.formSameSpecies.status === 'INVALID') {
      console.log('INVALID');
      return;
    }
    const formModel = this.formSameSpecies.value;
    this.interactionService.getInteraction(formModel.gene, [formModel.interactome1.id, formModel.interactome2.id])
      .subscribe((interaction) => {
        this.hideTable = false;
        this.interaction = interaction;
        this.dataSource = new MatTableDataSource<Interaction>(this.interaction);
      });
  }
}
