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
import {map} from 'rxjs/operators';
import {InteractomeService} from '../../results/services/interactome.service';

@Component({
    selector: 'app-form-same-species',
    templateUrl: './form-same-species.component.html',
    styleUrls: ['./form-same-species.component.scss']
})
export class FormSameSpeciesComponent implements OnInit {

    formSameSpecies: FormGroup;
    species: Species[];
    interactomes: Interactome[] = [];
    interaction: Interaction[] = [];
    genes: GeneInfo[];
    level: number;
    genesInput: string;
    searchingGenes = false;

    processing = false;


    constructor(private snackBar: MatSnackBar, private router: Router, private route: ActivatedRoute, private formBuilder: FormBuilder,
                private speciesService: SpeciesService, private geneService: GeneService, private interactionService: InteractionService,
                private interactomeService: InteractomeService) {
    }

    ngOnInit() {
        this.level = 1;
        this.genesInput = '';
        this.formSameSpecies = this.formBuilder.group({
            'species': ['', Validators.required],
            'interactomes': ['', Validators.required],
            'gene': ['', Validators.required],
            'level': ['1', [Validators.required, Validators.min(1), Validators.max(3)]],
        });
        this.getSpecies();
        this.formSameSpecies.controls.gene.valueChanges.debounceTime(500).subscribe((res) => {
            this.onSearchGenes(res);
        });
    }

    showNotification() {
        const snackBar = this.snackBar.open('Same species interactions requested', 'Go to results', {
            duration: 5000
        });
        snackBar.onAction().subscribe(() => this.router.navigate([
            this.route.routeConfig.data.resultsResource
        ]));
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
    }

    selectAllInteractomes(control: string, values) {
        this.formSameSpecies.controls[control].setValue(values);
    }

    deselectAllInteractomes(control: string) {
        this.formSameSpecies.controls[control].setValue([]);
    }

    onChangeSpecies(value: Species): void {
        this.interactomes = [];

        for (const interactome of value.interactomes) {
            this.interactomeService.getInteractome(interactome.id)
                .subscribe(res => {
                        this.interactomes.push(res);
                    },
                    err => {},
                    () => {
                        this.interactomes.sort((a, b) => a.name < b.name ? -1 : 1);
                    });
        }
    }

    onSearchGenes(value: string): void {
        let interactomes = [];
        if (value === '') {
            this.genes = [];
            return;
        }
        this.searchingGenes = true;
        if (this.interactomes.length > 0) {
            interactomes = this.interactomes.map((interactome) => interactome.id);
        }
        this.geneService.getGeneName(value, interactomes)
            .subscribe(res => {
                this.genes = res;
                this.searchingGenes = false;
            });

    }
    onCompare(): void {
        if (this.processing) {
            return;
        }
        this.processing = true;
        if (this.formSameSpecies.status === 'INVALID') {
            console.log('INVALID');
            return;
        }
        const formModel = this.formSameSpecies.value;
        this.interactionService.getSameSpeciesInteraction(formModel.gene, formModel.interactomes.map((item) => item.id),
            formModel.level)
            .subscribe((work) => {
                this.showNotification();
            }, (error) => {
                this.formSameSpecies.setErrors({'invalidForm': 'Error: ' + error.error});
                this.processing = false;
            });
    }

    public onGeneSelected(value) {
        this.genesInput = value;
        this.formSameSpecies.patchValue({gene: value}, {emitEvent: false});
        this.genes = [];
    }

}
