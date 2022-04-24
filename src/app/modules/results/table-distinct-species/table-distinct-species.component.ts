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
import {MatDialog} from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {Interaction, Interactome, InteractomeDegree} from '../../../entities/bio';
import {OrderField, SortDirection} from '../../../entities/data';
import {tap} from 'rxjs/operators';
import {InteractionService} from '../services/interaction.service';
import {ActivatedRoute} from '@angular/router';
import {animate, style, transition, trigger} from '@angular/animations';
import {environment} from '../../../../environments/environment';
import {InteractomeService} from '../services/interactome.service';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {CsvHelper} from '../../../helpers/csv.helper';
import {Location} from '@angular/common';
import {Status} from '../../../entities/execution';
import {BlastQueryOptions} from '../../../entities/bio/results/blast-query-options.model';
import {BlastParamsDialogComponent} from '../blast-params-dialog/blast-params-dialog.component';

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
    @ViewChild(MatSort) public sort: MatSort;
    @ViewChild(MatPaginator) public paginator: MatPaginator;

    public displayedColumns = ['GeneA', 'NameA', 'GeneB', 'NameB', 'ReferenceInteractome', 'TargetInteractome'];
    public paginatedDataSource?: DistinctSpeciesDataSource;
    public paginatorLength?: number;

    public permalink?: string;

    public csvContent?: SafeResourceUrl;
    public csvName?: string;

    public processingCsv = false;
    public resultAvailable = false;

    public referenceSpeciesName?: string;
    public targetSpeciesName?: string;

    public referenceInteractomesTitle?: string;
    public targetInteractomesTitle?: string;

    private queryGeneName?: string;
    private referenceInteractomes?: Interactome[];
    private targetInteractomes?: Interactome[];
    private interactions?: Interaction[];
    private blastQueryOptions?: BlastQueryOptions;

    private uuid?: string;
    private resultUrl = '';


    public constructor(
        private readonly interactionService: InteractionService,
        private readonly interactomeService: InteractomeService,
        private readonly dialog: MatDialog,
        private readonly domSanitizer: DomSanitizer,
        private readonly route: ActivatedRoute, private location: Location
    ) {
    }

    public ngOnInit(): void {
        this.uuid = this.route.snapshot.paramMap.get('id');
        this.resultUrl = environment.evoppiUrl + 'api/interaction/result/' + this.uuid;
        this.permalink = this.location.normalize('/results/table/distinct/' + this.uuid);

        this.paginatedDataSource = new DistinctSpeciesDataSource(this.interactionService);

        this.resultAvailable = false;

        this.interactionService.getInteractionResultSummarized(this.resultUrl)
            .subscribe((workResult) => {
                this.blastQueryOptions = workResult.blastQueryOptions;

                this.referenceInteractomes = workResult.referenceInteractomes;
                this.targetInteractomes = workResult.targetInteractomes;

                this.referenceSpeciesName = workResult.referenceInteractomes[0].speciesA.name;
                this.targetSpeciesName = workResult.targetInteractomes[0].speciesA.name;

                this.referenceInteractomesTitle = this.referenceSpeciesName + ': '
                    + workResult.referenceInteractomes.map(interactome => interactome.name).join(', ');
                this.targetInteractomesTitle = this.targetSpeciesName + ': '
                    + workResult.targetInteractomes.map(interactome => interactome.name).join(', ');

                this.paginatorLength = workResult.totalInteractions;

                if (workResult.status === Status.COMPLETED) {
                    this.paginatedDataSource.loading$.subscribe((loading) => {
                        if (!loading) {
                            this.resultAvailable = true;
                        }
                    });
                    this.paginatedDataSource.load(this.resultUrl);
                }
            }, (error) => {
                this.resultAvailable = false;
            });
    }

    public initPaginator(): void {
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

    public hasSpeciesNames(): boolean {
        return this.referenceSpeciesName !== undefined && this.targetSpeciesName !== undefined;
    }

    public getChartUrl(): string {
        return this.uuid === undefined ? '#' : `/results/chart/distinct/${this.uuid}`;
    }

    public filterDegreesByInteractome(interactome: Interactome, interactomeDegrees: InteractomeDegree[]): InteractomeDegree[] {
        return interactomeDegrees.filter(degree => degree.id === interactome.id);
    }

    public getReferenceInteractomeNames(ids: number[]): string[] {
        return ids.map(id => this.referenceInteractomes.find(interactome => interactome.id === id).name).sort();
    }

    public getTargetInteractomeNames(ids: number[]): string[] {
        return ids.map(id => this.targetInteractomes.find(interactome => interactome.id === id).name).sort();
    }

    public onClickGene(id: number, blastResults: BlastResult[]): void {
        const dialogRef = this.dialog.open(GeneInfoComponent, {
            maxHeight: window.innerHeight,
            data: { geneId: id, blastResults: blastResults }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
        });
    }

    public onDownloadSingleFasta(): void {
        this.interactionService.downloadSingleFasta(this.resultUrl, this.uuid);
    }

    public onDownloadFasta(suffix: string, id: number): void {
        this.interactionService.downloadFasta(this.resultUrl, suffix, id);
    }

    public onPrepareCsv(): void {
        if (this.processingCsv) {
            throw new Error('A CSV is already being processed');
        }

        this.prepareCsv();
    }

    private loadCurrentResultsPage(): void {
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

        this.paginatedDataSource.load(this.resultUrl, this.paginator.pageIndex, this.paginator.pageSize, sortDirection, orderField);
    }

    private prepareCsv(): void {
        this.processingCsv = true;

        this.csvName = undefined;
        this.csvContent = undefined;

        if (this.queryGeneName === undefined || this.interactions === undefined) {
            this.interactionService.getInteractionResult(this.resultUrl)
                .subscribe(result => {
                    this.queryGeneName = result.queryGene.name;
                    this.interactions = result.interactions.interactions;
                    this.prepareCsv();
                });
        } else {
            const referenceInteractomeIds = this.referenceInteractomes.map(interactome => interactome.id);
            const targetInteractomeIds = this.targetInteractomes.map(interactome => interactome.id);

            function filterDegrees(degrees: InteractomeDegree[], interactomeIds: number[]): string {
                return degrees
                    .filter(interactomeDegree => interactomeIds.includes(interactomeDegree.id))
                    .map(interactomeDegree => interactomeDegree.degree)
                    .filter((filterItem, position, self) => self.indexOf(filterItem) === position) // Removes duplicates
                    .sort()
                    .join(',');
            }

            const csvData: string[][] = this.interactions.map(interaction => [
                interaction.geneA.toString(), interaction.geneAName,
                interaction.geneB.toString(), interaction.geneBName,
                filterDegrees(interaction.interactomeDegrees, referenceInteractomeIds),
                filterDegrees(interaction.interactomeDegrees, targetInteractomeIds)
            ]);

            this.csvContent = this.domSanitizer.bypassSecurityTrustResourceUrl(
                CsvHelper.getCSV(
                    ['Gene A', 'Name A', 'Gene B', 'Name B', this.referenceInteractomesTitle, this.targetInteractomesTitle],
                    csvData
                )
            );
            const referenceIds = this.referenceInteractomes.map(interactome => interactome.id).join(',');
            const targetIds = this.targetInteractomes.map(interactome => interactome.id).join(',');

            this.csvName = `interaction_${this.queryGeneName}_${referenceIds}_${targetIds}.csv`;

            this.processingCsv = false;
        }
    }

    public onShowBlastParams(): void {
        const dialogRef = this.dialog.open(BlastParamsDialogComponent, {
            maxHeight: window.innerHeight,
            minWidth: 400,
            data: this.blastQueryOptions
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
        });
    }
}
