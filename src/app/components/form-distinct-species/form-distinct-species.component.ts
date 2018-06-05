/*
 *  EvoPPI Frontend
 *
 *  Copyright (C) 2017-2018 - Noé Vázquez González,
 *  Miguel Reboiro-Jato, Jorge Vieira, Hugo López-Fernández,
 *  and Cristina Vieira.
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

import {Component, HostListener, Input, OnInit, ViewChild} from '@angular/core';
import {SpeciesService} from '../../services/species.service';
import {Interactome} from '../../interfaces/interactome';
import {Species} from '../../interfaces/species';
import {InteractomeService} from '../../services/interactome.service';
import {GeneService} from '../../services/gene.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Interaction} from '../../interfaces/interaction';
import {MatDialog, MatSelectionList, MatSort, MatTableDataSource, MatPaginator, MatTabChangeEvent} from '@angular/material';
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
import {GeneInfoComponent} from '../gene-info/gene-info.component';
import {BlastResult} from '../../interfaces/blast-result';
import {Location} from '@angular/common';
import {DistinctSpeciesDataSource} from './distinct-species-data-source';
import {tap} from 'rxjs/operators';
import {OrderField} from '../../enums/order-field.enum';
import {SortDirection} from '../../enums/sort-direction.enum';

@Component({
  selector: 'app-form-distinct-species',
  templateUrl: './form-distinct-species.component.html',
  styleUrls: ['./form-distinct-species.component.css']
})
export class FormDistinctSpeciesComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSelectionList) geneList: MatSelectionList;

  private _work: Work;

  formDistinctSpecies: FormGroup;
  dataSource: MatTableDataSource<Interaction>;
  paginatedDataSource: DistinctSpeciesDataSource;
  paginatorLength: number;
  displayedColumns = ['GeneA', 'NameA', 'GeneB', 'NameB', 'ReferenceInteractome', 'TargetInteractome'];

  species: Species[];
  referenceSpecies: Species[];
  targetSpecies: Species[];
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

  showForm = true;
  showTable = false;
  searchingGenes = false;

  nodes: Node[] = [];
  links: Link[] = [];
  lastQueryMaxDegree: number;

  graphWidth = 900;
  graphHeight = 450;

  csvContent: SafeResourceUrl = '';
  csvName = 'data.csv';

  resultUrl = '';
  paginatedResultUrl = '';
  fullResultAvailable = false;

  referenceInteractomes: Interactome[];
  targetInteractomes: Interactome[];

  permalink: string;
  processing = false;

  constructor(private speciesService: SpeciesService, private interactomeService: InteractomeService, private domSanitizer: DomSanitizer,
              private geneService: GeneService, private interactionService: InteractionService, private formBuilder: FormBuilder,
              private dialog: MatDialog, private location: Location) { }

  ngOnInit() {
    this.level = 1;
    this.eValue = 0.05;
    this.minAlignLength = 18;
    this.numDescriptions =  1;
    this.minIdentity = 95;
    this.genesInput = '';
    this.formDistinctSpecies = this.formBuilder.group({
      'referenceSpecies': ['', Validators.required],
      'targetSpecies': ['', Validators.required],
      'referenceInteractome': ['', Validators.required],
      'targetInteractome': ['', Validators.required],
      'gene': ['', Validators.required],
      'eValue': ['0.05', [Validators.required, Validators.min(0)]],
      'minAlignLength': ['18', [Validators.required, Validators.min(0)]],
      'numDescriptions': ['1', [Validators.required, Validators.min(1), Validators.max(100)]],
      'minIdentity': ['95', [Validators.required, Validators.min(0), Validators.max(100)]],
      'level': ['1', [Validators.required, Validators.min(1), Validators.max(3)]],
    });

    this.getSpecies();

    this.resizeGraph();

    this.formDistinctSpecies.controls.gene.valueChanges.debounceTime(500).subscribe((res) => {
      this.onSearchGenes(res);
    });

    this.paginatedDataSource = new DistinctSpeciesDataSource(this.interactionService);
  }

  initPaginator() {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    this.sort.sortChange
      .pipe(
        tap(() => this.loadCurrentResultsPage())
      )
      .subscribe();

    this.paginator.page
      .pipe(
        tap(() => this.loadCurrentResultsPage())
      )
      .subscribe();
  }

  loadCurrentResultsPage() {
    let sortDirection: SortDirection = SortDirection.NONE;
    if (this.sort.direction === 'desc') {
      sortDirection = SortDirection.DESCENDING;
    } else if (this.sort.direction === 'asc') {
      sortDirection = SortDirection.ASCENDING;
    }

    let orderField: OrderField = OrderField.GENE_A_ID;
    if (this.sort.active === 'GeneB') {
      orderField = OrderField.GENE_B_ID;
    } else if (this.sort.active === 'NameB') {
      orderField = OrderField.GENE_B_NAME;
    } else if (this.sort.active === 'NameA') {
      orderField = OrderField.GENE_A_NAME;
    } // TODO: order by interactome

    this.paginatedDataSource.load(this.paginatedResultUrl, this.paginator.pageIndex, this.paginator.pageSize, sortDirection,
      orderField);
  }

  @Input()
  set work(value: Work) {
    if (value && value.name.startsWith('Different species')) {
      this.showForm = false;
      this.openDialog(value);
      this._work = value;
    }
  }
  get work(): Work {
    console.log('get work', this._work);
    return this._work;
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
        this.species = this.referenceSpecies = this.targetSpecies = species;
      });
  }

  onChangeForm(): void {
    this.csvContent = '';
  }

  selectAllInteractomes(control: string, values) {
    this.formDistinctSpecies.controls[control].setValue(values);
  }

  deselectAllInteractomes(control: string) {
    this.formDistinctSpecies.controls[control].setValue([]);
  }

  onChangeSpecies(value: Species, index: number): void {
    this.interactomes[index] = [];
    if (index === 1) {
      this.targetSpecies = this.species.slice();
      const i: number = this.targetSpecies.indexOf(value);
      this.targetSpecies.splice(i, 1);
    } else {
      this.referenceSpecies = this.species.slice();
      const i: number = this.referenceSpecies.indexOf(value);
      this.referenceSpecies.splice(i, 1);
    }

    for (const interactome of value.interactomes) {
      this.interactomeService.getInteractome(interactome.id)
        .subscribe(res => this.interactomes[index].push(res));
    }
  }

  onSearchGenes(value: string): void {
    if (!this.formDistinctSpecies.get('referenceInteractome').valid) {
      alert('First, select Reference Interactome');
      return;
    } else if (value === '') {
      this.genes = [];
      return;
    }
    this.searchingGenes = true;
    this.geneService.getGeneName(value, this.formDistinctSpecies.value.referenceInteractome.map((item) => item.id))
      .subscribe(res => {
        this.genes = res;
        this.searchingGenes = false;
      });

  }

  onCompare(): void {
    if (this.processing) {
      return;
    }
    this.fullResultAvailable = false;
    this.processing = true;
    if (this.formDistinctSpecies.status === 'INVALID') {
      console.log('INVALID');
      return;
    }
    this.showTable = false;
    const formModel = this.formDistinctSpecies.value;
    this.interactionService.getDistinctSpeciesInteraction(formModel.gene, formModel.referenceInteractome.map((item) => item.id),
      formModel.targetInteractome.map((item) => item.id), formModel.level, formModel.eValue, formModel.numDescriptions,
      formModel.minIdentity / 100, formModel.minAlignLength)
      .subscribe((work) => {
        this.permalink = this.location.normalize('/compare?result=' + work.id.id);
        this.openDialog(work);
      }, (error) => {
        this.formDistinctSpecies.setErrors({'invalidForm': 'Error: ' + error.error});
        this.processing = false;
    });
  }

  private openDialog(data: Work) {
    this.resultUrl = data.resultReference;
    setTimeout(() => {
      const dialogRef = this.dialog.open(WorkStatusComponent, {
        disableClose: true,
        data: {data}
      });

      dialogRef.afterClosed().subscribe(res => {
        if (res.status === Status.COMPLETED) {
          this.getResultPaginated(res.resultReference);
        } else {
          alert('Work unfinished');
        }
        this.processing = false;
      });
    });
  }

  private getResultPaginated(uri: string) {
    this.paginatedResultUrl = uri;
    this.interactionService.getInteractionResultSummarized(uri)
      .subscribe((workRes) => {
        this.referenceInteractomes = workRes.referenceInteractomes;
        this.targetInteractomes = workRes.targetInteractomes;
        this.paginatorLength = workRes.totalInteractions;
        this.paginatedDataSource.load(uri);
        this.paginatedDataSource.loading$.subscribe((res) => {
          if (res === false) {
            this.showTable = true;
          }
        });
      });
  }

  public getResult(uri: string) {
    this.processing = true;
    this.interactionService.getInteractionResult(uri)
      .subscribe((res) => {
        this.lastQueryMaxDegree = res.queryMaxDegree;
        this.referenceInteractomes = res.referenceInteractomes;
        this.targetInteractomes = res.targetInteractomes;

        this.referenceInteraction = [];
        this.targetInteraction = [];

        const consolidatedInteractions = [];

        // Filter out interactions which don't include the referenceInteractome
        for (const interaction of res.interactions.interactions) {
          if (interaction.interactomeDegrees.find(
            x => res.referenceInteractomes.filter( item => item.id === x.id).length > 0)) {
            this.referenceInteraction.push(interaction);
          } else {
            this.targetInteraction.push(interaction);
          }
        }

        // Construct nodes and links
        let nodeIndex = 0;
        const nodes = res.interactions.referenceGenes.map(gene =>
          new Node(
            nodeIndex++,
            gene.geneId,
            gene.defaultName,
            res.interactions.blastResults.filter(blast => blast.qseqid === gene.geneId))
        );
        const links = [];
        const csvData = [];

        const getOrthologs = referenceGene => res.interactions.blastResults.filter(blast => blast.qseqid === referenceGene)
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

        const geneIds = res.interactions.referenceGenes.map(gene => gene.geneId)
          .sort((idA, idB) => idA - idB);

        for (let i = 0; i < geneIds.length; i++) {
          for (let j = i; j < geneIds.length; j++) {
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
                interactomes.push(res.referenceInteractomes.map(x => x.id));
                referenceDegree = referenceInteraction.interactomeDegrees[0].degree;
              }

              if (inTarget) {
                type = 2;
                interactomes.push(res.targetInteractomes.map(x => x.id));
                targetDegrees = targetInteractions.map(interaction => interaction.interactomeDegrees[0].degree)
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

              csvData.push([geneAId, nodes[indexGeneA].description, geneBId, nodes[indexGeneB].description,
                referenceDegree, targetDegrees.join(', ')]);

              consolidatedInteractions.push({
                geneA: geneAId,
                typeA: nodes[indexGeneA].type,
                firstNameA: nodes[indexGeneA].description,
                blastResultsA: nodes[indexGeneA].blastResults,
                geneB: geneBId,
                typeB: nodes[indexGeneB].type,
                firstNameB: nodes[indexGeneB].description,
                blastResultsB: nodes[indexGeneB].blastResults,
                referenceDegree: referenceDegree,
                targetDegrees: targetDegrees
              });
            }
          }
        }

        this.nodes = nodes;
        this.links = links;

        const referenceTitle = res.referenceInteractomes.map( resInteractome => resInteractome.name + '(' + resInteractome.species.name + ')').join(', ');
        const targetTitle = res.targetInteractomes.map( targetInteractome => targetInteractome.name + '(' + targetInteractome.species.name + ')').join(', ');
        this.csvContent = this.domSanitizer.bypassSecurityTrustResourceUrl(
          CsvHelper.getCSV(['Gene A', 'Name A', 'Gene B', 'Name B', referenceTitle, targetTitle], csvData)
        );
        this.csvName = 'interaction_' + res.queryGene + '_' + res.referenceInteractomes.map(x => x.id) + '_'
          + res.targetInteractomes.map(x => x.id) + '.csv';

        this.showForm = false;
        this.showTable = true;

        // Set table source
        this.dataSource = new MatTableDataSource<Interaction>(consolidatedInteractions);
        this.dataSource.sort = undefined;
        this.dataSource.paginator = undefined;
        this.fullResultAvailable = true;
      });
  }

  public initTable() {
    if (!this.dataSource || this.dataSource.sort) {
      return;
    }
    this.dataSource.sort = this.sort;
    this.dataSource.sortingDataAccessor = SortHelper.sortInteraction;
    this.dataSource.paginator = this.paginator;
  }

  public onGeneSelected(value) {
    this.genesInput = value;
    this.formDistinctSpecies.patchValue({gene: value}, {emitEvent: false});
    this.genes = [];
  }

  onClickGene(id: number, blastResults: BlastResult[]) {
    const dialogRef = this.dialog.open(GeneInfoComponent, {
      maxHeight: window.innerHeight,
      data: { geneId: id, blastResults: blastResults }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });

  }

  onChangeTab(event: MatTabChangeEvent) {
    if (event.tab.textLabel === 'Graph view' && !this.fullResultAvailable) {
      this.getResult(this.resultUrl);
    }
  }

  onPrepareCSV() {
    if (!this.processing && !this.fullResultAvailable) {
      this.getResult(this.resultUrl);
    }
  }

}
