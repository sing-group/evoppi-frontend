/*
 *  EvoPPI Frontend
 *
 * Copyright (C) 2017-2018 - Noé Vázquez, Miguel Reboiro-Jato,
 * Jorge Vieria, Sara Rocha, Hugo López-Fernández, André Torres,
 * Rui Camacho, Florentino Fdez-Riverola, and Cristina P. Vieira.
 * .
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 */

import {Component, OnInit, ViewChild} from '@angular/core';
import {MatCheckboxChange, MatDialog, MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {Interaction, Interactome} from '../../../entities/bio';
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
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    displayedColumns: string[];
    dataSource: MatTableDataSource<Interaction>;
    paginatedDataSource: SameSpeciesDataSource;
    paginatorLength: number;

    resInteractomes: Interactome[] = [];
    interaction: Interaction[] = [];
    lastQueryMaxDegree: number;

    csvContent: SafeResourceUrl = '';
    csvName = 'data.csv';

    paginatedResultUrl = '';

    processing = false;
    collapseInteractomes = false;

    uuid = '';

    constructor(private interactionService: InteractionService, private dialog: MatDialog, private domSanitizer: DomSanitizer,
                private route: ActivatedRoute) {
    }

    ngOnInit() {

        this.uuid = this.route.snapshot.paramMap.get('id');

        this.paginatedDataSource = new SameSpeciesDataSource(this.interactionService);

        this.getResultPaginated(this.uuid);

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

    onCollapseInteractomes(event: MatCheckboxChange) {
        this.collapseInteractomes = event.checked;
        if (this.collapseInteractomes) {
            this.displayedColumns = ['GeneA', 'NameA', 'GeneB', 'NameB', 'Interactomes'];
        } else {
            this.displayedColumns = ['GeneA', 'NameA', 'GeneB', 'NameB',
                ...this.resInteractomes.map(resInteractome => 'Interactome-' + resInteractome.id.toString())];
        }
    }

    onClickGene(id: number) {
        const dialogRef = this.dialog.open(GeneInfoComponent, {
            // width: '250px',
            maxHeight: window.innerHeight,
            data: { geneId: id, blastResults: [] }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
        });

    }

    loadCurrentResultsPage() {
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

        this.paginatedDataSource.load(this.paginatedResultUrl, this.paginator.pageIndex, this.paginator.pageSize, sortDirection,
            orderField, interactomeId);
    }

    private getResult(uri: string) {
        this.processing = true;
        this.interactionService.getInteractionResult(uri)
            .subscribe((res) => {
                this.lastQueryMaxDegree = res.queryMaxDegree;
                this.interaction = res.interactions.interactions;
                this.resInteractomes = res.interactomes;

                const csvData = [];

                const getGene = geneId => res.interactions.genes.find(gene => gene.id === geneId);

                for (const interaction of this.interaction) {
                    const geneInfoA = getGene(interaction.geneA);
                    interaction.firstNameA = geneInfoA.defaultName;

                    const geneInfoB = getGene(interaction.geneB);
                    interaction.firstNameB = geneInfoB.defaultName;

                    const csvRow =
                        [
                            interaction.geneA, interaction.firstNameA,
                            interaction.geneB, interaction.firstNameB,
                        ];
                    if (this.collapseInteractomes) {
                        const degrees = interaction.interactomeDegrees.map(interactomeDegree => interactomeDegree.degree)
                            .filter((filterItem, position, self) => self.indexOf(filterItem) === position) // Removes duplicates
                            .sort()
                            .join(',');

                        csvRow.push(degrees);
                    } else {
                        res.interactomes.forEach((resInteractome) => {
                            const index: number = interaction.interactomeDegrees.findIndex((degree) => degree.id === resInteractome.id);
                            if (index !== -1) {
                                csvRow.push(interaction.interactomeDegrees[index].degree);
                            } else {
                                csvRow.push('');
                            }
                        });
                    }
                    csvData.push(csvRow);

                }

                let headers: string[];
                if (this.collapseInteractomes) {
                    headers = ['Gene A', 'Name A', 'Gene B', 'Name B', 'Interactomes'];
                    this.displayedColumns = ['GeneA', 'NameA', 'GeneB', 'NameB', 'Interactomes'];
                } else {
                    headers = ['Gene A', 'Name A', 'Gene B', 'Name B',
                        ...res.interactomes.map( resInteractome => resInteractome.name)];
                    this.displayedColumns = ['GeneA', 'NameA', 'GeneB', 'NameB',
                        ...res.interactomes.map(resInteractome => 'Interactome-' + resInteractome.id.toString())];
                }

                this.csvContent = this.domSanitizer.bypassSecurityTrustResourceUrl(
                    CsvHelper.getCSV(headers, csvData)
                );

                const interactomeIds = res.interactomes.map(interactome => interactome.id).join('_');
                const geneData = getGene(res.queryGene);
                let name: string = res.queryGene.toString();
                if (geneData && geneData.names && geneData.names.length > 0
                    && geneData.names[0].names && geneData.names[0].names.length > 0) {
                    name = geneData.names[0].names[0];
                }
                this.csvName = 'interaction_' + name + '_' + interactomeIds + '.csv';

                this.dataSource = new MatTableDataSource<Interaction>(this.interaction);
                this.dataSource.sort = undefined;
                this.dataSource.paginator = undefined;

                this.processing = false;
            });
    }

    private getResultPaginated(uuid: string) {
        this.paginatedResultUrl = environment.evoppiUrl + 'api/interaction/result/' + uuid ;
        this.interactionService.getInteractionResultSummarized(this.paginatedResultUrl)
            .subscribe((workRes) => {
                this.resInteractomes = workRes.interactomes;
                this.paginatorLength = workRes.totalInteractions;
                this.paginatedDataSource.load(this.paginatedResultUrl);
                this.paginatedDataSource.loading$.subscribe((res) => {
                    if (res === false) {
                        if (this.collapseInteractomes) {
                            this.displayedColumns = ['GeneA', 'NameA', 'GeneB', 'NameB', 'Interactomes'];
                        } else {
                            this.displayedColumns = ['GeneA', 'NameA', 'GeneB', 'NameB',
                                ...workRes.interactomes.map(resInteractome => 'Interactome-' + resInteractome.id.toString())];
                        }
                    }
                });
                this.processing = false;
            });
    }
}
