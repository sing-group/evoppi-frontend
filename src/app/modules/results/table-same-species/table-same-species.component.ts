/*
 *  EvoPPI Frontend
 *
 *  Copyright (C) 2017-2022 - Noé Vázquez González,
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
import {MatDialog} from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {Interaction, Interactome, InteractomeDegree} from '../../../entities/bio';
import {SameSpeciesDataSource} from './same-species-data-source';
import {GeneInfoComponent} from '../gene-info/gene-info.component';
import {InteractionService} from '../services/interaction.service';
import {tap} from 'rxjs/operators';
import {OrderField, SortDirection} from '../../../entities/data';
import {CsvHelper} from '../../../helpers/csv.helper';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {environment} from '../../../../environments/environment';
import {ActivatedRoute} from '@angular/router';
import {animate, style, transition, trigger} from '@angular/animations';
import {Location} from '@angular/common';
import {InteractomeService} from '../services/interactome.service';
import {Status} from '../../../entities/execution';
import {InteractomeSelectionDialogComponent} from '../../shared/components/interactome-selection-dialog/interactome-selection-dialog.component';
import {ExportHelper} from '../../../helpers/export.helper';

@Component({
    selector: 'app-table-same-species',
    templateUrl: './table-same-species.component.html',
    styleUrls: ['./table-same-species.component.scss'],
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
export class TableSameSpeciesComponent implements OnInit {
    private static readonly MAX_UNCOLLAPSED = 10;

    @ViewChild(MatSort) public sort: MatSort;
    @ViewChild(MatPaginator) public paginator: MatPaginator;

    public displayedColumns?: string[];
    public paginatedDataSource?: SameSpeciesDataSource;
    public paginatorLength?: number;

    public permalink?: string;

    public csvContent?: SafeResourceUrl;
    public csvName?: string;
    private csvType?: string;

    public exportContent?: SafeResourceUrl;
    public exportName?: string;
    private exportType?: string;

    public processingCsv = false;
    public processingExport = false;
    public collapseInteractomes = false;
    public resultAvailable = false;

    public speciesName?: string;
    private queryGeneName?: string;
    private interactomes?: Interactome[];
    private interactions?: Interaction[];

    private visibleInteractomes?: Interactome[];

    private uuid?: string;
    private resultUrl?: string;

    public constructor(
        private readonly interactionService: InteractionService,
        private readonly interactomeService: InteractomeService,
        private readonly dialog: MatDialog,
        private readonly domSanitizer: DomSanitizer,
        private readonly route: ActivatedRoute,
        private readonly location: Location
    ) {
    }

    public ngOnInit(): void {
        this.uuid = this.route.snapshot.paramMap.get('id');
        this.resultUrl = environment.evoppiUrl + 'api/interaction/result/' + this.uuid;
        this.permalink = this.location.normalize('/results/table/same/' + this.uuid);

        this.paginatedDataSource = new SameSpeciesDataSource(this.interactionService);

        this.resultAvailable = false;

        this.interactionService.getInteractionResultSummarized(this.resultUrl)
            .subscribe(workResult => {
                this.interactomes = workResult.interactomes;
                this.speciesName = this.interactomes[0].speciesA.name;
                this.visibleInteractomes = this.interactomes;
                this.collapseInteractomes = this.visibleInteractomes.length > TableSameSpeciesComponent.MAX_UNCOLLAPSED;
                this.updateDisplayedColumns();
                this.paginatorLength = workResult.totalInteractions;

                if (workResult.status === Status.COMPLETED) {
                    this.paginatedDataSource.loading$
                        .subscribe(loading => {
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

    public hasSpeciesName(): boolean {
        return this.speciesName !== undefined;
    }

    public getChartUrl(): string {
        return this.uuid === undefined ? '#' : `/results/chart/same/${this.uuid}`;
    }

    public countInteractomes(): number {
        return this.interactomes.length;
    }

    public countVisibleInteractomes(): number {
        return this.visibleInteractomes.length;
    }

    public areAllInteractomesVisible(): boolean {
        return this.interactomes.length === this.visibleInteractomes.length;
    }

    public getDownloadCSVLabel(): string {
        if (this.csvContent === undefined) {
            if (this.processingCsv) {
                return 'Preparing CSV...';
            } else {
                return 'No CSV available';
            }
        } else {
            return `Download CSV (${this.csvType})`;
        }
    }

    public getDownloadExportLabel(): string {
        if (this.exportContent === undefined) {
            if (this.processingExport) {
                return 'Preparing export...';
            } else {
                return 'No export available';
            }
        } else {
            return `Download export (${this.exportType})`;
        }
    }

    public filterDegreesByInteractome(interactome: Interactome, interactomeDegrees: InteractomeDegree[]): InteractomeDegree[] {
        return interactomeDegrees.filter(degree => degree.id === interactome.id);
    }

    public getInteractomeNames(ids: number[]): string[] {
        return ids.map(id => this.interactomes.find(interactome => interactome.id === id).name).sort();
    }

    public canChangeCollapsed(): boolean {
        return this.visibleInteractomes.length <= TableSameSpeciesComponent.MAX_UNCOLLAPSED;
    }

    public onFilterInteractomes(): void {
        this.dialog.open(InteractomeSelectionDialogComponent, {
            minWidth: 600,
            data: {
                title: 'Select interactomes',
                interactomes: this.interactomes,
                selectedInteractomeIds: this.visibleInteractomes.map(interactome => interactome.id)
            }
        }).afterClosed().subscribe((selected: number[]) => {
            if (selected) {
                this.visibleInteractomes = this.interactomes.filter(interactome => selected.includes(interactome.id));
                this.collapseInteractomes = this.visibleInteractomes.length > TableSameSpeciesComponent.MAX_UNCOLLAPSED;
                this.updateDisplayedColumns();
                if (this.csvType === 'visible' || this.csvType === 'visible collapsed') {
                    this.csvType = undefined;
                    this.csvContent = undefined;
                    this.csvName = undefined;
                }
            }
        });
    }

    public onCollapseInteractomes(collapse: boolean): void {
        this.collapseInteractomes = collapse;
        this.updateDisplayedColumns();
    }

    private updateDisplayedColumns(): void {
        if (this.collapseInteractomes) {
            this.displayedColumns = ['GeneA', 'NameA', 'GeneB', 'NameB', 'Interactomes'];
        } else {
            this.displayedColumns = ['GeneA', 'NameA', 'GeneB', 'NameB',
                ...this.visibleInteractomes.map(interactome => `Interactome-${interactome.id}`)];
        }
    }

    public onClickGene(id: number): void {
        const dialogRef = this.dialog.open(GeneInfoComponent, {
            // width: '250px',
            maxHeight: window.innerHeight,
            data: { geneId: id, blastResults: [] }
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

    public getGeneIdsArray(): string[] {
        const geneIds = [];
        for (const interaction of this.interactions) {
            if (!geneIds.includes(interaction.geneA)) {
                geneIds.push(interaction.geneA);
            }
            if (!geneIds.includes(interaction.geneB)) {
                geneIds.push(interaction.geneB);
            }
        }
        return geneIds;
    }

    public onExportUniqueGeneIdsListPlain() {
        if (this.processingExport) {
            throw new Error('An export is already being processed');
        }

        this.exportType = 'plain';
        this.exportGeneIdsList();
    }

    public onExportUniqueGeneIdsListPanther() {
        if (this.processingExport) {
            throw new Error('An export is already being processed');
        }

        this.exportType = 'panther';
        this.exportGeneIdsList();
    }

    public exportGeneIdsList() {
        this.processingExport = true;

        this.exportName = undefined;
        this.exportContent = undefined;
        if (this.queryGeneName === undefined || this.interactions === undefined) {
            this.interactionService.getInteractionResult(this.resultUrl)
                .subscribe(result => {
                    this.queryGeneName = result.queryGene.name;
                    this.interactions = result.interactions.interactions;
                    return this.exportGeneIdsList();
                });
        } else {
            if(this.exportType === 'plain') {
                this.exportContent = this.domSanitizer.bypassSecurityTrustResourceUrl(
                    ExportHelper.getPlainList(this.getGeneIdsArray())
                );
            } else if(this.exportType === 'panther') {
                this.exportContent = this.domSanitizer.bypassSecurityTrustResourceUrl(
                    ExportHelper.getPantherText(this.getGeneIdsArray())
                );
            }

            this.exportName = `interactors_${this.queryGeneName}_${this.exportType}.txt`;

            this.processingExport = false;
        }
    }

    public onPrepareAllCsv(): void {
        if (this.processingCsv) {
            throw new Error('A CSV is already being processed');
        }

        this.csvType = 'all';
        this.prepareCsv(this.interactomes, false);
    }

    public onPrepareAllCollapsedCsv(): void {
        if (this.processingCsv) {
            throw new Error('A CSV is already being processed');
        }

        this.csvType = 'collapsed';
        this.prepareCsv(this.interactomes, true);
    }

    public onPrepareVisibleCsv(): void {
        if (this.processingCsv) {
            throw new Error('A CSV is already being processed');
        }

        this.csvType = 'visible';
        this.prepareCsv(this.visibleInteractomes, false);
    }

    public onPrepareVisibleCollapsedCsv(): void {
        if (this.processingCsv) {
            throw new Error('A CSV is already being processed');
        }

        this.csvType = 'visible collapsed';
        this.prepareCsv(this.visibleInteractomes, true);
    }

    private loadCurrentResultsPage(): void {
        let sortDirection: SortDirection = SortDirection.NONE;
        if (this.sort.direction === 'desc') {
            sortDirection = SortDirection.DESCENDING;
        } else if (this.sort.direction === 'asc') {
            sortDirection = SortDirection.ASCENDING;
        }

        let orderField: OrderField = OrderField.GENE_A_ID;
        let interactomeId: number;
        if (this.sort.active === 'GeneB') {
            orderField = OrderField.GENE_B_ID;
        } else if (this.sort.active === 'NameB') {
            orderField = OrderField.GENE_B_NAME;
        } else if (this.sort.active === 'NameA') {
            orderField = OrderField.GENE_A_NAME;
        } else if (this.sort.active && this.sort.active.indexOf('-') !== -1) {
            orderField = OrderField.INTERACTOME;
            interactomeId = +this.sort.active.substring(this.sort.active.indexOf('-') + 1);
        }

        this.paginatedDataSource.load(this.resultUrl, this.paginator.pageIndex, this.paginator.pageSize, sortDirection,
            orderField, interactomeId);
    }

    private prepareCsv(interactomes: Interactome[], collapsed: boolean): void {
        this.processingCsv = true;

        this.csvName = undefined;
        this.csvContent = undefined;

        if (this.queryGeneName === undefined || this.interactions === undefined) {
            this.interactionService.getInteractionResult(this.resultUrl)
                .subscribe(result => {
                    this.queryGeneName = result.queryGene.name;
                    this.interactions = result.interactions.interactions;
                    this.prepareCsv(interactomes, collapsed);
                });
        } else {
            const csvData = [];
            for (const interaction of this.interactions) {
                const csvRow = [
                    interaction.geneA, interaction.geneAName,
                    interaction.geneB, interaction.geneBName,
                ];

                if (collapsed) {
                    const degrees = interaction.interactomeDegrees.map(interactomeDegree => interactomeDegree.degree)
                        .filter((filterItem, position, self) => self.indexOf(filterItem) === position) // Removes duplicates
                        .sort()
                        .join(',');

                    csvRow.push(degrees);
                } else {
                    interactomes.forEach(interactome => {
                        const interactomeDegree = interaction.interactomeDegrees.find(degree => degree.id === interactome.id);

                        csvRow.push(interactomeDegree === undefined ? '' : interactomeDegree.degree);
                    });
                }

                csvData.push(csvRow);
            }

            let headers: string[];
            if (collapsed) {
                headers = ['Gene A', 'Name A', 'Gene B', 'Name B', 'Interactomes'];
            } else {
                headers = ['Gene A', 'Name A', 'Gene B', 'Name B', ...interactomes.map(interactome => interactome.name)];
            }

            this.csvContent = this.domSanitizer.bypassSecurityTrustResourceUrl(
                CsvHelper.getCSV(headers, csvData)
            );

            const interactomeIds = interactomes.map(interactome => interactome.id).join('_');
            this.csvName = `interaction_${this.queryGeneName}_${this.csvType}_${interactomeIds}.csv`;

            this.processingCsv = false;
        }
    }
}
