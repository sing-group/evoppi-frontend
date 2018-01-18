import { Component, OnInit } from '@angular/core';
import {SpeciesService} from '../../services/species.service';
import {Interactome} from '../../interfaces/interactome';
import {Species} from '../../interfaces/species';
import {InteractomeService} from '../../services/interactome.service';
import {GeneService} from '../../services/gene.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Interaction} from '../../interfaces/interaction';
import {MatTableDataSource} from '@angular/material';
import {Node} from '../../classes/node';
import {Link} from '../../classes/link';
import {InteractionService} from '../../services/interaction.service';
import {GeneInfo} from '../../interfaces/gene-info';

@Component({
  selector: 'app-form-distinct-species',
  templateUrl: './form-distinct-species.component.html',
  styleUrls: ['./form-distinct-species.component.css']
})
export class FormDistinctSpeciesComponent implements OnInit {
  formDistinctSpecies: FormGroup;
  dataSource: MatTableDataSource<Interaction>;
  displayedColumns = ['GeneSpeciesA', 'GeneSpeciesB', 'InteractsSpeciesA', 'InteractsSpeciesB', 'Code'];

  species: Species[];
  interactomes: Interactome[][] = [];
  interaction: Interaction[] = [];
  genes: GeneInfo[];
  level: number;
  eValue: number;
  minAlignLength: number;
  numDescriptions: number;
  minIdentity: number;

  hideTable = true;

  nodes: Node[] = [];
  links: Link[] = [];

  graphWidth = 900;
  graphHeight = 300;

  constructor(private speciesService: SpeciesService, private interactomeService: InteractomeService,
              private geneService: GeneService, private interactionService: InteractionService, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.level = 1;
    this.eValue = 0.05;
    this.minAlignLength = 10;
    this.numDescriptions =  1;
    this.minIdentity = 1;
    this.formDistinctSpecies = this.formBuilder.group({
      'speciesA': ['', Validators.required],
      'speciesB': ['', Validators.required],
      'interactomeA': ['', Validators.required],
      'interactomeB': ['', Validators.required],
      'gene': ['', Validators.required],
      'eValue': ['1', [Validators.required, Validators.min(0), Validators.max(100)]],
      'minAlignLength': ['1', [Validators.required, Validators.min(1), Validators.max(100)]],
      'numDescriptions': ['1', [Validators.required, Validators.min(1), Validators.max(100)]],
      'minIdentity': ['0', [Validators.required, Validators.min(0), Validators.max(100)]],
      'level': ['1', [Validators.required, Validators.min(1), Validators.max(3)]],
    });

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

  onCompare(): void {
    if (this.formDistinctSpecies.status === 'INVALID') {
      console.log('INVALID');
      return;
    }
    const formModel = this.formDistinctSpecies.value;
    this.interactionService.getInteraction(formModel.gene, [formModel.interactomeA.id, formModel.interactomeB.id], formModel.level)
      .subscribe((interaction) => {
        this.hideTable = false;
        this.interaction = interaction;
        this.dataSource = new MatTableDataSource<Interaction>(this.interaction);

        const nodes = [];
        const links = [];
        console.log(this.interaction);
        for (const item of this.interaction) {

          const from = new Node(nodes.length, item.geneA.id);
          let fromIndex = nodes.findIndex(x => x.label === from.label);
          if (fromIndex === -1) {
            fromIndex = nodes.length;
            nodes.push(from);
          } else {
            nodes[fromIndex].linkCount++;
          }

          const to = new Node(nodes.length, item.geneB.id);
          let toIndex = nodes.findIndex(x => x.label === to.label);
          if (toIndex === -1) {
            toIndex = nodes.length;
            nodes.push(to);
          } else {
            nodes[toIndex].linkCount++;
          }

          for (const interactome of item.interactomes) {
            const link = new Link(fromIndex, toIndex, (interactome.id % 4) + 1);
            links.push(link);
          }
        }

        console.log(nodes);
        console.log(links);
        this.nodes = nodes;
        this.links = links;

      });
  }
}
