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
import {DistinctSpeciesDataSource} from './distinct-species-data-source';
import {BlastResult} from '../../../entities/bio/results';
import {GeneInfoComponent} from '../gene-info/gene-info.component';
import {MatDialog, MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {Interaction, Interactome} from '../../../entities/bio';
import {SortHelper} from '../../../helpers/sort.helper';
import {OrderField, SortDirection} from '../../../entities/data';
import {tap} from 'rxjs/operators';
import {InteractionService} from '../services/interaction.service';
import {ActivatedRoute} from '@angular/router';
import {animate, style, transition, trigger} from '@angular/animations';
import {environment} from '../../../../environments/environment';

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

    processing = false;

    uuid = '';

    constructor(private interactionService: InteractionService, private dialog: MatDialog, private route: ActivatedRoute) {
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

    private getResultPaginated(uri: string) {
        this.paginatedResultUrl = environment.evoppiUrl + 'api/interaction/result/' + uri;
        this.interactionService.getInteractionResultSummarized(this.paginatedResultUrl)
            .subscribe((workRes) => {
                this.referenceInteractomes = workRes.referenceInteractomes;
                this.targetInteractomes = workRes.targetInteractomes;
                this.paginatorLength = workRes.totalInteractions;
                this.paginatedDataSource.load(this.paginatedResultUrl);
                this.paginatedDataSource.loading$.subscribe((res) => {
                    if (res === false) {
                        //this.showTable = true;
                    }
                });
                this.processing = false;
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

}
