import {Component, HostListener, OnInit, ViewChild} from '@angular/core';
import 'rxjs/add/observable/of';
import {Species} from '../../interfaces/species';
import {SpeciesService} from '../../services/species.service';
import {InteractomeService} from '../../services/interactome.service';
import {Interactome} from '../../interfaces/interactome';
import {GeneService} from '../../services/gene.service';
import {InteractionService} from '../../services/interaction.service';
import {Interaction} from '../../interfaces/interaction';
import {MatSort, MatTableDataSource} from '@angular/material';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Link} from '../../classes/link';
import {Node} from '../../classes/node';
import {CsvHelper} from '../../helpers/csv.helper';
import {DomSanitizer} from '@angular/platform-browser';
import {SafeResourceUrl} from '@angular/platform-browser/src/security/dom_sanitization_service';
import {GeneInfo} from '../../interfaces/gene-info';
import {SortHelper} from '../../helpers/sort.helper';

@Component({
  selector: 'app-form-same-species',
  templateUrl: './form-same-species.component.html',
  styleUrls: ['./form-same-species.component.css']
})
export class FormSameSpeciesComponent implements OnInit {

  @ViewChild(MatSort) sort: MatSort;

  formSameSpecies: FormGroup;
  dataSource: MatTableDataSource<Interaction>;
  displayedColumns = ['GeneA', 'GeneB', 'Interactomes', 'Degree'];

  species: Species[];
  interactomes: Interactome[] = [];
  interaction: Interaction[] = [];
  genes: GeneInfo[];
  level: number;

  hideTable = true;


  nodes: Node[] = [];
  links: Link[] = [];

  graphWidth = 900;
  graphHeight = 300;

  csvContent: SafeResourceUrl = '';
  csvName = 'data.csv';

  constructor(private speciesService: SpeciesService, private interactomeService: InteractomeService, private domSanitizer: DomSanitizer,
              private geneService: GeneService, private interactionService: InteractionService, private formBuilder: FormBuilder ) {

  }

  ngOnInit() {
    this.level = 1;
    this.formSameSpecies = this.formBuilder.group({
      'species': ['', Validators.required],
      'interactomeA': ['', Validators.required],
      'interactomeB': ['', Validators.required],
      'gene': ['', Validators.required],
      'level': ['1', [Validators.required, Validators.min(1), Validators.max(3)]],
    });
    this.getSpecies();

    this.resizeGraph();

  }

  private resizeGraph() {
    if (window.innerWidth > 1024) {
      this.graphWidth = 900;
    } else {
      this.graphWidth = window.innerWidth - 120;
    }
    this.graphHeight = this.graphWidth / 3;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.resizeGraph();
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
    this.interactionService.getInteraction(formModel.gene, [formModel.interactomeA.id, formModel.interactomeB.id], formModel.level)
      .subscribe((interaction) => {
        this.hideTable = false;
        this.interaction = interaction;
        this.dataSource = new MatTableDataSource<Interaction>(this.interaction);
        this.dataSource.sortingDataAccessor = SortHelper.sortInteraction;
        this.dataSource.sort = this.sort;

        const nodes = [];
        const links = [];
        const csvData = [];

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

          const csvInteractomes = [];
          for (const interactome of item.interactomes) {
            const link = new Link(fromIndex, toIndex, (interactome.id % 4) + 1);
            links.push(link);
            csvInteractomes.push(interactome.id);
          }
          csvData.push([item.geneA.id, item.geneB.id, csvInteractomes.join('|'), item.degree]);
        }

        this.nodes = nodes;
        this.links = links;

        this.csvContent = this.domSanitizer.bypassSecurityTrustResourceUrl(
          CsvHelper.getCSV(this.displayedColumns, csvData)
        );
        this.csvName = 'interaction_' + formModel.gene + '_' + formModel.interactomeA.id  + '_' + formModel.interactomeB.id  + '.csv';

      });
  }

}
