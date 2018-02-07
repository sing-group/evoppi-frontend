import {Component, HostListener, OnInit, ViewChild} from '@angular/core';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/debounceTime';
import {Species} from '../../interfaces/species';
import {SpeciesService} from '../../services/species.service';
import {InteractomeService} from '../../services/interactome.service';
import {Interactome} from '../../interfaces/interactome';
import {GeneService} from '../../services/gene.service';
import {InteractionService} from '../../services/interaction.service';
import {Interaction} from '../../interfaces/interaction';
import {MatDialog, MatSelectionList, MatSort, MatTableDataSource} from '@angular/material';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Link} from '../../classes/link';
import {Node} from '../../classes/node';
import {CsvHelper} from '../../helpers/csv.helper';
import {DomSanitizer} from '@angular/platform-browser';
import {SafeResourceUrl} from '@angular/platform-browser/src/security/dom_sanitization_service';
import {GeneInfo} from '../../interfaces/gene-info';
import {SortHelper} from '../../helpers/sort.helper';
import {WorkStatusComponent} from '../work-status/work-status.component';
import {Work} from '../../interfaces/work';
import {Status} from '../../interfaces/status';
import {map} from 'rxjs/operators';
import {GeneInfoComponent} from '../gene-info/gene-info.component';

@Component({
  selector: 'app-form-same-species',
  templateUrl: './form-same-species.component.html',
  styleUrls: ['./form-same-species.component.css']
})
export class FormSameSpeciesComponent implements OnInit {

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatSelectionList) geneList: MatSelectionList;

  formSameSpecies: FormGroup;
  dataSource: MatTableDataSource<Interaction>;
  displayedColumns = ['GeneA', 'GeneB', 'Interactomes', 'Degree'];

  species: Species[];
  interactomes: Interactome[] = [];
  interactomesA: Interactome[] = [];
  interactomesB: Interactome[] = [];
  interaction: Interaction[] = [];
  genes: GeneInfo[];
  level: number;
  genesInput: string;

  hideTable = true;


  nodes: Node[] = [];
  links: Link[] = [];

  graphWidth = 900;
  graphHeight = 450;

  csvContent: SafeResourceUrl = '';
  csvName = 'data.csv';

  resultUrl = '';

  constructor(private speciesService: SpeciesService, private interactomeService: InteractomeService, private domSanitizer: DomSanitizer,
              private geneService: GeneService, private interactionService: InteractionService, private formBuilder: FormBuilder,
              private dialog: MatDialog) {

  }

  ngOnInit() {
    this.level = 1;
    this.genesInput = '';
    this.formSameSpecies = this.formBuilder.group({
      'species': ['', Validators.required],
      'interactomeA': ['', Validators.required],
      'interactomeB': ['', Validators.required],
      'gene': ['', Validators.required],
      'level': ['1', [Validators.required, Validators.min(1), Validators.max(3)]],
    });
    this.getSpecies();

    this.resizeGraph();

    this.formSameSpecies.controls.gene.valueChanges.debounceTime(500).subscribe((res) => {
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
      .pipe(
        map( species => {
          return species.filter( (specie: Species) => specie.interactomes.length > 1);
        })
      )
      .subscribe(species => this.species = species);
  }

  onChangeForm(): void {
    this.csvContent = '';
  }

  onChangeSpecies(value: Species): void {
    this.interactomes = [];
    this.interactomesA = [];
    this.interactomesB = [];

    for (const interactome of value.interactomes) {
      this.interactomeService.getInteractome(interactome.id)
        .subscribe(res => {
          this.interactomes.push(res);
          this.interactomesA.push(res);
          this.interactomesB.push(res);
        });
    }
  }

  onSelectInteractomeA(value: Interactome): void {
    this.interactomesB = this.interactomes.slice();
    const index: number = this.interactomesB.indexOf(value);
    this.interactomesB.splice(index, 1);
  }

  onSelectInteractomeB(value: Interactome): void {
    this.interactomesA = this.interactomes.slice();
    const index: number = this.interactomesA.indexOf(value);
    this.interactomesA.splice(index, 1);
  }

  onSearchGenes(value: string): void {
    let interactomes = [];
    if (this.interactomes.length > 0) {
      interactomes = this.interactomes.map((interactome) => interactome.id);
    }
    this.geneService.getGeneName(value, interactomes)
      .subscribe(res => {
        this.genes = res;
      });

  }
  onCompare(): void {
    if (this.formSameSpecies.status === 'INVALID') {
      console.log('INVALID');
      return;
    }
    this.hideTable = true;
    const formModel = this.formSameSpecies.value;
    this.interactionService.getSameSpeciesInteraction(formModel.gene, [formModel.interactomeA.id, formModel.interactomeB.id],
      formModel.level)
      .subscribe((work) => {
        this.openDialog(work);
      });
  }

  private openDialog(data: Work) {
    this.resultUrl = data.resultReference;
    const dialogRef = this.dialog.open(WorkStatusComponent, {
      disableClose: true,
      data: {data}
    });

    dialogRef.afterClosed().subscribe(res => {
      console.log(res.resultReference);
      if ( res.status === Status.COMPLETED ) {
        this.getResult(res.resultReference);
      } else {
        alert('Work unfinished');
      }
    });
  }

  private getResult(uri: string) {
    const formModel = this.formSameSpecies.value;
    this.interactionService.getInteractionResult(uri)
      .subscribe((res) => {
        this.hideTable = false;
        this.interaction = res.interactions;
        this.dataSource = new MatTableDataSource<Interaction>(this.interaction);
        this.dataSource.sort = undefined;

        const nodes = [];
        const links = [];
        const csvData = [];

        for (const item of this.interaction) {
          const from = new Node(nodes.length, item.geneA);
          let fromIndex = nodes.findIndex(x => x.label === from.label);
          if (fromIndex === -1) {
            fromIndex = nodes.length;
            nodes.push(from);
          } else {
            nodes[fromIndex].linkCount++;
          }

          const to = new Node(nodes.length, item.geneB);
          let toIndex = nodes.findIndex(x => x.label === to.label);
          if (toIndex === -1) {
            toIndex = nodes.length;
            nodes.push(to);
          } else {
            nodes[toIndex].linkCount++;
          }

          const csvInteractomes = [];
          // TODO: multiple interactomes get link overwritten
          for (const interactome of item.interactomes) {
            const link = new Link(fromIndex, toIndex, (interactome % 4) + 1);
            links.push(link);
            csvInteractomes.push(interactome);
          }
          csvData.push([item.geneA, item.geneB, csvInteractomes.join('|'), item.degree]);
        }

        this.nodes = nodes;
        this.links = links;

        this.csvContent = this.domSanitizer.bypassSecurityTrustResourceUrl(
          CsvHelper.getCSV(this.displayedColumns, csvData)
        );
        this.csvName = 'interaction_' + formModel.gene + '_' + formModel.interactomeA.id  + '_' + formModel.interactomeB.id  + '.csv';

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
    this.formSameSpecies.patchValue({gene: value}, {emitEvent: false});
    this.genes = [];
  }

  public exportFasta(id: number) {

  }

  onClickGene(id: number) {
    console.log(id);

    const dialogRef = this.dialog.open(GeneInfoComponent, {
      // width: '250px',
      maxHeight: window.innerHeight,
      data: { geneId: id, blastResults: [] }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });

  }
}
