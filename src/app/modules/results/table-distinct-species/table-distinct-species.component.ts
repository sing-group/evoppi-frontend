/*
 *  EvoPPI Frontend
 *
 *  Copyright (C) 2017-2019 - Noé Vázquez González,
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

import {Component, OnInit, ViewChild} from '@angular/core';
import {DistinctSpeciesDataSource} from './distinct-species-data-source';
import {BlastResult} from '../../../entities/bio/results';
import {GeneInfoComponent} from '../gene-info/gene-info.component';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {Interaction, Interactome} from '../../../entities/bio';
import {SortHelper} from '../../../helpers/sort.helper';
import {OrderField, SortDirection} from '../../../entities/data';
import {tap} from 'rxjs/operators';
import {InteractionService} from '../services/interaction.service';
import {ActivatedRoute} from '@angular/router';
import {animate, style, transition, trigger} from '@angular/animations';
import {environment} from '../../../../environments/environment';
import {InteractomeService} from '../services/interactome.service';
import {WorkResultManager} from '../../query/form-distinct-species/work-result-manager';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {CsvHelper} from '../../../helpers/csv.helper';
import {Node} from '../../../entities/bio/results/node.model';
import {Location} from '@angular/common';
import {Status} from '../../../entities/execution';

@Component({
    selector: 'app-table-distinct-species',
    templateUrl: './table-distinct-species.component.html',
    styleUrls: ['./table-distinct-species.component.scss'],
    animations: [
        trigger('slideInOut', [
            transition(':enter', [
                style({transform: 'translateY(-100%)'}),
                animate('100ms ease-in', style({transform: 'translateY(0%)'}))
            ]),
            transition(':leave', [
                animate('300ms ease-in', style({transform: 'translateY(-100%)'}))
            ])
        ])
    ]
})
export class TableDistinctSpeciesComponent implements OnInit {
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    dataSource: MatTableDataSource<Interaction>;
    paginatedDataSource: DistinctSpeciesDataSource;
    paginatorLength: number;
    displayedColumns = ['GeneA', 'NameA', 'GeneB', 'NameB', 'ReferenceInteractome', 'TargetInteractome'];

    paginatedResultUrl = '';

    referenceInteractomes: Interactome[];
    targetInteractomes: Interactome[];

    csvContent: SafeResourceUrl = '';
    csvName = 'data.csv';
    permalink: string;

    processing = false;

    uuid = '';

    resultAvailable = false;

    targetTitle = '';
    referenceTitle = '';

    constructor(private interactionService: InteractionService, private interactomeService: InteractomeService, private dialog: MatDialog,
                private domSanitizer: DomSanitizer, private route: ActivatedRoute, private location: Location) {
    }

    ngOnInit() {

        this.uuid = this.route.snapshot.paramMap.get('id');

        this.paginatedDataSource = new DistinctSpeciesDataSource(this.interactionService);

        this.getResultPaginated(this.uuid);

    }

    public initTable() {
        if (!this.dataSource || this.dataSource.sort) {
            return;
        }
        this.dataSource.sort = this.sort;
        this.dataSource.sortingDataAccessor = SortHelper.sortInteraction;
        this.dataSource.paginator = this.paginator;
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

    public getResult(uri: string) {
        this.processing = true;
        this.interactionService.getInteractionResult(uri)
            .subscribe(res => {
                const workManager = new WorkResultManager(res);

                this.referenceInteractomes = res.referenceInteractomes;
                this.targetInteractomes = res.targetInteractomes;

                // Construct nodes and links
                let nodeIndex = 0;
                const nodes = res.interactions.referenceGenes.map(gene =>
                    new Node(
                        nodeIndex++,
                        gene.geneId,
                        gene.defaultName,
                        res.interactions.blastResults.filter(blast => blast.qseqid === gene.geneId))
                );
                const csvData = [];

                const geneIds = res.interactions.referenceGenes.map(gene => gene.geneId)
                    .sort((idA, idB) => idA - idB);

                for (let i = 0; i < geneIds.length; i++) {
                    for (let j = i; j < geneIds.length; j++) {
                        const geneAId = geneIds[i];
                        const geneBId = geneIds[j];

                        const referenceInteraction = workManager.getReferenceInteractionOf(geneAId, geneBId);
                        const targetInteractions = workManager.getTargetInteractionsOf(geneAId, geneBId);
                        const inReference = referenceInteraction !== null;
                        const inTarget = targetInteractions.length > 0;

                        if (inReference || inTarget) {
                            let type;
                            let referenceDegree = '';
                            let targetDegrees = [];

                            if (inReference) {
                                referenceDegree = String(referenceInteraction.interactomeDegrees[0].degree);
                            }

                            if (inTarget) {
                                targetDegrees = targetInteractions.map(interaction => interaction.interactomeDegrees[0].degree)
                                    .filter((item, position, self) => self.indexOf(item) === position) // Removes duplicates
                                    .sort((d1, d2) => d1 - d2);
                            }

                            if (inReference && inTarget) {
                                type = 3;
                            }

                            const indexGeneA = nodes.findIndex(node => node.label === geneAId);
                            const indexGeneB = nodes.findIndex(node => node.label === geneBId);

                            nodes[indexGeneA].linkCount++;
                            nodes[indexGeneB].linkCount++;

                            csvData.push([geneAId, nodes[indexGeneA].description, geneBId, nodes[indexGeneB].description,
                                referenceDegree, targetDegrees.join(', ')]);
                        }
                    }
                }

                this.csvContent = this.domSanitizer.bypassSecurityTrustResourceUrl(
                    CsvHelper.getCSV(['Gene A', 'Name A', 'Gene B', 'Name B', this.referenceTitle, this.targetTitle], csvData)
                );
                this.csvName = 'interaction_' + res.queryGene.name + '_' + res.referenceInteractomes.map(x => x.id) + '_'
                    + res.targetInteractomes.map(x => x.id) + '.csv';

                this.processing = false;
            });
    }

    private getResultPaginated(uuid: string) {
        this.paginatedResultUrl = environment.evoppiUrl + 'api/interaction/result/' + uuid;
        this.permalink = this.location.normalize('/results/table/distinct/' + uuid);
        this.interactionService.getInteractionResultSummarized(this.paginatedResultUrl)
            .subscribe((workRes) => {
                this.referenceInteractomes = workRes.referenceInteractomes;
                this.targetInteractomes = workRes.targetInteractomes;
                this.referenceTitle = workRes.referenceInteractomes[0].species.name + ': '
                    + workRes.referenceInteractomes.map(resInteractome => resInteractome.name).join(', ');
                this.targetTitle = workRes.targetInteractomes[0].species.name + ': '
                    + workRes.targetInteractomes.map(targetInteractome => targetInteractome.name).join(', ');
                this.paginatorLength = workRes.totalInteractions;
                this.paginatedDataSource.load(this.paginatedResultUrl);
                this.paginatedDataSource.loading$.subscribe((res) => {
                    if (res === false) {
                        // this.showTable = true;
                    }
                });
                this.processing = false;
                if (workRes.status === Status.COMPLETED) {
                    this.resultAvailable = true;
                }
            }, (error) => {
                this.processing = false;
                this.resultAvailable = false;
            });
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

    onPrepareCSV() {
        if (!this.processing) {
            this.getResult(this.paginatedResultUrl);
        }
    }

    downloadSingleFasta() {
        this.interactomeService.downloadSingleFasta(this.paginatedResultUrl, this.uuid);
    }

    downloadFasta(suffix: string, id: number) {
        this.interactomeService.downloadFasta(this.paginatedResultUrl, suffix, id);
    }

}
