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
import {Status} from '../../interfaces/status';
import {SafeResourceUrl} from '@angular/platform-browser/src/security/dom_sanitization_service';
import {CsvHelper} from '../../helpers/csv.helper';
import {DomSanitizer} from '@angular/platform-browser';

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
  displayedColumns = ['GeneA', 'GeneB', 'ReferenceInteractome', 'TargetInteractome'];

  species: Species[];
  speciesA: Species[];
  speciesB: Species[];
  interactomes: Interactome[][] = [];
  referenceInteraction: Interaction[] = [];
  targetInteraction: Interaction[] = [];
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

  csvContent: SafeResourceUrl = '';
  csvName = 'data.csv';

  constructor(private speciesService: SpeciesService, private interactomeService: InteractomeService, private domSanitizer: DomSanitizer,
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
      .subscribe(species => {
        this.species = this.speciesA = this.speciesB = species;
      });
  }

  onChangeSpecies(value: Species, index: number): void {
    this.interactomes[index] = [];
    if (index === 1) {
      this.speciesB = this.species.slice();
      const i: number = this.speciesB.indexOf(value);
      this.speciesB.splice(i, 1);
    } else {
      this.speciesA = this.species.slice();
      const i: number = this.speciesA.indexOf(value);
      this.speciesA.splice(i, 1);
    }

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
      if ( res.status === Status.COMPLETED ) {
        this.getResult(res.resultReference);
      } else {
        alert('Work unfinished');
      }
    });
  }

  public getResult(uri: string) {
    const formModel = this.formDistinctSpecies.value;
    this.interactionService.getInteractionResult(uri)
      .subscribe((res) => {
        this.hideTable = false;
        this.referenceInteraction = [];
        this.targetInteraction = [];

        const consolidatedInteractions = [];

        // Filter out interactions which don't include the referenceInteractome
        for (const interaction of res.interactions) {
          if (interaction.interactomes.find(x => x === res.referenceInteractome.id)) {
            this.referenceInteraction.push(interaction);
          } else {
            this.targetInteraction.push(interaction);
          }
        }

        // Construct nodes and links
        let nodeIndex = 0;
        const nodes = res.referenceGenes.map(gene =>
          new Node(nodeIndex++, gene.id, res.blastResults.filter(blast => blast.qseqid === gene.id))
        );
        const links = [];
        const csvData = [];

        const getOrthologs = referenceGene => res.blastResults.filter(blast => blast.qseqid === referenceGene)
          .map(blast => blast.sseqid)
          .filter((item, position, self) => self.indexOf(item) === position); // Removes duplicates

        const getInteractionsOf = (geneA, geneB, interactions) =>
          interactions.filter(interaction =>
            (interaction.geneA === geneA && interaction.geneB === geneB)
            || (interaction.geneA === geneB && interaction.geneB === geneA)
          );

        const getReferenceInteractionOf = (geneA, geneB) => {
          const interactions = getInteractionsOf(geneA, geneB, this.referenceInteraction);

          return interactions.length === 1 ? interactions[0] : null;
        };
        const getTargetInteractionsOf = (geneA, geneB) => getInteractionsOf(geneA, geneB, this.targetInteraction);

        const getTargetInteractionsOfReferenceGenes = (geneA, geneB) => {
          const orthologsA = getOrthologs(geneA);
          const orthologsB = getOrthologs(geneB);

          let interactions = [];
          for (const orthologA of orthologsA) {
            for (const orthologB of orthologsB) {
              interactions = interactions.concat(getTargetInteractionsOf(orthologA, orthologB));
            }
          }

          return interactions;
        };

        const geneIds = res.referenceGenes.map(gene => gene.id)
          .sort((idA, idB) => idA - idB);

        for (let i = 0; i < geneIds.length - 1; i++) {
          for (let j = i + 1; j < geneIds.length; j++) {
            const geneAId = geneIds[i];
            const geneBId = geneIds[j];

            const referenceInteraction = getReferenceInteractionOf(geneAId, geneBId);
            const targetInteractions = getTargetInteractionsOfReferenceGenes(geneAId, geneBId);
            const inReference = referenceInteraction !== null;
            const inTarget = targetInteractions.length > 0;

            if (inReference || inTarget) {
              let type;
              const interactomes = [];
              let referenceDegree = '';
              let targetDegrees = [];

              if (inReference) {
                type = 1;
                interactomes.push(res.referenceInteractome.id);
                referenceDegree = referenceInteraction.degree;
              }

              if (inTarget) {
                type = 2;
                interactomes.push(res.targetInteractome.id);
                targetDegrees = targetInteractions.map(interaction => interaction.degree)
                  .filter((item, position, self) => self.indexOf(item) === position) // Removes duplicates
                  .sort((d1, d2) => d1 - d2);
              }

              if (inReference && inTarget) {
                type = 3;
              }

              const indexGeneA = nodes.findIndex(node => node.label === geneAId);
              const indexGeneB = nodes.findIndex(node => node.label === geneBId);

              links.push(new Link(indexGeneA, indexGeneB, type));
              nodes[indexGeneA].linkCount++;
              nodes[indexGeneB].linkCount++;

              csvData.push([geneAId, geneBId, referenceDegree, targetDegrees.join(', ')]);

              consolidatedInteractions.push({
                geneA: geneAId,
                geneB: geneBId,
                referenceDegree: referenceDegree,
                targetDegrees: targetDegrees
              });
            }
          }
        }

        // Set table source
        this.dataSource = new MatTableDataSource<Interaction>(consolidatedInteractions);
        this.dataSource.sort = undefined;

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
    this.formDistinctSpecies.patchValue({gene: value}, {emitEvent: false});
    this.genes = [];
  }
}
