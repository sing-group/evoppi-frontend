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

import {Component, OnInit} from '@angular/core';
import {Node} from '../../../entities/bio/results/node.model';
import {Link} from '../../../entities/bio/results/link.model';
import {Interaction, Interactome} from '../../../entities/bio';
import {InteractionService} from '../services/interaction.service';
import {environment} from '../../../../environments/environment';
import {ActivatedRoute} from '@angular/router';
import {animate, style, transition, trigger} from '@angular/animations';
import {Status} from '../../../entities/execution';

@Component({
    selector: 'app-chart-same-species',
    templateUrl: './chart-same-species.component.html',
    styleUrls: ['./chart-same-species.component.scss'],
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
export class ChartSameSpeciesComponent implements OnInit {

    graphWidth = 900;
    graphHeight = 450;

    interaction: Interaction[] = [];
    resInteractomes: Interactome[] = [];

    nodes: Node[] = [];
    links: Link[] = [];
    lastQueryMaxDegree: number;

    fullResultAvailable = false;
    processing = false;

    uuid = '';

    resultAvailable = false;

    constructor(private interactionService: InteractionService, private route: ActivatedRoute) {
    }

    ngOnInit() {

        this.uuid = this.route.snapshot.paramMap.get('id');

        this.getResult(environment.evoppiUrl + 'api/interaction/result/' + this.uuid);
    }

    private getResult(uri: string) {
        this.processing = true;
        this.interactionService.getInteractionResult(uri)
            .subscribe((res) => {
                this.lastQueryMaxDegree = res.queryMaxDegree;
                this.interaction = res.interactions.interactions;
                this.resInteractomes = res.interactomes;

                const nodes = [];
                const links = [];

                for (const interaction of this.interaction) {
                    const from = new Node(nodes.length, interaction.geneA, interaction.geneAName);
                    let fromIndex = nodes.findIndex(x => x.label === from.label);
                    if (fromIndex === -1) {
                        fromIndex = nodes.length;
                        nodes.push(from);
                    } else {
                        nodes[fromIndex].linkCount++;
                    }

                    const to = new Node(nodes.length, interaction.geneB, interaction.geneBName);
                    let toIndex = nodes.findIndex(x => x.label === to.label);
                    if (toIndex === -1) {
                        toIndex = nodes.length;
                        nodes.push(to);
                    } else {
                        nodes[toIndex].linkCount++;
                    }

                    let link;

                    if (interaction.interactomeDegrees.length === res.interactomes.length) {
                        link = new Link(fromIndex, toIndex, 3);
                        links.push(link);
                    } else if (interaction.interactomeDegrees.length === 1) {
                        link = new Link(fromIndex, toIndex, 1);
                        links.push(link);
                    } else if (interaction.interactomeDegrees.length > 1
                        && interaction.interactomeDegrees.length < res.interactomes.length) {
                        link = new Link(fromIndex, toIndex, 2);
                        links.push(link);
                    } else {
                        console.error('Shouldn\'t happen', interaction.interactomeDegrees);
                    }
                }

                this.nodes = nodes;
                this.links = links;

                this.fullResultAvailable = true;

                this.processing = false;
                if (res.status === Status.COMPLETED) {
                    this.resultAvailable = true;
                }
            }, (error) => {
                this.processing = false;
                this.resultAvailable = false;
            });
    }
}
