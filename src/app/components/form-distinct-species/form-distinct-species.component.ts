import {Component, HostListener, OnInit, ViewChild} from '@angular/core';
import {SpeciesService} from '../../services/species.service';
import {Interactome} from '../../interfaces/interactome';
import {Species} from '../../interfaces/species';
import {InteractomeService} from '../../services/interactome.service';
import {GeneService} from '../../services/gene.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Interaction} from '../../interfaces/interaction';
import {MatDialog, MatSelectionList, MatSort, MatTableDataSource} from '@angular/material';
import {Node} from '../../classes/node';
import {Link} from '../../classes/link';
import {InteractionService} from '../../services/interaction.service';
import {GeneInfo} from '../../interfaces/gene-info';
import {WorkStatusComponent} from '../work-status/work-status.component';
import {Work} from '../../interfaces/work';
import {SortHelper} from '../../helpers/sort.helper';

@Component({
  selector: 'app-form-distinct-species',
  templateUrl: './form-distinct-species.component.html',
  styleUrls: ['./form-distinct-species.component.css']
})
export class FormDistinctSpeciesComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatSelectionList) geneList: MatSelectionList;

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
  genesInput: string;

  hideTable = true;

  nodes: Node[] = [];
  links: Link[] = [];

  graphWidth = 900;
  graphHeight = 450;

  constructor(private speciesService: SpeciesService, private interactomeService: InteractomeService,
              private geneService: GeneService, private interactionService: InteractionService, private formBuilder: FormBuilder,
              private dialog: MatDialog) { }

  ngOnInit() {
    this.level = 1;
    this.eValue = 0.05;
    this.minAlignLength = 10;
    this.numDescriptions =  1;
    this.minIdentity = 1;
    this.genesInput = '';
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

    this.resizeGraph();

    this.formDistinctSpecies.controls.gene.valueChanges.debounceTime(500).subscribe((res) => {
      this.onSearchGenes(res);
    });
  }

  private resizeGraph() {
    if (window.innerWidth > 1024) {
      this.graphWidth = 900;
    } else {
      this.graphWidth = window.innerWidth - 120;
    }
    this.graphHeight = this.graphWidth / 2;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.resizeGraph();
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
    if (!this.formDistinctSpecies.get('interactomeA').valid) {
      alert('First, select Reference Interactome');
      return;
    }
    this.geneService.getGeneName(value, [this.formDistinctSpecies.value.interactomeA.id])
      .subscribe(res => {
        this.genes = res;
      });

  }

  onCompare(): void {
    if (this.formDistinctSpecies.status === 'INVALID') {
      console.log('INVALID');
      return;
    }
    this.hideTable = true;
    const formModel = this.formDistinctSpecies.value;
    this.interactionService.getDistinctSpeciesInteraction(formModel.gene, formModel.interactomeA.id, formModel.interactomeB.id,
      formModel.level)
      .subscribe((work) => {
        this.openDialog(work);
      });
  }

  private openDialog(data: Work) {
    const dialogRef = this.dialog.open(WorkStatusComponent, {
      disableClose: true,
      data: {data}
    });

    dialogRef.afterClosed().subscribe(res => {
      console.log(res.resultReference);
      if ( res.finished ) {
        this.getResult(res.resultReference);
      } else {
        alert('Work unfinished');
      }
    });
  }

  private getResult(uri: string) {
    this.interactionService.getInteractionResult(uri)
      .subscribe((res) => {
        this.hideTable = false;
        this.interaction = [];

        for (const item of res.interactions) {
          if (item.interactomes.find(x => x === res.referenceInteractome.id)) {
            this.interaction.push(item);
          }
        }

        this.dataSource = new MatTableDataSource<Interaction>(this.interaction);
        this.dataSource.sort = undefined;

        const nodes = [];
        const links = [];
        for (const item of this.interaction) {

          let typeA = 1, typeB = 1;
          for (const br of res.blastResults) {
            if (br.qseqid === item.geneA) {
              typeA = 2;
            }
            if (br.qseqid === item.geneB) {
              typeB = 2;
            }
          }

          const from = new Node(nodes.length, item.geneA, typeA);
          let fromIndex = nodes.findIndex(x => x.label === from.label);
          if (fromIndex === -1) {
            fromIndex = nodes.length;
            nodes.push(from);
          } else {
            nodes[fromIndex].linkCount++;
          }

          const to = new Node(nodes.length, item.geneB, typeB);
          let toIndex = nodes.findIndex(x => x.label === to.label);
          if (toIndex === -1) {
            toIndex = nodes.length;
            nodes.push(to);
          } else {
            nodes[toIndex].linkCount++;
          }

          for (const interactome of item.interactomes) {
            const link = new Link(fromIndex, toIndex, (interactome % 4) + 1);
            links.push(link);
          }
        }

        this.nodes = nodes;
        this.links = links;

      });
  }

  public initTable() {
    if (this.dataSource.sort) {
      return;
    }
    this.dataSource.sort = this.sort;
    this.dataSource.sortingDataAccessor = SortHelper.sortInteraction;
  }

  public onGeneSelected(value) {
    this.genesInput = value;
    this.formDistinctSpecies.patchValue({gene: value}, {emitEvent: false});
    this.genes = [];
  }
}
