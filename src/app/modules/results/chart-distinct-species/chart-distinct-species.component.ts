/*
 *  EvoPPI Frontend
 *
 * Copyright (C) 2017-2018 - Noé Vázquez, Miguel Reboiro-Jato,
 * Jorge Vieria, Sara Rocha, Hugo López-Fernández, André Torres,
 * Rui Camacho, Florentino Fdez-Riverola, and Cristina P. Vieira.
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
import {animate, style, transition, trigger} from '@angular/animations';
import {Interaction, Interactome} from '../../../entities/bio';
import {Link} from '../../../entities/bio/results/link.model';
import {Node} from '../../../entities/bio/results/node.model';
import {environment} from '../../../../environments/environment';
import {InteractionService} from '../services/interaction.service';
import {ActivatedRoute} from '@angular/router';
import {WorkResultManager} from '../../query/form-distinct-species/work-result-manager';

@Component({
    selector: 'app-chart-distinct-species',
    templateUrl: './chart-distinct-species.component.html',
    styleUrls: ['./chart-distinct-species.component.scss'],
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
export class ChartDistinctSpeciesComponent implements OnInit {

    graphWidth = 900;
    graphHeight = 450;

    referenceInteraction: Interaction[] = [];
    targetInteraction: Interaction[] = [];
    referenceInteractomes: Interactome[];
    targetInteractomes: Interactome[];

    nodes: Node[] = [];
    links: Link[] = [];
    lastQueryMaxDegree: number;

    fullResultAvailable = false;
    processing = false;

    uuid = '';

    constructor(private interactionService: InteractionService, private route: ActivatedRoute) {
    }

    ngOnInit() {
        this.uuid = this.route.snapshot.paramMap.get('id');

        this.getResult(environment.evoppiUrl + 'api/interaction/result/' + this.uuid);
    }

    public getResult(uri: string) {
        this.processing = true;
        this.interactionService.getInteractionResult(uri)
            .subscribe((res) => {
                const workManager = new WorkResultManager(res);

                this.lastQueryMaxDegree = res.queryMaxDegree;
                this.referenceInteractomes = res.referenceInteractomes;
                this.targetInteractomes = res.targetInteractomes;

                this.referenceInteraction = [];
                this.targetInteraction = [];

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

                            if (inReference) {
                                type = 1;
                            }

                            if (inTarget) {
                                type = 2;
                            }

                            if (inReference && inTarget) {
                                type = 3;
                            }

                            const indexGeneA = nodes.findIndex(node => node.label === geneAId);
                            const indexGeneB = nodes.findIndex(node => node.label === geneBId);

                            links.push(new Link(indexGeneA, indexGeneB, type));
                            nodes[indexGeneA].linkCount++;
                            nodes[indexGeneB].linkCount++;
                        }
                    }
                }

                this.nodes = nodes;
                this.links = links;

                this.fullResultAvailable = true;

                this.processing = false;
            });
    }

}
