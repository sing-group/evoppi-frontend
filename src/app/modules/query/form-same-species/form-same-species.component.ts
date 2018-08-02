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

import {Component, OnInit} from '@angular/core';
import {MatSnackBar} from '@angular/material';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {GeneInfo, Interaction, Interactome, Species} from '../../../entities/bio';
import {SpeciesService} from '../../results/services/species.service';
import {GeneService} from '../../results/services/gene.service';
import {InteractionService} from '../../results/services/interaction.service';
import {debounceTime, map} from 'rxjs/operators';
import {InteractomeService} from '../../results/services/interactome.service';
import {AbstractControl} from '@angular/forms/src/model';

@Component({
    selector: 'app-form-same-species',
    templateUrl: './form-same-species.component.html',
    styleUrls: ['./form-same-species.component.scss']
})
export class FormSameSpeciesComponent implements OnInit {
    public species: Species[];
    public interactomes: Interactome[] = [];
    public genes: GeneInfo[];

    public searchingGenes: boolean;
    public processing: boolean;

    public formSameSpecies: FormGroup;

    private controlInteractomes: AbstractControl;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private speciesService: SpeciesService,
        private interactomeService: InteractomeService,
        private geneService: GeneService,
        private interactionService: InteractionService,
        private formBuilder: FormBuilder,
        private snackBar: MatSnackBar,
    ) {}

    ngOnInit(): void {
        this.processing = false;
        this.searchingGenes = false;

        this.species = [];
        this.interactomes = [];
        this.genes = [];

        this.formSameSpecies = this.formBuilder.group({
            'species': ['', Validators.required],
            'interactomes': ['', Validators.required],
            'gene': ['', Validators.required],
            'level': ['1', [Validators.required, Validators.min(1), Validators.max(3)]],
        });

        this.controlInteractomes = this.formSameSpecies.controls['interactomes'];

        this.updateSpecies();

        this.formSameSpecies.get('species').valueChanges.subscribe(species => {
            this.updateInteractomes(species);
        });

        this.formSameSpecies.get('gene').valueChanges
            .pipe(debounceTime(500))
        .subscribe(res => this.updateGenes(res));
    }

    public selectAllInteractomes(): void {
        this.controlInteractomes.setValue(this.interactomes);
    }

    public deselectAllInteractomes(): void {
        this.controlInteractomes.setValue([]);
    }

    public onGeneSelected(value): void {
        this.formSameSpecies.patchValue({gene: value}, {emitEvent: false});
        this.genes = [];
    }

    public onRequestCompare(): void {
        if (this.processing || this.formSameSpecies.status === 'INVALID') {
            return;
        }

        this.processing = true;

        const formModel = this.formSameSpecies.value;
        this.interactionService.getSameSpeciesInteraction(
            formModel.gene,
            formModel.interactomes.map((item) => item.id),
            formModel.level
        )
            .subscribe(
                work => this.showNotification(),
                error => this.formSameSpecies.setErrors({'invalidForm': 'Error: ' + error.error}),
                () => this.processing = false
            );
    }

    private updateSpecies(): void {
        this.speciesService.getSpecies()
            .pipe(map(species => species.filter(specie => specie.interactomes.length > 1)))
        .subscribe(species => this.species = species);
    }

    private updateInteractomes(value: Species): void {
        this.interactomes = [];

        for (const interactome of value.interactomes) {
            this.interactomeService.getInteractome(interactome.id)
                .subscribe(
                    res => this.interactomes.push(res),
                    err => {},
                    () => this.interactomes.sort((a, b) => a.name < b.name ? -1 : 1)
                );
        }
    }

    private updateGenes(value: string): void {
        if (value === '') {
            this.genes = [];
            return;
        }
        this.searchingGenes = true;

        let interactomes = [];
        if (this.interactomes.length > 0) {
            interactomes = this.interactomes.map((interactome) => interactome.id);
        }
        this.geneService.getGeneName(value, interactomes)
            .subscribe(
                res => this.genes = res,
                error => {},
                () => this.searchingGenes = false
            );
    }

    private showNotification() {
        const snackBar = this.snackBar.open('Same species interactions requested', 'Go to results', {
            duration: 5000
        });
        snackBar.onAction().subscribe(() => this.router.navigate([
            this.route.routeConfig.data.resultsResource
        ]));
    }
}
