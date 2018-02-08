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

import {
  Component, Input, ChangeDetectorRef, HostListener, ChangeDetectionStrategy, SimpleChanges, OnChanges
} from '@angular/core';
import {D3Service} from '../../services/d3.service';
import {ForceDirectedGraph} from '../../classes/force-directed-graph';
import {Node} from '../../classes/node';
import {GeneService} from '../../services/gene.service';
import {MatDialog} from '@angular/material';
import {GeneInfoComponent} from '../gene-info/gene-info.component';

@Component({
  selector: 'app-graph',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent implements OnChanges {

  @Input() nodes;
  @Input() links;
  @Input() graphWidth = 200;
  @Input() graphHeight = 200;

  graph: ForceDirectedGraph;
  private _options: { width, height };

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.graph.initSimulation(this.options);
  }

  constructor(private d3Service: D3Service, private ref: ChangeDetectorRef, public dialog: MatDialog) {}

  ngOnChanges(changes: SimpleChanges) {
    this.options = { width: this.graphWidth, height: this.graphHeight };

    this.graph = this.d3Service.getForceDirectedGraph(this.nodes, this.links, this.options);

    this.graph.ticker.subscribe((d) => {
      this.ref.markForCheck();
    });

    this.graph.initSimulation(this.options);
  }

  get options() {
    return this._options;
  }

  set options(value) {
    this._options = value;
  }

  onNodeClick(node: Node) {
    console.log(node);

    const dialogRef = this.dialog.open(GeneInfoComponent, {
      // width: '250px',
      maxHeight: window.innerHeight,
      data: { geneId: node.label, blastResults: node.blastResults }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });

  }
}
